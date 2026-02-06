import { DataTypes } from 'sequelize'

// ✅ FACTORY FUNCTION — recebe sequelize e SÓ ENTÃO cria o model
export default (sequelize) => {
  const Order = sequelize.define(
    'Order',
    {
      userId: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      userName: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      products: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'pending',
      },
    },
    {
      tableName: 'Orders',
      timestamps: true,
    }
  )

  return Order
}
