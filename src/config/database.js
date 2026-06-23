const { Sequelize } = require('sequelize');
const config = require('./env');

const sequelize = new Sequelize(
  config.database.database,
  config.database.username,
  config.database.password,
  {
  host: config.database.host,
  port: config.database.port,
  dialect: config.database.dialect,

  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },

  logging: config.app.nodeEnv === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    operatorsAliases: false,
    define: {
      timestamps: true,
      underscored: true
    }
  }
);

module.exports = sequelize;
