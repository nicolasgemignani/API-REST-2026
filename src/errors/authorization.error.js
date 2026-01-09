import CustomError from "./custom.error.js";

export default class AuthorizationError extends CustomError {
    constructor(message = "No tienes permisos para realizar esta acción") {
        super(message, 403);
    }
}