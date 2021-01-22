const express = require('express');

const router = express.Router();
const dashboardRouter = require('./dashboard');
const closetRouter = require('./closet');
const accountRouter = require('./account');

router.use((req, res, next) => {
  res.locals.toParent = '';
  next();
});

router.use('/dashboard', dashboardRouter);
router.use('/account', accountRouter);
router.use('/closet', closetRouter);

module.exports = router;
