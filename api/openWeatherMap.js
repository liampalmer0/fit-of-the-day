const https = require('https');

module.exports = {
  getCurrentWeather: (identifier, isCoords = false) =>
    new Promise((resolve, reject) => {
      if (identifier === undefined) {
        reject(new Error('Invalid Locator'));
      }
      let locationPath = '';
      if (isCoords) {
        locationPath = `lat=${identifier.lat}&lon=${identifier.lon}`;
      } else {
        locationPath = `zip=${identifier},us`;
      }
      const options = {
        host: 'api.openweathermap.org',
        port: 443,
        path: `/data/2.5/weather?${locationPath}&exclude=minutely,alerts&units=imperial&appid=${process.env.OWM_KEY}`,
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
            const tempAverage = (data.main.temp_max + data.main.temp_min) / 2;
            // set the current days weather
            resolve({
              coords: { lat: data.coord.lat, lon: data.coord.lon },
              city: data.name,
              high: data.main.temp_max,
              low: data.main.temp_min,
              feelsLike: data.main.feels_like,
              current: Math.floor(data.main.temp),
              weatherPattern: data.weather[0].main,
              weatherPatternDesc: data.weather[0].description,
              tempAverage: tempAverage,
              icon: data.weather[0].icon
            });
          });
        }
      });
      req.on('error', (err) => {
        reject(err);
      });
      req.end();
    })
};
