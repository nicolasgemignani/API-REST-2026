import CustomError from "./custom.error.js";

export default class UserAlreadyExistsError extends CustomError {
    constructor(email) {
        super(`El usuario con el email '${email}' ya está registrado`, 409);
    }
}