const express = require('express');

const router = express.Router();

/* GET settings page. */
router.get('/', (req, res, next) => {
  res.render('account', { pagename: 'account' });
});

module.exports = router;
