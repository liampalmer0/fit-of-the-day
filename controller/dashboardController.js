const owm = require('../api/openWeatherMap');
const gcal = require('../api/googleCal');
const { recRand, recRandFiltered } = require('../api/recommender');

async function getApiResults() {
  let weather = 'Weather Unavailable';
  let calStatus = { msg: 'Calendar Unavailable' };
  const outfits = [];
  try {
    // call APIs
    const coords = await owm.getCoords(45202); // placeholder zip code
    weather = await owm.getWeather(coords);
    calStatus = await gcal.getEvents();
    return {
      weather,
      calStatus: calStatus.msg,
      outfits
    };
  } catch (err) {
    // next(err);
    if (process.env.NODE_ENV === 'development') {
      console.log(err);
    }
    return {
      weather,
      calStatus: calStatus.msg,
      outfits
    };
  }
}
async function getRandRecs(username, filtered, body) {
  try {
    if (!filtered) {
      return await recRand(username);
    }
    return await recRandFiltered(username, [body.color]);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.log(err);
    }
  }
}
function showDashboard(req, res, next) {
  getApiResults()
    .then(async (data) => {
      // console.log(data)
      const outfits = await getRandRecs(req.session.username, false);
      if (outfits !== 0) {
        data.outfits = outfits;
      }
      return data;
    })
    .then((data) => {
      // add any other vars to result object here
      // eg result.name = value;
      data.title = 'Fit of the Day - Dashboard';
      data.pagename = 'dashboard';
      res.render('dashboard', data);
    });
}

function regenFiltered(req, res, next) {
  getApiResults()
    .then(async (data) => {
      data.outfits = await getRandRecs(req.session.username, true, req.body);
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
      if (process.env.NODE_ENV === 'development') {
        console.log(err);
      }
    });
}

module.exports = {
  showDashboard,
  regenFiltered,
  getApiResults
};
