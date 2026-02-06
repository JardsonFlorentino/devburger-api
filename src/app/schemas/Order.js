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
    products: DataTypes.JSON, // Array como JSON
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: null,
    modelName: 'Order',
    tableName: 'Orders',
    timestamps: true,
  }
)

// ✅ DEFAULT EXPORT pro Controller
export default Order
