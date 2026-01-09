import CustomError from "./custom.error.js";

export default class NotFoundError extends CustomError {
    constructor(resource = "Recurso") {
        super(`${resource} no encontrado`, 404);
    }
}