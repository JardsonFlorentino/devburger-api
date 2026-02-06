import { Sequelize } from 'sequelize'
import User from '../app/models/User.js'
import Product from '../app/models/Product.js'
import Category from '../app/models/Category.js'
import OrderFactory from '../app/schemas/Order.js'

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

      // ✅ Cria Order via factory
      const Order = OrderFactory(this.connection)

      // ✅ Adiciona Order aos models
      const models = [User, Product, Category, Order]

      models.forEach((model) => {
        if (model.init) model.init(this.connection)
      })

      models.forEach((model) => {
        if (model.associate) model.associate(this.connection.models)
      })

      console.log('🗄️ Tudo OK!')
    } catch (error) {
      console.error('❌ Erro:', error.message)
    }
  }
}

export default new Database()
