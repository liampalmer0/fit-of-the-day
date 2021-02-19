const owm = require('../api/openWeatherMap');
const gcal = require('../api/googleCal');
const { recRand, recRandFiltered, recommend } = require('../api/recommender');
const { models } = require('../sequelize');

async function getApiResults(req) {
  let weather = 'Weather Unavailable';
  let calStatus = { msg: 'Calendar Unavailable' };
  try {
    // call APIs
    let coords = {};
    if (req.session.coords) {
      coords = await owm.getCoords(req.session.coords, true);
      weather = await owm.getWeather(req.session.coords);
      weather.city = coords.city;
    } else {
      let savedZip = await getZipCode(req.session.username);
      let zip = savedZip ? savedZip : 10001; //set default if db entry is null
      coords = await owm.getCoords(zip);
      req.session.coords = { lat: coords.lat, lon: coords.lon };
      weather = await owm.getWeather(coords);
    }
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

async function getZipCode(username) {
  let data = await models.user.findOne({
    where: { username }
  });
  return data.dataValues.zipcode;
}

function showDashboard(req, res, next) {
  getApiResults(req)
    .then(async (data) => {
      req.session.temp = data.weather.current;
      return data;
    })
    .then(function (data) {
      data.title = 'Fit of the Day - Dashboard';
      data.pagename = 'dashboard';
      res.render('dashboard', data);
    })
    .catch(next);
}

function regenFiltered(req, res, next) {
  getApiResults(req)
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

async function setFavorite(req, res, next) {
  try {
    const base = req.body.base;
    const partner = req.body.partner;
    const checked = req.body.checked;
    const outfit = await models.outfit.findOne({
      where: { articleArticleId: base, partnerArticleId: partner }
    });
    if (!outfit) {
      await models.outfit.create({
        articleArticleId: base,
        partnerArticleId: partner,
        favorite: checked
      });
    } else {
      models.outfit.update(
        { favorite: checked },
        { where: { articleArticleId: base, partnerArticleId: partner } }
      );
    }
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  showDashboard,
  regenFiltered,
  getApiResults,
  regenRecommendations,
  setFavorite
};
