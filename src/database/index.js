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

      // ✅ Models regulares (User, Product, Category)
      const models = [User, Product, Category]
      models.forEach((model) => model.init(this.connection))
      models.forEach((model) => model.associate?.(this.connection.models))

      // ✅ Order via factory (JÁ vem inicializado)
      const Order = OrderFactory(this.connection)

      // ✅ Associação do Order (se tiver)
      if (Order.associate) {
        Order.associate(this.connection.models)
      }

      console.log('🗄️ Tudo OK!')
    } catch (error) {
      console.error('❌ Erro:', error.message)
    }
  }
}

export default new Database()
