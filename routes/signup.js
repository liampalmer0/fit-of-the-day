const express = require('express');

const router = express.Router();
const { models } = require('../sequelize');
const { Op } = require('sequelize');
const passport = require('../auth/local');

router.get('/', (req, res, next) => {
  const error = req.query.error ? req.query.error : '';
  const data = { pagename: 'signup', title: 'Sign Up', error };
  res.render('signup', data);
});

router.post('/', (req, res, next) => {
  models.user
    .findOne({
      where: {
        [Op.or]: [{ email: req.body.email }, { username: req.body.username }]
      }
    })
    .then((rows) => {
      if (rows === null) {
        models.user
          .create({
            email: req.body.email.toLowerCase(),
            username: req.body.username.toLowerCase(),
            password: req.body.password
          })
          .then((newUser) =>
            models.closet.create({
              userId: newUser.dataValues.userId,
              name: 'Default Closet',
              desc: 'The starter closet'
            })
          )
          .then(() => {
            passport.authenticate('local', (err, user) => {
              if (err) {
                return next(err);
              }
              if (!user) {
                return res.redirect('/signup?error=true');
              }
              req.logIn(user, (err) => {
                if (err) {
                  return next(err);
                }
                req.session.username = req.body.username;
                req.session.opStatus = {};
                return res.redirect(`/${req.body.username}/dashboard`);
              });
            })(req, res, next);
          })
          .catch(() => res.redirect('/signup?error=true'));
      } else {
        throw new Error('Duplicate username or email');
      }
    })
    .catch(() => res.redirect('/signup?error=true'));
});

module.exports = router;
