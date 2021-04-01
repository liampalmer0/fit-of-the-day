const express = require('express');
const router = express.Router();
const { models } = require('../sequelize');
const { getCurrentWeather } = require('../api/openWeatherMap');

/* GET settings page. */
router.get('/', (req, res, next) => {
  res.render('account', { pagename: 'account', title: 'FOTD - Account' });
});

router.post('/zip', async (req, res, next) => {
  try {
    await models.user.update(
      {
        zipcode: req.body.zip
      },
      {
        where: {
          username: req.session.username
        }
      }
    );
    let coords = await getCurrentWeather(req.body.zip);
    req.session.coords = { lat: coords.lat, lon: coords.lon };
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
  }
});

module.exports = router;
