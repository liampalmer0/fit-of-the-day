const express = require('express');
const router = express.Router();
const { getCurrentWeather } = require('../api/openWeatherMap');

router.post('/locate', (req, res) => {
  getCurrentWeather(req.body, true)
    .then(function (data) {
      res.render('includes/weather', {
        data
      });
    })
    .catch((err) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(err);
      }
    });
});

module.exports = router;
