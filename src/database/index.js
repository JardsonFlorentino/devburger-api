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
        logging: console.log, // ✅ Ver SQL pra debug
      })

      await this.connection.authenticate()
      console.log('✅ Conexão OK')

      // 1. Models regulares
      const models = [User, Product, Category]
      models.forEach((model) => model.init(this.connection))
      models.forEach((model) => model.associate?.(this.connection.models))

      // 2. Order factory
      const Order = OrderFactory(this.connection)
      if (Order.associate) {
        Order.associate(this.connection.models)
      }

      // 3. ✅ CRIA TODAS AS TABELAS
      console.log('📦 Criando tabelas...')
      await this.connection.sync({ force: false, alter: true })
      console.log('✅ Tabelas OK!')

      console.log('🗄️ Banco pronto!')
    } catch (error) {
      console.error('❌ Erro:', error.message)
      console.error(error)
    }
  }
}

export default new Database()
