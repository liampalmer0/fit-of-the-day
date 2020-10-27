var assert = require('assert');
var dashboard = require('../../controller/dashboardController');

//for later developemnts, should define some kind of mocks for the apis
// so that a real call is not necessary

describe('DashboardAPIs', function () {
  describe('#callWeatherAPIs', function () {
    it('should return object containing current weather data');
    // , async function () {
    // let coords = await dashboard.getCoords(60605);
    // let weather = await dashboard.getWeather(coords);
    //needs mockups for the apis
    // });
  });

  describe('#callCalendar', function () {
    //placeholder data bc no implementation
    it('should return something that is TBD', async function () {
      let result = await dashboard.callCalendarApi();
      assert.strictEqual(result.msg, 'No Events Today');
      assert.strictEqual(result.count, 0);
    });
  });

  describe('#testQuery', function () {
    it('should return at least 1 row', async function () {
      let result = await dashboard.testQuery('SELECT * FROM account');
      assert(result.rowCount >= 1, 'Row count is less than 1');
    });
  });
});
