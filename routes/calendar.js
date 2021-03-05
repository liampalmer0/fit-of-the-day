const express = require('express');
const router = express.Router();
// const { models } = require('../sequelize');
const { getCalendarFrag } = require('../controller/calendarController');

/* GET calendar page. */
router.get('/', (req, res) => {
  res.render('calendar-page', { pagename: 'calendar' });
});
/* POST ajax for adding cal event. */
router.post('/add', (req, res) => {
  // add event with data to db
  // res.render calendar body pug fragment with updated data
  res.send('you just posted for a new calendar event');
});

router.get('/events', getCalendarFrag);

module.exports = router;
