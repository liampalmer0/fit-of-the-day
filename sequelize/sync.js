const sequelize = require('sequelize');
// Testing Connection and Syncing Tables with Models
sequelize
  .authenticate()
  .then((err) => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.log('Unable to connect to the database:', err);
  })
  .then(() => {
    sequelize.sync();
  });
