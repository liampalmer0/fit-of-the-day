const express = require('express');
const router = express.Router();
const { models } = require('../sequelize');
const TYPE_IDS = { top: 1, btm: 2, oneP: 3 };
const Outfit = require('../common/Outfit');

/* GET outfit page. */
router.get('/', async (req, res) => {
  let result = [];
  const closet = await models.closet.findOne({
    include: {
      model: models.user,
      required: true,
      where: { username: req.session.username }
    }
  });
  let bases = await closet.getArticles({
    include: {
      model: models.article,
      as: 'partner',
      required: true,
      where: { garmentTypeId: [TYPE_IDS.btm, TYPE_IDS.oneP] }
    },
    where: { garmentTypeId: [TYPE_IDS.top, TYPE_IDS.oneP] }
  });

  // Iterate through base outfits and the favorites/saved outfits favorites
  bases.forEach((base) => {
    if (base.dataValues.partner[0].outfit.dataValues.favorite) {
      result.push(new Outfit(base, base.dataValues.partner[0], true));
    }
  });
  res.render('outfit', {
    title: 'FOTD - Favorite Outfits',
    pagename: 'outfits',
    outfits: result
  });
});

/* GET new outfit form page. */
router.get('/new', (req, res) => {
  //get tops bottoms + singles and display as radio buttons
  let articles = {};
  let closet = {};
  models.closet
    .findOne({
      include: {
        model: models.user,
        required: true,
        where: { username: req.session.username }
      }
    })
    .then(function (c) {
      closet = c;
      return closet.getArticles({ where: { garmentTypeId: 1 } });
    })
    .then(function (tops) {
      articles.tops = tops;
      return closet.getArticles({ where: { garmentTypeId: 2 } });
    })
    .then(function (bottoms) {
      articles.bottoms = bottoms;
      return closet.getArticles({ where: { garmentTypeId: 3 } });
    })
    .then(function (singles) {
      articles.singles = singles;
      res.render('create-outfit', {
        pagename: 'outfit',
        title: 'FOTD - Create Outfit',
        tops: articles.tops,
        bottoms: articles.bottoms,
        singles: articles.singles
      });
    })
    .catch((err) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(err);
      }
    });
});
router.post('/new', (req, res) => {
  // add row with the given article(s) to outfit table
  // if single item outfit, associate it with itself
  let article = -1;
  let partner = -1;
  if (req.body.single) {
    article = req.body.single;
    partner = req.body.single;
  } else if (req.body.top && req.body.bottom) {
    article = req.body.top;
    partner = req.body.bottom;
  }
  models.outfit
    .create({
      articleArticleId: article,
      partnerArticleId: partner,
      name: 'createdOutfit',
      favorite: true
    })
    .then(function (result) {
      res.send(JSON.stringify(result));
    })
    .catch((err) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(err);
      }
      res.send('Outfit combo already exists');
    });
});

module.exports = router;
