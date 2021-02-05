const owm = require('../api/openWeatherMap');
const gcal = require('../api/googleCal');
const { recRand, recRandFiltered, recommend } = require('../api/recommender');

async function getApiResults() {
  let weather = 'Weather Unavailable';
  let calStatus = { msg: 'Calendar Unavailable' };
  try {
    // call APIs
    const coords = await owm.getCoords(45202); // placeholder zip code
    weather = await owm.getWeather(coords);
    calStatus = await gcal.getEvents();
    return {
      weather,
      calStatus: calStatus.msg
    };
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.log(err);
    }
    return {
      weather,
      calStatus: calStatus.msg
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
      req.session.temp = data.weather.current;
      return data;
    })
    .then(function (data) {
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

async function regenRecommendations(req, res, next) {
  const outfits = await recommend(req.session.username, {
    tempAverage: req.session.temp
  });
  res.render('includes/recommendations', { outfits });
}

module.exports = {
  showDashboard,
  regenFiltered,
  getApiResults,
  regenRecommendations
};
