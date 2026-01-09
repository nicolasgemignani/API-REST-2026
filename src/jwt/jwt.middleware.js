import jwt from 'jsonwebtoken'

import { variables } from "../config/var.env.js";
import { generateTokens } from "./generate.jwt.js";
import { userService } from "../di.factory.js";

export const verifyToken = async (req, res, next) => {
    const accessToken = req.cookies.token; // Leer el accessToken desde las cookies
    const refreshToken = req.cookies.refreshToken; // Leer el refreshToken desde las cookies

    if (!accessToken) {
        return res.redirect('/login'); // Redirigir al login si no hay token
    }

    try {
        // Verificar el accessToken
        const decoded = jwt.verify(accessToken, variables.PRIVATE_KEY);
        const userEmail = decoded.email; // Asegúrate de que userId sea un ObjectId válido

        // Obtener el usuario desde la base de datos
        const user = await userService.getUser({email: userEmail});

        // Verificar que el usuario existe y que el tokenId coincida
        if (!user || user.tokenId !== decoded.tokenId) {
            return res.redirect('/login'); // Token no válido o sesión cerrada
        }

        req.user = decoded; // Adjuntar los datos del usuario al request
        return next(); // Continuar con la siguiente middleware
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            // El accessToken ha expirado
            if (!refreshToken) {
                return res.redirect('/login'); // Redirigir si no hay refreshToken
            }

            try {
                // Verificar y usar el refreshToken para generar nuevos tokens
                const decodedRefresh = jwt.verify(refreshToken, variables.REFRESH_KEY);
                const user = await userService.getUser({email:decodedRefresh.email}); // Obtener el usuario con el refresh token

                // Verificar que el tokenId coincida
                if (!user || user.tokenId !== decodedRefresh.tokenId) {
                    return res.redirect('/login'); // Token no válido o sesión cerrada
                }

                const newTokens = generateTokens(user); // Generar nuevos tokens

                // Actualizar las cookies con los nuevos tokens
                res.cookie('token', newTokens.accessToken, {
                    httpOnly: true,
                    secure: variables.NODE_ENV === 'production',
                });

                res.cookie('refreshToken', newTokens.refreshToken, {
                    httpOnly: true,
                    secure: variables.NODE_ENV === 'production',
                });

                req.user = jwt.verify(newTokens.accessToken, variables.PRIVATE_KEY); // Adjuntar datos del usuario
                return next(); // Continuar
            } catch (refreshError) {
                console.error('Error verificando el refresh token:', refreshError);
                return res.redirect('/login'); // Redirigir si el refreshToken no es válido
            }
        } else {
            console.error('Error verificando el token:', error);
            return res.redirect('/login'); // Redirigir para cualquier otro error
        }
    }
};