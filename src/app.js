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

   
    const allowedOrigins = process.env.CORS_ORIGINS.split(',')

   
    this.app.use(
      cors({
        origin(origin, callback) {
          if (!origin) return callback(null, true) 
          if (allowedOrigins.includes(origin)) {
            return callback(null, true)
          }
          return callback(new Error('Not allowed by CORS'))
        },
        credentials: true,
        optionsSuccessStatus: 200,
      })
    )

    
    this.app.options('*', cors())

    this.app.use(express.json())

    
    this.app.use(
      '/product-file',
      express.static(resolve(__dirname, '..', 'uploads'))
    )
    this.app.use(
      '/category-file',
      express.static(resolve(__dirname, '..', 'uploads'))
    )

    this.routes()
  }

  routes() {
    this.app.use(routes)
  }
}

export default new App().app
