const https = require('https');

const getCoords = (zipCode) => {
  return new Promise((resolve, reject) => {
    const options = {
      host: 'api.openweathermap.org',
      port: 443,
      path: `/data/2.5/weather?zip=${zipCode},us&exclude=minutely,alerts&units=imperial&appid=${process.env.OWM_KEY}`,
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
          resolve({
            lat: data.coord.lat,
            lon: data.coord.lon,
            city: data.name,
          });
        });
      }
    });
    req.on('error', (err) => {
      reject(err);
    });
    req.end();
  });
};

const getWeather = (coords) => {
  return new Promise((resolve, reject) => {
    const options = {
      host: 'api.openweathermap.org',
      port: 443,
      path: `/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&exclude=minutely,alerts&units=imperial&appid=${process.env.OWM_KEY}`,
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

          let tempday = data.daily[0].feels_like.day;
          let tempEve = data.daily[0].feels_like.eve;
          let tempAverage = (tempday + tempEve) / 2;
          let rainPercent = data.daily[0].pop * 100;
          let rainChanceTemp = `${rainPercent}%`;

          resolve({
            city: coords.city,
            high: data.daily[0].temp.max,
            low: data.daily[0].temp.min,
            feelsLike: data.current.feels_like,
            current: data.current.temp,
            weatherPattern: data.daily[3].weather[0].main,
            tempAverage: tempAverage,
            rainChance: rainChanceTemp,
            icon: data.daily[3].weather[0].icon,
          });
        });
      }
    });
    req.on('error', (err) => {
      reject(err);
    });
    req.end();
  });
};

module.exports = { getWeather: getWeather, getCoords: getCoords };
