import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import CurrentUserDTO from '../dto/current.dto.js';
import { generateTokens } from '../jwt/generate.jwt.js';
import { variables } from '../config/var.env.js';

export default class SessionController {
    constructor(userService, blacklistService) {
        this.userService = userService;
        this.blacklistService = blacklistService;
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
            const decoded = jwt.verify(refreshToken, variables.REFRESH_KEY);
            const user = await this.userService.getUser(decoded.id);

            if (!user || user.tokenId !== decoded.tokenId) {
                return res.status(403).json({ message: 'Invalid refresh token', reason: 'TokenId mismatch' });
            }

            // 1. Generamos EL ÚNICO tokenId nuevo
            const newTokenId = crypto.randomUUID();

            // 2. Generamos tokens usando ese ID
            const { accessToken, refreshToken: newRefreshToken } = generateTokens(user, newTokenId);

            // 3. Actualizamos la DB UNA SOLA VEZ
            await this.userService.updateTokenId(user._id, newTokenId);

            const cookieOptions = { 
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production', 
                sameSite: 'Strict' 
            };
            
            res.cookie('token', accessToken, { ...cookieOptions, maxAge: 1000 * 60 * 15 });
            res.cookie('refreshToken', newRefreshToken, { ...cookieOptions, maxAge: 1000 * 60 * 60 * 24 * 7 });

            res.status(200).json({ accessToken });
        } catch (error) {
            res.status(403).json({ message: 'Invalid refresh token', debug: error.message }); 
        }
    }

    // Logout
    async logout(req, res) {
        try {
            // 1. Obtener tokens (priorizamos body si no hay cookies para el test de Postman)
            const accessToken = req.body.token || req.cookies?.token;
            const refreshToken = req.cookies?.refreshToken;

            // 2. Blacklist para el Access Token
            if (accessToken) {
                // Si el service espera (token, expires), calculamos el tiempo
                const decodedAcc = jwt.decode(accessToken);
                const now = Math.floor(Date.now() / 1000);
                const ttl = decodedAcc ? (decodedAcc.exp - now) : 900; 

                await this.blacklistService.addToBlacklist(accessToken, ttl);
            }

            // 3. Invalidar Refresh Token (Rotar el tokenId en la DB)
            // Intentamos sacar el ID del refresh token
            const decodedRef = refreshToken ? jwt.decode(refreshToken) : null;
            
            if (decodedRef && decodedRef.id) {
                await this.userService.updateTokenId(decodedRef.id, crypto.randomUUID());
            }

            // 4. Limpiar cookies
            res.clearCookie('token');
            res.clearCookie('refreshToken');

            return res.status(200).json({ message: "Sesión cerrada correctamente" });

        } catch (error) {
            console.error("FALLÓ EL LOGOUT:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
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