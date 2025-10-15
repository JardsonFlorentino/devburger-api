import express from 'express'
import routes from './routes'
import { resolve } from 'node:path'
import cors from 'cors'

import './database'

class App {
  constructor() {
    this.app = express()

    const allowedOrigins = [
      'https://devburger-interface-green.vercel.app',
      'https://devburgerr.netlify.app',
      'http://localhost:3001',
      'http://localhost:5173',
    ]

    this.app.use(
      cors({
        origin: function (origin, callback) {
          if (!origin) return callback(null, true)
          if (allowedOrigins.includes(origin)) {
            return callback(null, true)
          } else {
            return callback(new Error('Not allowed by CORS'))
          }
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
