// error.middleware.js
export const errorHandler = (err, req, res, next) => {
    const status = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // En lugar de console.error(err), usamos algo más formateado:
    console.error(`[ERROR ${status}]: ${message}`);

    res.status(status).json({
        status: "error",
        message: message
    });
};