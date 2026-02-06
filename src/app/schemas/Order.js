import { DataTypes, Model } from 'sequelize'

export class Order extends Model {}

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
    products: DataTypes.JSON, // Array vira JSON
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: null, // ← Será preenchido depois
    modelName: 'Order',
    tableName: 'Orders',
    timestamps: true,
  }
)
