const express = require('express');
const router = express.Router();
const { getCurrentWeather } = require('../api/openWeatherMap');

router.post('/locate', (req, res) => {
  getCurrentWeather(req.body, true)
    .then(function (data) {
      req.session.temp = data.current;
      res.render('includes/weather-widget', {
        weather: data
      });
    })
    .catch((err) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(err);
      }
    });
});

module.exports = router;
