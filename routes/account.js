var express = require('express');
var router = express.Router();

/* GET account page. */
router.get('/', function (req, res, next) {
  res.send('This will be the account page');
});

module.exports = router;
