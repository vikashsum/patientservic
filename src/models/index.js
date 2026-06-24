const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const config = require('../config/env');

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
    define: {
      timestamps: true,
      underscored: true
    }
  }
);

const db = {};

// Load models
const modelFiles = fs.readdirSync(__dirname).filter(
  file => file.endsWith('.js') && file !== 'index.js'
);

modelFiles.forEach(file => {
  const model = require(path.join(__dirname, file))(sequelize);
  db[model.name] = model;
});

// Set up associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
