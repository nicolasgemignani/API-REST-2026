import app from './app.js'
import connectDB from './config/connect.config.js'
import { variables } from './config/var.env.js'

const PORT = variables.PORT

// Conectar DB y luego iniciar servidor
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT}`)
    })
  })
  .catch(err => {
    console.error('❌ Error al conectar a la base de datos:', err)
    process.exit(1)
  })