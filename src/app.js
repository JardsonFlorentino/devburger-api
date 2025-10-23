import express from 'express'
import routes from './routes.js'
import path, { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import cors from 'cors'
import 'dotenv/config'
import './database/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class App {
  constructor() {
    this.app = express()

    // 🔹 Captura a variável CORS_ORIGINS do .env (pode conter vários domínios separados por vírgula)
    const allowedOrigins = process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(',').map(o => o.trim())
      : ['*'] // se não tiver definida, libera tudo temporariamente

    // 🔹 Middleware CORS
    this.app.use(
      cors({
        origin(origin, callback) {
          // Libera requisições sem origem (ex: Postman)
          if (!origin) return callback(null, true)

          // Libera todos os domínios se '*' estiver configurado
          if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
            return callback(null, true)
          }

          // Caso contrário, bloqueia
          return callback(new Error(`Not allowed by CORS: ${origin}`))
        },
        credentials: true,
        optionsSuccessStatus: 200,
      })
    )

    // 🔹 Permite JSON no body das requisições
    this.app.use(express.json())

    // 🔹 Servir arquivos estáticos (imagens, uploads, etc.)
    this.app.use(
      '/product-file',
      express.static(resolve(__dirname, '..', 'uploads'))
    )

    this.app.use(
      '/category-file',
      express.static(resolve(__dirname, '..', 'uploads'))
    )

    // 🔹 Registra as rotas
    this.routes()
  }

  routes() {
    this.app.use(routes)
  }
}

export default new App().app
