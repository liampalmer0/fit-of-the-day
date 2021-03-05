const express = require('express');
const router = express.Router();
const {
  getCalendarFrag,
  saveEvent
} = require('../controller/calendarController');

/* GET calendar page. */
router.get('/', (req, res) => {
  res.render('calendar-page', { pagename: 'calendar' });
});

router.post('/newEvent', saveEvent);

router.get('/events', getCalendarFrag);

module.exports = router;
