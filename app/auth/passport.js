const passport = require('passport');
// const { models } = require('../sequelize');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
  // passport.serializeUser((user, done) => {
  //   done(null, user.id);
  // });

  // passport.deserializeUser((id, done) => {
  //   models.user
  //     .findAll({
  //       limit: 1,
  //       where: { userId: id },
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
