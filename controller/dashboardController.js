const owm = require('../api/openWeatherMap');
const gcal = require('../api/googleCal');
const { recRand, recRandFiltered } = require('../api/recommender');

async function getApiResults() {
  let weather = 'Unavailable';
  let calStatus = 'Calendar Unavailable';
  let outfits = [];
  try {
    //call APIs
    let coords = await owm.getCoords(45202); // placeholder zip code
    weather = await owm.getWeather(coords);
    calStatus = await gcal.getEvents();
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
async function getRandRecs(username, filtered, body) {
  try {
    if (!filtered) {
      return await recRand(username);
    } else {
      return await recRandFiltered(username, [body.color]);
    }
  } catch (err) {
    console.log(err);
  }
}
function showDashboard(req, res, next) {
  getApiResults()
    .then(async (data) => {
      // console.log(data)
      let outfits = await getRandRecs(req.session.username, false);
      if (outfits != 0) {
        data.outfits = outfits;
      }
      return data;
    })
    .then((data) => {
      //add any other vars to result object here
      //eg result.name = value;
      data.title = 'Fit of the Day - Dashboard';
      data.pagename = 'dashboard';
      res.render('dashboard', data);
    });
}

function regenFiltered(req, res, next) {
  getApiResults()
    .then(async (data) => {
      data.outfits = await getRandRecs(req.session.user, true, req.body);
      return data;
    })
    .then((data) => {
      // console.log(data.outfits[2].top);
      // console.log(data.outfits[2].bottom);
      data.title = 'Fit of the Day - Dashboard';
      data.pagename = 'dashboard';
      res.render('dashboard', data);
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = {
  showDashboard: showDashboard,
  regenFiltered: regenFiltered,
  getApiResults: getApiResults,
};
