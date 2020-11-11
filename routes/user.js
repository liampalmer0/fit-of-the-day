const express = require('express');
const router = express.Router();
const dashboardRouter = require('./dashboard');
const closetRouter = require('./closet');
const accountRouter = require('./account');

// middleware to check the url param username matches the session
router.use(function checkUser(req, res, next) {
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
router.use('/account', accountRouter);
router.use('/closet', closetRouter);

module.exports = router;
