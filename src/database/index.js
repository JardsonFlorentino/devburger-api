import { Sequelize } from 'sequelize'
import User from '../app/models/User.js'
import Product from '../app/models/Product.js'
import Category from '../app/models/Category.js'

const models = [User, Product, Category]

class Database {
  constructor() {
    this.init()
  }

  init() {
    this.connection = new Sequelize(process.env.DATABASE_URL, {
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false, // Railway PostgreSQL
        },
      },
    })

    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      )

    // Testa conexão (não trava)
    this.connection
      .authenticate()
      .then(() => console.log('🗄️ PostgreSQL conectado!'))
      .catch((err) => console.error('❌ PostgreSQL erro:', err))
  }
}

export default new Database()
