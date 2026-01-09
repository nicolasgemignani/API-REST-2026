import express from 'express'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import swaggerUiExpress from 'swagger-ui-express'

import appRouter from './router/index.router.js'
import { initializePassport } from './config/passport.config.js'
import { specs } from './docs/swagger/config.swagger.js'
import { errorHandler } from './middleware/error.middleare.js'

const app = express()

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Passport
initializePassport()
app.use(passport.initialize())

// Swagger
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

// Rutas
app.use('/api', appRouter)

app.use(errorHandler);

export default app