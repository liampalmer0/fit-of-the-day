const express = require('express');
const router = express.Router();
const fs = require('fs');

/* GET home page. */
router.get('/', function (req, res, next) {
  callNWS(true)
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
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
  return new Promise(function (resolve, reject) {
    // Make our API call here.
    try {
      if (!testing) {
        //API currently doesn't work; still need to setup api key
        var url = 'https://api.weather.gov/gridpoints/ILN/34,37/forecast';

        http.get(url, function (response) {
          // data is streamed in chunks from the server
          // so we have to handle the "data" event
          var buffer = '',
            data,
            current_day;

          response.on('data', function (chunk) {
            buffer += chunk;
          });

          response.on('end', function (err) {
            // finished getting data
            // console.log(buffer);
            // console.log('\n');
            data = JSON.parse(buffer);

            //set the current days weather
            current_day = data.properties.periods[0];

            // console.log(
            //     current_day.temperature +
            //     current_day.temperatureUnit
            // );

            // return the temp
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
