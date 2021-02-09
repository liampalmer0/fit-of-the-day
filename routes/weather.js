const express = require('express');
const router = express.Router();
const { getWeather, getCoords } = require('../api/openWeatherMap');

router.post('/locate', (req, res) => {
  let city = '';
  getCoords(req.body, true)
    .then(function (data) {
      city = data.city;
      return getWeather(req.body);
    })
    .then(function (weather) {
      weather.city = city;
      res.render('includes/weather', {
        weather
      });
    })
    .catch((err) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(err);
      }
    });
});

module.exports = router;
