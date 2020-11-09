const { Sequelize, DataTypes } = require('sequelize');
const associator = require('./associator');
const fs = require('fs');
const keys = JSON.parse(fs.readFileSync('keys.json', 'utf-8'));
const config = keys.db.config;

// In production the connection URL should be in an environment var
// const sequelize = new Sequelize(process.env.DB_CONNECTION_URL);
const sequelize = new Sequelize(config.database, config.user, config.password, {
  dialect: config.dialect,
  host: config.host,
});

const modelDefiners = [
  require('./models/user'),
  require('./models/closet'),
  require('./models/garment_type'),
  require('./models/dress_code'),
  require('./models/rating'),
  require('./models/article'),
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
