const https = require('https');
const db = require('../db');

function getCoords(zipCode) {
  return new Promise((resolve, reject) => {
    let apiKey = '...';
    const options = {
      host: 'api.openweathermap.org',
      port: 443,
      path: `/data/2.5/weather?zip=${zipCode},us&exclude=minutely,alerts&units=imperial&appid=${apiKey}`,
      method: 'GET',
    };
    const req = https.request(options, (res) => {
      if (res.statusCode != 200) {
        reject(`API ${res.statusCode} Error`);
      } else {
        var buffer = '';
        // data is streamed in chunks from the server on "data" event
        res.on('data', (data) => {
          buffer += data;
        });
        res.on('end', () => {
          // finished getting data
          let data = JSON.parse(buffer);
          //set the current days weather
          resolve({ lat: data.coord.lat, lon: data.coord.lon });
        });
      }
    });
    req.on('error', (err) => {
      reject(err);
    });
    req.end();
  });
}
async function getWeather(coordinates) {
  return Promise.resolve(coordinates.lat + ' and ' + coordinates.lon);
}

function callCalendarApi() {
  return new Promise((resolve) => {
    return setTimeout(resolve({ msg: 'No Events Today', count: 0 }), 100);
  });
}

async function testQuery(query) {
  return await db.query(query);
}

async function getApiResults() {
  let weather = 'Unavailable';
  let calStatus = 'Calendar Unavailable';
  let queryRes = 'Database Unavailable';
  let outfits = [
    { top: 'top1', bottom: 'btm1' },
    { top: 'top2', bottom: 'btm2' },
    { single: 'sing1' },
  ]; //placeholder outfit data
  try {
    //call APIs
    let coords = await getCoords(60605); // placeholder zip code
    weather = await getWeather(coords);
    calStatus = await callCalendarApi();
    queryRes = await testQuery('SELECT * FROM account');
  } catch (err) {
    // next(err);
    console.log(err);
  } finally {
    return {
      weather: weather,
      cal_status: calStatus.msg,
      query_res: `Query returned ${queryRes.rowCount} row(s)`,
      outfits: outfits,
    };
  }
}

function showDashboard(req, res, next) {
  getApiResults().then((result) => {
    //add any other vars to result object here
    //eg result.name = value;
    result.title = 'Fit of the Day';
    result.pagename = 'dashboard';
    res.render('index', result);
  });
}

module.exports = {
  showDashboard: showDashboard,
  callCalendarApi: callCalendarApi,
  testQuery: testQuery,
  getApiResults: getApiResults,
};
