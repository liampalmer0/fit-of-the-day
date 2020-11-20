const owm = require('../api/openWeatherMap');
const gcal = require('../api/googleCal');
const { recRand } = require('../api/recommender');

async function getApiResults() {
  let weather = 'Unavailable';
  let calStatus = 'Calendar Unavailable';
  let outfits = [];
  try {
    //call APIs
    let coords = await owm.getCoords(45202); // placeholder zip code
    weather = await owm.getWeather(coords);
    calStatus = await gcal.getEvents();
    outfits = await recRand('liam');
    //Hard coded username, will be pulled from session later
  } catch (err) {
    // next(err);
    console.log(err);
  } finally {
    return {
      weather: weather,
      cal_status: calStatus.msg,
      outfits: outfits,
    };
  }
}

function showDashboard(req, res, next) {
  getApiResults().then((data) => {
    //add any other vars to result object here
    //eg result.name = value;
    data.title = 'Fit of the Day - Dashboard';
    data.pagename = 'dashboard';
    res.render('dashboard', data);
  });
}

module.exports = {
  showDashboard: showDashboard,
  getApiResults: getApiResults,
};
