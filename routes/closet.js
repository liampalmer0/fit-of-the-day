var express = require('express');
var router = express.Router();

/* GET closet page. */
router.get('/', function (req, res, next) {
  res.send('This will be the closet page');
});

module.exports = router;
