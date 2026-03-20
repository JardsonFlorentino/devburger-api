'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop legacy `password` column if it exists (Postgres supports IF EXISTS)
    await queryInterface.sequelize.query(
      'ALTER TABLE "users" DROP COLUMN IF EXISTS "password";'
    )
  },

  async down(queryInterface, Sequelize) {
    // No-op: column intentionally removed. If needed, recreate as TEXT nullable.
    await queryInterface.sequelize.query(
      'ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "password" TEXT;'
    )
  },
}
