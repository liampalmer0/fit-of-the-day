const owm = require('../api/openWeatherMap');
const { recRand, recRandFiltered, recommend } = require('../api/recommender');
const { models } = require('../sequelize');

async function getApiResults(req) {
  let weather = 'Weather Unavailable';
  let calStatus = { msg: 'Calendar Unavailable' };
  try {
    // call APIs
    if (
      req.session.coords &&
      req.session.coords.lat &&
      req.session.coords.lon
    ) {
      weather = await owm.getCurrentWeather(req.session.coords, true);
    } else {
      let savedZip = await getZipCode(req.session.username);
      let zip = savedZip ? savedZip : 10001; //set default if db entry is null
      weather = await owm.getCurrentWeather(zip);
      req.session.coords = { lat: weather.coords.lat, lon: weather.coords.lon };
    }
    return {
      weather,
      calStatus: 'No Events Today'
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
  try {
    let data = await models.user.findOne({
      where: { username }
    });
    return data ? data.dataValues.zipcode : null;
  } catch {
    return null;
  }
}

async function showDashboard(req, res, next) {
  try {
    let data = await getApiResults(req);
    req.session.temp = data.weather.current;
    data.title = 'Fit of the Day - Dashboard';
    data.pagename = 'dashboard';
    res.render('dashboard', data);
  } catch (err) {
    next(err);
  }
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
  setFavorite,
  getZipCode
};
