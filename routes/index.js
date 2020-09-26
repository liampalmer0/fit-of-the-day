const express = require('express');
const router = express.Router();
const fs = require('fs');
const https = require('https');

/* GET home page. */
router.get('/', showDashboard);

function callWeatherApi(testing) {
  return new Promise((resolve, reject) => {
    try {
      if (!testing) {
        // could create a JSON file of zip codes and coordindates to pass to api
        // for autocomplete for choosing
        // switch to openweathermap.org for precip
        var options = {
          host: 'api.weather.gov',
          path: '/gridpoints/ILN/34,37/forecast',
          protocol: 'https:',
          headers: { 'User-Agent': 'precogcloset' },
        };
        https
          .get(options, (res) => {
            if (res.statusCode != 200) {
              return reject(`API ${res.statusCode} Error`);
            }
            var buffer = '';
            // data is streamed in chunks from the server on "data" event
            res.on('data', function (chunk) {
              buffer += chunk;
            });
            res.on('end', function (err) {
              // finished getting data
              let data = JSON.parse(buffer);
              //set the current days weather
              let current_day = data.properties.periods[0];
              return resolve(current_day);
            });
          })
          .on('error', (err) => {
            return reject(err);
          });
      } else {
        //uses placeholder JSON data for testing API calls
        fs.readFile('weather.json', (err, data) => {
          let parsed = JSON.parse(data);
          let current_day = parsed.properties.periods[0];
          return resolve(current_day);
        });
      }
    } catch (err) {
      return reject(`Weather API call failed: ${err}`);
    }
  });
}

function callCalendarApi() {
  return new Promise((resolve, reject) => {
    try {
      //placeholder to simulate api response
      return resolve({ msg: 'No events today', count: 0 });
    } catch (err) {
      return reject(`Calendar API call failed: ${err}`);
    }
  });
}

function processCalData(data) {
  if (data.count <= 0) {
    return data.msg;
  } else if (data.count === 1) {
    return `There is one event today : ${data.msg}`;
  } else {
    return `There are ${data.count} events today`;
  }
}

function showDashboard(req, res, next) {
  //call APIs
  Promise.all([callWeatherApi(false), callCalendarApi()])
    .then((result) => {
      let weatherData = result[0];
      let calData = result[1];
      let calStatus = processCalData(calData);
      res.render('index', {
        cur_temp: weatherData.temperature + weatherData.temperatureUnit,
        cal_status: calStatus,
        title: "Cher's Closet",
      });
    })
    .catch((reason) => {
      console.error(`Error : ${reason}`);
      res.render('index', {
        cur_temp: 'unavailable',
        cal_status: 'Calendar Unavailable',
        title: "Cher's Closet",
      });
    });
}

module.exports = router;
