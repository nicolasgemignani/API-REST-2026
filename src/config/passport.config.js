import passport from "passport";
import jwt from 'passport-jwt'

import { variables } from "./var.env.js";
import { userService } from "../di.factory.js";

const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

export const initializePassport = () => {

    const cookieExtractor = req => req?.cookies?.token || null;

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: variables.PRIVATE_KEY
    }, async (jwt_payload, done) => {
        try {
            // Verificar si el usuario existe en la base de datos
            const user = await userService.getUser({ email:jwt_payload.email})
            if (!user) {
                return done(null, false, { message: 'User not found' })
            }

            // Si el usuario existe, lo pasamos al siguiente middleware
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }))
}