const express = require('express');

const router = express.Router();
const dashboardRouter = require('./dashboard');
const closetRouter = require('./closet');
const settingsRouter = require('./settings');

router.use((req, res, next) => {
  res.locals.toParent = '';
  next();
});

router.use('/dashboard', dashboardRouter);
router.use('/settings', settingsRouter);
router.use('/closet', closetRouter);

module.exports = router;
