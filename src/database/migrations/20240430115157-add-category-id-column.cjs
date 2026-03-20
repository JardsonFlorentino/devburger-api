'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Idempotent: only add column if it doesn't exist to avoid failures
    await queryInterface.sequelize.query(
      `ALTER TABLE "products" ADD COLUMN IF NOT EXISTS category_id INTEGER;`
    )

    // Note: adding FK constraint conditionally is more complex; keep reference
    // as manual step if needed. This migration ensures the column exists.
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('products', 'category_id')
  },
}
