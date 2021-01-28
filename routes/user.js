const express = require('express');

const router = express.Router();
const dashboardRouter = require('./dashboard');
const closetRouter = require('./closet');
const accountRouter = require('./account');
const calendarRouter = require('./calendar');

router.use((req, res, next) => {
  res.locals.username = req.session.username;
  next();
});

router.use('/dashboard', dashboardRouter);
router.use('/account', accountRouter);
router.use('/closet', closetRouter);
router.use('/calendar', calendarRouter);

module.exports = router;
