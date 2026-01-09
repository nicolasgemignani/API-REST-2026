import { Router } from 'express';
import { passportCall } from "../jwt/passport.middleware.js"; 
import { authorization } from "../middleware/auth/role.middleware.js";

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

    /**
     * Wrapper para manejar los métodos asíncronos del Controller y capturar errores.
     * @param {Function} callback - Método del Controller (ej: controller.getProducts).
     */
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

    /**
     * Genera la secuencia de middlewares para autenticación y autorización.
     * @param {string} policy - El rol requerido ('admin', 'user', 'public', etc.).
     */
    handlePolicies(policy) {
        return (req, res, next) => {
            // 1. Manejo de acceso público (no se requiere token)
            if (policy.toUpperCase() === 'PUBLIC') {
                return next();
            }

            // 2. Aplicar autenticación JWT usando passportCall
            // Si la autenticación falla, passportCall devolverá un error 401.
            // Si es exitosa, llenará req.user.
            passportCall("jwt", { session: false })(req, res, (err) => {
                if (err) return next(err); // Propaga errores (ej. token inválido o expirado)

                // 3. Aplicar autorización (verifica el rol en req.user)
                // Usamos la función authorization que tú ya definiste.
                authorization(policy)(req, res, next);
            });
        };
    }

    /**
     * Método abstracto que debe ser implementado por la subclase.
     * Aquí se definen las rutas específicas.
     */
    init() {
        throw new Error("The init() method must be implemented by the subclass.");
    }
}