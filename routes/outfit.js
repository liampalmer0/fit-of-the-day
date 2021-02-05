const express = require('express');
const router = express.Router();
const { models } = require('../sequelize');

/* GET outfit page. */
router.get('/', (req, res) => {
  // models.article.findAll({ include: { model: models.article ... } });
  // Article is associated to article through outfit table
  res.send('this will be the outfits page');
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
