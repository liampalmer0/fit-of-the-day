const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const authHelpers = require('./helpers');
const { models } = require('../sequelize');

const init = require('./passport');

init();

passport.use(
  new LocalStrategy(async (username, password, done) => {
    models.user
      .findAll({
        limit: 1,
        where: { username }
      })
      .then((user) => {
        if (!user || user.length === 0) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        return authHelpers.compareHash(
          password,
          user[0].getDataValue('password')
        );
      })
      .then((match) => {
        if (!match) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, true);
      })
      .catch((err) => {
        if (process.env.NODE_ENV === 'development') {
          console.log(err);
        }
        return done(null, false, { message: 'Unspecified Error.' });
      });
  })
);

module.exports = passport;
