const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const authHelpers = require('./helpers');
const { models } = require('../sequelize');

const init = require('./passport');

init();

passport.use(
  new LocalStrategy(function (username, password, done) {
    username = username.trim().toLowerCase();
    models.user
      .findOne({
        attributes: ['username', 'password'],
        where: { username }
      })
      .then((user) => {
        if (!user || user.length === 0) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        authHelpers
          .compareHash(password, user.getDataValue('password'))
          .then((match) => {
            if (!match) {
              return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, true);
          });
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
