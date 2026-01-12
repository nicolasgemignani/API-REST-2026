import jwt from 'jsonwebtoken'

import { variables } from '../config/var.env.js'

export const generateTokens = (user, tokenId) => { // Recibe el tokenId por parámetro
    try {
        const { id, first_name, email, role, cart } = user;

        const accessToken = jwt.sign(
            { id, first_name, email, role, cart, tokenId },
            variables.PRIVATE_KEY,
            { expiresIn: '10m'}
        );

        const refreshToken = jwt.sign(
            { id, first_name, email, role, cart, tokenId },
            variables.REFRESH_KEY,
            { expiresIn:'1d'}
        );

        return { accessToken, refreshToken };
    } catch (error) {
        console.error('Error generando los tokens', error);
        throw new Error('Error generando los tokens');
    }
}