var assert = require('assert');
var dashboard = require('../../routes/index');

//for later developemnts, should define some kind of mocks for the apis
// so that a real call is not necessary

describe('DashboardAPIs', function () {
  describe('#callNWS', function () {
    it('should return object containing current weather data', async function () {
      let result = await dashboard.callWeatherApi(true);
      assert.strictEqual(result.temperature, 68);
    });
  });

  describe('#callCalendar', function () {
    //pending test bc no implementation
    it('should return something that is TBD');
  });

  describe('#testQuery', function () {
    it('should return at least 1 row', async function () {
      let result = await dashboard.testQuery('SELECT * FROM users');
      assert(result.rowCount >= 1, 'Row count is less than 1');
    });
  });
});
