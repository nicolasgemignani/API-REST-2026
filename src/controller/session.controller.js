import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import CurrentUserDTO from '../dto/current.dto.js';
import { generateTokens } from '../jwt/generate.jwt.js';
import { variables } from '../config/var.env.js';

export default class SessionController {
    constructor(userService) {
        this.userService = userService;
    }

    // Register a new user
    async register(req, res, next) {
        try {
            const newUser = await this.userService.createUser(req.body);

            res.status(201).json({ 
                status: 'success',
                payload: newUser 
            });
        } catch (error) {
            next(error);
        }
    }

    // Login
    async login(req, res) {
        const { email, password } = req.body;
        try {
            const user = await this.userService.validatePassword(email, password);
            if (!user) {
                return res.status(401).json({ status: 'error', message: 'Invalid email or password' });
            }

            const { accessToken, refreshToken } = generateTokens({
                id: user.id,
                role: user.role,
                first_name: user.firstName,
                email: user.email,
                cart: user.cart
            });

            // Set secure cookies
            const cookieOptions = { 
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production', 
                sameSite: 'Strict' 
            };

            res.cookie('token', accessToken, cookieOptions);
            res.cookie('refreshToken', refreshToken, cookieOptions);

            res.status(200).json({ status: 'success', message: 'Login successful', accessToken });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ status: 'error', message: 'Login failed. Please try again later.' });
        }
    }

    // Refresh token
    async refreshToken(req, res) {
        const { refreshToken } = req.cookies;
        if (!refreshToken) return res.status(401).json({ message: 'Refresh token missing' });

        try {
            // Verify refresh token
            const decoded = jwt.verify(refreshToken, variables.REFRESH_KEY);
            const user = await this.userService.getUser(decoded.id);

            // Check if user exists and if tokenId matches (security measure against token reuse)
            if (!user || user.tokenId !== decoded.tokenId) {
                return res.status(403).json({ message: 'Invalid refresh token' });
            }

            // Generate new tokens
            const { accessToken, refreshToken: newRefreshToken } = generateTokens({
                id: user._id,
                role: user.role,
                first_name: user.first_name,
                email: user.email,
                cart: user.cart
            });

            // Invalidate old token: update user's unique token ID
            this.userService.updateTokenId(user._id, crypto.randomUUID());

            const cookieOptions = { 
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production', 
                sameSite: 'Strict' 
            };
            
            // Set new access token (short expiry) and new refresh token (long expiry)
            res.cookie('token', accessToken, { ...cookieOptions, maxAge: 1000 * 60 * 15 }); // 15 mins
            res.cookie('refreshToken', newRefreshToken, { ...cookieOptions, maxAge: 1000 * 60 * 60 * 24 * 7 }); // 7 days

            res.status(200).json({ accessToken });
        } catch (error) {
            console.error('Error refreshing token:', error);
            res.status(403).json({ message: 'Invalid refresh token' });
        }
    }

    // Logout
    async logout(req, res) {
        // Clear all session cookies
        res.clearCookie('token');
        res.clearCookie('refreshToken');
        res.status(200).json({ status: 'success', message: 'Logged out successfully' });
    }

    // Get current user info (requires authentication middleware)
    async current(req, res) {
        try {
            // Assuming req.user is populated by a middleware with the decoded token payload
            const userDTO = new CurrentUserDTO(req.user); 
            res.status(200).json({ status: 'success', user: userDTO });
        } catch (error) {
            console.error('Error getting current user:', error);
            res.status(500).json({ status: 'error', message: 'Failed to retrieve user data' });
        }
    }
}