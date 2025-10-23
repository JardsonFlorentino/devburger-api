import { Sequelize } from 'sequelize'
import mongoose from 'mongoose'

import { createRequire } from 'module'

import User from '../app/models/User.js'
import Product from '../app/models/Product.js'
import Category from '../app/models/Category.js'
const require = createRequire(import.meta.url)

const configDataBase = require('../config/database.cjs')

const models = [User, Product, Category]

class DataBase {
  constructor() {
    this.init()
    this.mongo()
  }

  init() {
    this.connection = new Sequelize(configDataBase)
    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      )
  }

  mongo() {
    this.mongoConnection = mongoose.connect(process.env.MONGO_URL)
  }
}

export default new DataBase()
