module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Altera o tipo da coluna 'id' na tabela 'categories' para INTEGER
    await queryInterface.changeColumn('categories', 'id', {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Garante que seja autoincrementável
    })

    // 2. Garante que 'category_id' na tabela 'products' seja INTEGER (caso não esteja)
    await queryInterface.changeColumn('products', 'category_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    })
  },

  down: async (queryInterface, Sequelize) => {
    // A função 'down' deve reverter o que foi feito na 'up'
    // ...
  },
}
