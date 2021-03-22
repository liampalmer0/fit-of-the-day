const express = require('express');

const router = express.Router();
const passport = require('../auth/local');

router.get('/', (req, res, next) => {
  const { error } = req.query;
  const data = {
    pagename: 'login',
    title: 'FOTD - Login',
    error
  };
  res.render('login', data);
});

router.post(
  '/',
  passport.authenticate('local', {
    failureRedirect: '/login?error=true'
  }),
  (req, res) => {
    req.session.username = req.body.username.trim().toLowerCase();
    req.session.opStatus = {};
    res.redirect(`/${req.session.username}/dashboard`);
  }
);

module.exports = router;
