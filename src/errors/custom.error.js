export default class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        // Captura la traza del error para saber dónde ocurrió (útil para desarrollo)
        Error.captureStackTrace(this, this.constructor);
    }
}