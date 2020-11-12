const express = require('express');
const router = express.Router();
const { models } = require('../sequelize');
const passport = require('../auth/local');

router.get('/', (req, res, next) => {
  let error = req.query.error ? req.query.error : '';
  let data = { pagename: 'signup', title: 'Sign Up', error: error };
  res.render('signup', data);
});

router.post('/', (req, res, next) => {
  models.user
    .create(req.body)
    .then(() => {
      passport.authenticate('local', (err, user, info) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          // respond(res, 401, info.message);
          return res.redirect('/signup?error=true');
        }
        req.logIn(user, function (err) {
          if (err) {
            return next(err);
          }
          req.session.username = req.body.username;
          return res.redirect('/' + req.body.username + '/dashboard');
        });
      })(req, res, next);
    })
    .catch((err) => {
      // respond(res, 500, 'Error lol');
      return res.redirect('/signup?error=true');
    });
});
// function respond(res, code, statusMsg) {
//   res.status(code).json({ status: statusMsg });
// }

module.exports = router;
