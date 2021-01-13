const assert = require('assert');
const gCal = require('../../api/googleCal');
// const owm = require('../../api/openWeatherMap')

// for later developments, should define some kind of mocks for the apis
// so that a real call is not necessary

describe('DashboardAPIs', () => {
  describe('#callWeatherAPIs', () => {
    it('should return object containing current weather data');
    // , async function () {
    // let coords = await owm.getCoords(60605);
    // let weather = await owm.getWeather(coords);
    // needs mockups for the apis
    // });
  });

  describe('#callCalendar', () => {
    // placeholder data bc no implementation
    it('should return something that is TBD', async () => {
      const result = await gCal.getEvents();
      assert.strictEqual(result.msg, 'No Events Today');
      assert.strictEqual(result.count, 0);
    });
  });
});
