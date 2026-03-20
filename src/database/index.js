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

      // 1. Init models (ordem importa!)
      User.init(this.connection)
      Category.init(this.connection) // Antes de Product!
      Product.init(this.connection)

      // 2. Sync apenas em ambientes de desenvolvimento.
      // Em produção use migrations (sequelize-cli) para manter o esquema seguro.
      if (process.env.NODE_ENV !== 'production') {
        console.log('📦 Criando Users...')
        await User.sync({ alter: true })

        console.log('📦 Criando Categories...')
        await Category.sync({ alter: true })

        console.log('📦 Criando Products...')
        await Product.sync({ alter: true })
      } else {
        console.log('ℹ️ NODE_ENV=production — pulando `sync` e confiando em migrations')
      }

      // 3. Associações
      User.associate?.(this.connection.models)
      Category.associate?.(this.connection.models)
      Product.associate?.(this.connection.models)

      // 4. Order factory
      console.log('📦 Criando Orders...')
      const Order = OrderFactory(this.connection)
      if (process.env.NODE_ENV !== 'production') {
        await Order.sync({ alter: true })
      }
      if (Order.associate) {
        Order.associate(this.connection.models)
      }

      console.log('✅ Todas tabelas criadas!')
      console.log('🗄️ Banco pronto!')
    } catch (error) {
      console.error('❌ Erro:', error.message)
      console.error(error)
    }
  }
}

export default new Database()
