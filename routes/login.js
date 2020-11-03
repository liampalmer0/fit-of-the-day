const express = require('express');
const router = express.Router();
const passport = require('../auth/local');

router.get('/', (req, res, next) => {
  let error = req.query.error;
  let data = {
    pagename: 'login',
    title: 'FOTD - Login',
    error: error,
  };
  res.render('login', data);
});

router.post(
  '/',
  passport.authenticate('local', {
    failureRedirect: '/login?error=true',
  }),
  function (req, res) {
    res.redirect('/' + req.body.username + '/dashboard');
  }
);

module.exports = router;
