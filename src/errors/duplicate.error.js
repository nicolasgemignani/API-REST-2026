import CustomError from "./custom.error.js";

export default class DuplicateResourceError extends CustomError {
    constructor(resource = "Recurso", field = "valor") {
        super(`El ${resource} con ese ${field} ya existe`, 409);
    }
}