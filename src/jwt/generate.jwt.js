import jwt from 'jsonwebtoken'
import crypto from 'crypto'

import { variables } from '../config/var.env.js'
import { userService } from '../di.factory.js'

export const generateTokens = (user) => {
    try {

        const tokenId = crypto.randomUUID(); // Generar un identificador único

        const { id, first_name, email, role, cart } = user

        const accessToken = jwt.sign(
            { id, first_name, email, role, cart, tokenId },
            variables.PRIVATE_KEY,
            { expiresIn: '10m'}
        )

        const refreshToken = jwt.sign(
            { id, first_name, email, role, cart, tokenId },
            variables.REFRESH_KEY,
            { expiresIn:'1d'}
        )

        // Guardar el tokenId en la base de datos
        userService.updateTokenId(user.id, tokenId);

        return { accessToken, refreshToken }
    } catch (error) {
        console.error('Error generando los tokens', error)
        throw new Error('Error generando los tokens')
    }
}