import Sequelize, { Model } from 'sequelize'

class Product extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        price: Sequelize.INTEGER,
        path: Sequelize.STRING,
        offer: Sequelize.BOOLEAN,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            const appUrl = process.env.APP_URL || ''
            if (!this.path) {
              return `${appUrl}/assets/default.jpg`
            }
            return `${appUrl}/product-file/${this.path}`
          },
        },
      },
      {
        sequelize,
        tableName: 'products', // ✅ ADICIONE
        timestamps: true,
      }
    )
    return this
  }

  static associate(models) {
    this.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category',
    })
  }
}

export default Product
