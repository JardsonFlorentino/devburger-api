import express from 'express'
import routes from './routes.js'
import path, { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import cors from 'cors'
import 'dotenv/config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class App {
  constructor() {
    this.app = express()

    // Captura os domínios autorizados do .env
    const allowedOrigins = process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim())
      : ['*']

    // Debug: log allowed origins at startup
    console.log('CORS allowed origins:', allowedOrigins)

    // Debug: log incoming origin for each request
    this.app.use((req, res, next) => {
      console.log('Incoming request origin:', req.headers.origin, 'method:', req.method, 'path:', req.path)
      next()
    })

    // Configuração do CORS
    this.app.use(
      cors({
        origin(origin, callback) {
          if (!origin) {
            return callback(null, true)
          }

          if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
            return callback(null, true)
          }

          return callback(new Error(`Not allowed by CORS: ${origin}`), false)
        },
        credentials: true,
        optionsSuccessStatus: 200,
      })
    )

    // Permitir JSON
    this.app.use(express.json())

    // Servir arquivos estáticos
    this.app.use(
      '/product-file',
      express.static(resolve(__dirname, '..', 'uploads'))
    )

    this.app.use(
      '/category-file',
      express.static(resolve(__dirname, '..', 'uploads'))
    )

    // Rotas
    this.routes()
  }

  routes() {
    this.app.use(routes)
  }
}

export default new App().app
