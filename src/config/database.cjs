module.exports = {
  use_env_variable: 'DATABASE_URL',
  dialect: 'postgres',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
}
