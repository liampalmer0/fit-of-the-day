const owm = require('../api/openWeatherMap');
const { recRand, recRandFiltered, recommend } = require('../api/recommender');
const { models } = require('../sequelize');
const DEFAULT_ZIP = 10001;

async function getWeather(username, coords) {
  let weather = { msg: 'Weather Unavailable', coords: null };
  try {
    if (coords && coords.lat && coords.lon) {
      weather = await owm.getCurrentWeather(coords, true);
    } else {
      let zip = await getZipCode(username);
      weather = await owm.getCurrentWeather(zip);
    }
    return { weather: weather };
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.log(err);
    }
    return { weather: weather };
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
    return data ? data.dataValues.zipcode : DEFAULT_ZIP;
  } catch {
    return DEFAULT_ZIP;
  }
}

async function showDashboard(req, res, next) {
  try {
    let data = await getWeather(req.session.username, req.session.coords);
    req.session.coords = data.weather.coords;
    req.session.temp = data.weather.current;
    data.title = 'Fit of the Day - Dashboard';
    data.pagename = 'dashboard';
    res.render('dashboard', data);
  } catch (err) {
    next(err);
  }
}

function regenFiltered(req, res, next) {
  getWeather(req)
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
  getWeather,
  regenRecommendations,
  setFavorite,
  getZipCode
};
