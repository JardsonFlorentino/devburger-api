'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // Remover a coluna apenas se ela existir (tornar a migration idempotente)
    const table = await queryInterface.describeTable('products')
    if (table && Object.prototype.hasOwnProperty.call(table, 'category')) {
      await queryInterface.removeColumn('products', 'category')
    }
  },

  async down(queryInterface, Sequelize) {
    // Adicionar a coluna apenas se ela não existir
    const table = await queryInterface.describeTable('products')
    if (!table || !Object.prototype.hasOwnProperty.call(table, 'category')) {
      await queryInterface.addColumn('products', 'category', {
        type: Sequelize.STRING,
        allowNull: true,
      })
    }
  },
}
