const express = require('express');
const router = express.Router();
const dashboardRouter = require('./dashboard');
const closetRouter = require('./closet');
const settingsRouter = require('./settings');

// middleware to check the url param username matches the session
router.use(function checkUser(req, res, next) {
  res.locals.toParent = '';
  if (res.locals.username !== req.session.username) {
    res.render('error', {
      message: 'Unauthorized',
      error: { status: 'User authentication failed', stack: '' },
    });
  } else {
    next();
  }
});

router.use('/dashboard', dashboardRouter);
router.use('/settings', settingsRouter);
router.use('/closet', closetRouter);

module.exports = router;
