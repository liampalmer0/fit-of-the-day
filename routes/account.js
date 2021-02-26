const express = require('express');
const router = express.Router();
const { models } = require('../sequelize');
const { getCurrentWeather } = require('../api/openWeatherMap');

/* GET settings page. */
router.get('/', (req, res, next) => {
  res.render('account', { pagename: 'account' });
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
    res.send('The new zip code was saved.');
  } catch (err) {
    res.send(
      'There was an error saving the new zip code. Please try again later.'
    );
  }
});

module.exports = router;
