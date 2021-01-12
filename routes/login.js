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
    req.session.username = req.body.username;
    res.redirect(`/${req.body.username}/dashboard`);
  }
);

module.exports = router;
