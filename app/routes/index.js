const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
  const data = {
    pagename: 'index',
    title: 'Fit of the Day - Welcome'
  };
  res.render('index', data);
});
router.get('/about', (req, res, next) => {
  const data = {
    pagename: 'about',
    title: 'About FOTD'
  };
  res.render('about', data);
});
module.exports = router;
