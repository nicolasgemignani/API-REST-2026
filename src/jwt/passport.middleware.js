import passport from "passport"

export const passportCall = (strategy) => {
    return (req, res, next) => {
        passport.authenticate(strategy, (error, user, info) => {
            if (error) {
                return next(error) // Manejo de errores
            }
            if (!user) {
                return res.status(401).send({ error: info?.message || 'Unauthorized' })
            }
            req.user = user // Establecer el usuario autenticado en req.user
            next()
        })(req, res, next)
    };
};