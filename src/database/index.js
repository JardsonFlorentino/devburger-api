import { Sequelize } from 'sequelize'
import User from '../app/models/User.js'
import Product from '../app/models/Product.js'
import Category from '../app/models/Category.js'
import Order from '../app/schemas/Order.js' // ← Adicione aqui

const models = [User, Product, Category, Order]

class Database {
  constructor() {
    console.log('🔄 Iniciando banco...')
    this.init()
  }

  async init() {
    try {
      this.connection = new Sequelize(process.env.DATABASE_URL, {
        dialectOptions: {
          ssl: { require: true, rejectUnauthorized: false },
        },
        logging: false,
      })

      await this.connection.authenticate()
      console.log('✅ Conexão OK')

      // Passa a conexão pros models
      models.forEach((model) => (model.sequelize = this.connection))

      models.forEach((model) => model.init(this.connection))
      models.forEach((model) => model.associate?.(this.connection.models))

      console.log('🗄️ Todos models OK!')
    } catch (error) {
      console.error('❌ Erro banco:', error.message)
    }
  }
}

export default new Database()
