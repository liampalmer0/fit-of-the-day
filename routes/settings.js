const express = require('express');

const router = express.Router();

/* GET settings page. */
router.get('/', (req, res, next) => {
  res.render('settings', { pagename: 'settings' });
});

module.exports = router;
