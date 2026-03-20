'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add password_hash column if it doesn't exist (safe for existing DBs)
    await queryInterface.sequelize.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS password_hash VARCHAR;`
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'password_hash')
  },
}
