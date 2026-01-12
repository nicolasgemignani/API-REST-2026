import { Router } from 'express';
import { passportCall } from "../jwt/passport.middleware.js";
import { AuthorizationError, AuthenticationError } from "../errors/index.js"

export default class BaseRouter {
    constructor() {
        this.router = Router();  
    }

    getRouter() {
        return this.router;
    }

    applyRoute(path, method, callbacks) {
        const processedCallbacks = callbacks.map(callback => {
            // Si el callback es un string, asumimos que es un rol para autorización.
            if (typeof callback === 'string') {
                return this.handlePolicies(callback);
            }
            // Si es una función, es un middleware o el método del controller.
            return this.applyController(callback);
        });

        this.router[method](path, ...processedCallbacks);
    }

    // --- Métodos de Conveniencia (Shorthands) ---

    get(path, ...callbacks) {
        this.applyRoute(path, 'get', callbacks);
    }

    post(path, ...callbacks) {
        this.applyRoute(path, 'post', callbacks);
    }

    put(path, ...callbacks) {
        this.applyRoute(path, 'put', callbacks);
    }

    delete(path, ...callbacks) {
        this.applyRoute(path, 'delete', callbacks);
    }
    
    // --- Lógica de Manejo de Rutas ---
    applyController(callback) {
        // Retorna una función de Express (req, res, next)
        return async (req, res, next) => {
            try {
                // El .bind(this.controller) asegura que el contexto (this) sea el Controller, no el Router.
                await callback.bind(this.controller)(req, res, next);
            } catch (error) {
                // Pasa el error al manejador de errores de Express
                next(error);
            }
        };
    }

    handlePolicies(policy) {
        return (req, res, next) => {
            // 1. Si es público, pasa directo
            if (policy.toUpperCase() === 'PUBLIC') return next();

            // 2. Ejecutamos Passport para autenticar el token JWT
            passportCall('jwt')(req, res, (err) => {
                // Si hubo un error en el proceso de autenticación o no hay usuario
                if (err || !req.user) {
                    return next(new AuthenticationError("Token inválido o ausente"));
                }

                // 3. Verificación de Rol (Autorización)
                const userRole = req.user.role?.toUpperCase();
                const requiredRole = policy.toUpperCase();

                // Si el usuario no tiene el rol necesario
                if (userRole !== requiredRole && requiredRole !== 'USER') { 
                    // Nota: Podrías expandir esto si un ADMIN también puede hacer cosas de USER
                    return next(new AuthorizationError());
                }

                next();
            });
        };
    }

    init() {
        throw new Error("The init() method must be implemented by the subclass.");
    }
}