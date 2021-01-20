const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs');
const associator = require('./associator');

const keys = JSON.parse(fs.readFileSync('keys.json', 'utf-8'));
const { dev, prod } = keys.db.config;

// In production the connection URL should be in an environment var
// const sequelize = new Sequelize(process.env.DB_CONNECTION_URL);
var sequelize = {};
if (process.env.NODE_ENV === 'development') {
  sequelize = new Sequelize(dev.database, dev.user, dev.password, {
    dialect: dev.dialect,
    host: dev.host
  }); 
} else if (process.env.NODE_ENV === 'production') {
  sequelize = new Sequelize(prod.database, prod.user, prod.password, {
    dialect: prod.dialect,
    host: prod.host
  });
}

const modelDefiners = [
  require('./models/user'),
  require('./models/closet'),
  require('./models/garmentType'),
  require('./models/dressCode'),
  require('./models/rating'),
  require('./models/article')
  // Add more models here...
  // require('./models/item'),
];

for (const modelDefiner of modelDefiners) {
  modelDefiner(sequelize, DataTypes);
}

// We execute any extra setup after the models are defined, such as adding associations.
// applyExtraSetup(sequelize);
associator(sequelize);

module.exports = sequelize;
