const express = require('express');
const router = express.Router();
const fs = require('fs');
const https = require('https');

/* GET home page. */
router.get('/', function (req, res, next) {
  callNWS(false)
    .then((temperature) => {
      console.log('API call returned : ' + temperature);
      //use pug view engine
      res.render('index', { cur_temp: temperature, title: "Cher's Closet" });
    })
    .catch((reason) => {
      console.error(`Error: ${reason}`);
    });
});

function callNWS(testing) {
  return new Promise(function (resolve, reject) {
    // Make our API call here.
    try {
      if (!testing) {
        // to customize the location of weather data, coordinates are needed
        // 2 requests: 1 for coords -> gridpoints; 1 for weather @ gridpoints
        // could create a JSON file of zip codes and coordindates
        // for autocomplete for choosing
        // var url = 'https://api.weather.gov/gridpoints/ILN/34,37/forecast'; //for cincinnati specifically
        // switch to openweathermap.org for precip
        var options = {
          host: 'api.weather.gov',
          path: '/gridpoints/ILN/34,37/forecast',
          protocol: 'https:',
          headers: { 'User-Agent': 'precogcloset' },
        };
        https.get(options, function (res) {
          // data is streamed in chunks from the server
          // so we have to handle the "data" event
          var buffer = '',
            data,
            current_day;

          res.on('data', function (chunk) {
            buffer += chunk;
          });

          res.on('end', function (err) {
            // finished getting data
            data = JSON.parse(buffer);
            //set the current days weather
            current_day = data.properties.periods[0];

            return resolve(current_day.temperature);
          });
        });
      } else {
        //uses placeholder JSON data for testing API calls
        var current_day;
        console.log(`using fake weather? : ${fs.existsSync('weather.json')}`);
        fs.readFile('weather.json', (err, data) => {
          let parsed = JSON.parse(data);
          //set the days weather
          current_day = parsed.properties.periods[0];
          // return the temp
          return resolve(current_day.temperature + current_day.temperatureUnit);
        });
      }
    } catch (err) {
      reject(`Error during API Call: ${err}`);
    }
    return;
  });
}

module.exports = router;
