const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  let data = {
    pagename: 'index',
    title: 'Fit of the Day - Welcome',
  };
  res.render('index', data);
});

module.exports = router;
