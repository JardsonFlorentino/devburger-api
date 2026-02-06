import { DataTypes, Model } from 'sequelize'

export class Order extends Model {}

Order.init(
  {
    user: {
      id: DataTypes.STRING(50),
      name: DataTypes.STRING(100),
    },
    products: DataTypes.JSON, // Array completo
    status: DataTypes.STRING(20),
  },
  {
    sequelize: null, // ← NULL até database passar
    modelName: 'Order',
    tableName: 'Orders',
    timestamps: true,
  }
)

// Default export
export default Order
