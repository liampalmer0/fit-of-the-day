const https = require('https');

const getCoords = (zipCode) =>
  new Promise((resolve, reject) => {
    const options = {
      host: 'api.openweathermap.org',
      port: 443,
      path: `/data/2.5/weather?zip=${zipCode},us&exclude=minutely,alerts&units=imperial&appid=${process.env.OWM_KEY}`,
      method: 'GET'
    };
    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`API ${res.statusCode} Error`));
      } else {
        let buffer = '';
        // data is streamed in chunks from the server on "data" event
        res.on('data', (data) => {
          buffer += data;
        });
        res.on('end', () => {
          // finished getting data
          const data = JSON.parse(buffer);
          // set the current days weather
          resolve({
            lat: data.coord.lat,
            lon: data.coord.lon,
            city: data.name
          });
        });
      }
    });
    req.on('error', (err) => {
      reject(err);
    });
    req.end();
  });

const getWeather = (coords) =>
  new Promise((resolve, reject) => {
    const options = {
      host: 'api.openweathermap.org',
      port: 443,
      path: `/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&exclude=minutely,alerts&units=imperial&appid=${process.env.OWM_KEY}`,
      method: 'GET'
    };
    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`API ${res.statusCode} Error`));
      } else {
        let buffer = '';
        // data is streamed in chunks from the server on "data" event
        res.on('data', (data) => {
          buffer += data;
        });
        res.on('end', () => {
          // finished getting data
          const data = JSON.parse(buffer);
          // set the current days weather

          const tempday = data.daily[0].feels_like.day;
          const tempEve = data.daily[0].feels_like.eve;
          const tempAverage = (tempday + tempEve) / 2;
          const rainPercent = data.daily[0].pop * 100;
          const rainChanceTemp = `${rainPercent}%`;

          resolve({
            city: coords.city,
            high: data.daily[0].temp.max,
            low: data.daily[0].temp.min,
            feelsLike: data.current.feels_like,
            current: data.current.temp,
            weatherPattern: data.daily[3].weather[0].main,
            tempAverage,
            rainChance: rainChanceTemp,
            icon: data.daily[3].weather[0].icon
          });
        });
      }
    });
    req.on('error', (err) => {
      reject(err);
    });
    req.end();
  });

module.exports = { getWeather, getCoords };
