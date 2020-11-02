const passport = require('passport');
// const { models } = require('../sequelize');

module.exports = () => {
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });
  // passport.serializeUser((user, done) => {
  //   done(null, user.id);
  // });

  // passport.deserializeUser((id, done) => {
  //   models.user
  //     .findAll({
  //       limit: 1,
  //       where: { user_id: id },
  //     })
  //     .then((user) => {
  //       done(null, user);
  //     })
  //     .catch((err) => {
  //       console.log(err)
  //       done(err, null);
  //     });
  // });
};
