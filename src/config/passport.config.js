import passport from "passport";
import jwt from 'passport-jwt'

import { variables } from "./var.env.js";
import { userService } from "../di.factory.js";
import { blacklistService } from "../di.factory.js";

const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

export const initializePassport = () => {
    const cookieExtractor = req => req?.cookies?.token || null;

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: variables.PRIVATE_KEY,
        passReqToCallback: true // <--- Agregá esto para poder leer la cookie aquí abajo
    }, async (req, jwt_payload, done) => { // <--- Agregá 'req' como primer parámetro
        try {
            // 1. Verificar Blacklist
            const token = cookieExtractor(req);
            const isBlacklisted = await blacklistService.getBlacklistedToken(token);
            
            if (isBlacklisted) {
                return done(null, false, { message: 'Token invalidated' });
            }

            // 2. Tu lógica actual de verificar usuario
            const user = await userService.getUser({ email: jwt_payload.email });
            if (!user) {
                return done(null, false, { message: 'User not found' });
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));
}