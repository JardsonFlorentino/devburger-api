import { DataTypes, Model } from 'sequelize'

class Order extends Model {}

Order.init(
  {
    user: {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    products: [
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        category: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        url: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
    ],
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: null, // Vai ser passado depois no database/index.js
    modelName: 'Order',
    tableName: 'Orders',
    timestamps: true,
  }
)

export default Order
