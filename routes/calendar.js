const express = require('express');
const router = express.Router();
const {
  getCalendarFrag,
  saveEvent,
  loadEvents
} = require('../controller/calendarController');

/* GET calendar page. */
router.get('/', (req, res) => {
  res.render('calendar-page', {
    pagename: 'calendar',
    title: 'FOTD - Calendar'
  });
});

router.post('/newEvent', saveEvent);

router.get('/events', getCalendarFrag);

router.get('/load', loadEvents);

module.exports = router;
