// const Sequelize = require('sequelize');
const s = require('./index');
// Testing Connection and Syncing Tables with Models
s.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.log('Unable to connect to the database:', err);
  })
  .then(() => {
    s.sync({ force: true });
  });
