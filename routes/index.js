const express = require('express');
const router = express.Router();
const fs = require('fs');
const https = require('https');
const db = require('../db');

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
              return resolve(
                `${current_day.temperature}º${current_day.temperatureUnit}`
              );
            });
          })
          .on('error', (err) => {
            return reject(err);
          });
      } else {
        //uses placeholder JSON data for testing API calls
        fs.readFile('./test/json/weather.json', (err, data) => {
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
function testQuery(query) {
  return new Promise((resolve, reject) => {
    try {
      let res = db.query(query);
      return resolve(res);
    } catch (err) {
      // console.log(err);
      return reject(err);
    }
  });
}

async function getApiResults() {
  var currentTemp = 'Unavailable';
  var calStatus = 'Calendar Unavailable';
  var queryRes = 'Database Unavailable';
  //call APIs
  try {
    currentTemp = await callWeatherApi(false);
    let calData = await callCalendarApi();
    calStatus = processCalData(calData);
    queryRes = await testQuery('SELECT * FROM account');
    queryRes = `Query returned ${queryRes.rowCount} row(s)`;
  } catch (err) {
    // next(err);
    console.log(err);
  } finally {
    return {
      title: "Cher's Closet",
      cur_temp: currentTemp,
      cal_status: calStatus,
      query_res: queryRes,
    };
  }
}

function showDashboard(req, res, next) {
  getApiResults().then((result) => {
    //add any other vars to result object here
    //eg result.name = value;
    res.render('index', result);
  });
}

/* GET home page. */
router.get('/', showDashboard);

module.exports.router = router;
module.exports.callWeatherApi = callWeatherApi;
module.exports.callCalendarApi = callCalendarApi;
module.exports.testQuery = testQuery;
