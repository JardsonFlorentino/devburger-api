import { Sequelize } from 'sequelize'
import User from '../app/models/User.js'
import Product from '../app/models/Product.js'
import Category from '../app/models/Category.js'
import Order from '../app/schemas/Order.js'

const models = [User, Product, Category, Order]

class Database {
  constructor() {
    console.log('🔄 Banco...')
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

      // 1. PASSA SEQUELIZE
      models.forEach((model) => (model.sequelize = this.connection))

      // 2. CHAMA init() AQUI
      models.forEach((model) =>
        model.init(model.rawAttributes, { sequelize: this.connection })
      )

      // 3. Associações
      models.forEach((model) => model.associate?.(this.connection.models))

      console.log('🗄️ Tudo OK!')
    } catch (error) {
      console.error('❌ Erro:', error.message)
    }
  }
}

export default new Database()
