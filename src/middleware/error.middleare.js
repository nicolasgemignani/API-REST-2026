export const errorHandler = (err, req, res, next) => {
    let status = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // "Traducción" de errores de base de datos
    if (err.name === 'CastError') {
        status = 400;
        message = `ID con formato inválido: ${err.value}`;
    }

    if (err.code === 11000) {
        status = 409;
        message = "El registro ya existe (clave duplicada)";
    }

    console.error(`[ERROR ${status}]: ${message}`);

    res.status(status).json({
        status: "error",
        message: message
    });
};