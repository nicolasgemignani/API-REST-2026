import CustomError from "./custom.error.js";

export default class AuthenticationError extends CustomError {
    constructor(message = "Credenciales inválidas") {
        super(message, 401);
    }
}