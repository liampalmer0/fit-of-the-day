// const Sequelize = require('sequelize');
const myArgs = process.argv.slice(2);
const force = myArgs[0] === 'force' ? true : false;
const alter = myArgs[0] === 'alter' ? true : false;

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
    if (alter) {
      s.sync({ alter: true });
    }
    else if (force) {
      s.sync({ force: true });
    }
    else {
      console.log('No CLI args passed. Performing default sync');
      s.sync();
    }
  });

  