const { Sequelize, DataTypes } = require('sequelize');
// const { applyExtraSetup } = require('./extra-setup'); //currently DNE

const config = {
  database: 'fotd',
  user: 'cher',
  password: 'horowitz',
  options: {
    host: 'localhost',
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  },
};

// In production the connection URL should be in an environment var
// const sequelize = new Sequelize(process.env.DB_CONNECTION_URL);
const sequelize = new Sequelize(
  config.database,
  config.user,
  config.password,
  config.options
);

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

//Testing Connection and Syncing Tables with Models
// sequelize
//   .authenticate()
//   .then((err) => {
//     console.log('Connection has been established successfully.');
//   })
//   .catch((err) => {
//     console.log('Unable to connect to the database:', err);
//   })
//   .then(() => {
//     sequelize.sync()
//   });

module.exports = sequelize;
