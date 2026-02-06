import { DataTypes } from 'sequelize'

export default (sequelize) => {
  const Order = sequelize.define(
    'Order',
    {
      userId: DataTypes.STRING(50),
      userName: DataTypes.STRING(100),
      products: DataTypes.JSON,
      status: {
        type: DataTypes.STRING(20),
        defaultValue: 'pending',
      },
    },
    {
      tableName: 'orders', // ✅ MINÚSCULO
      timestamps: true,
    }
  )

  return Order
}
