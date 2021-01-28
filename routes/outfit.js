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
      console.log(articles);
      res.render('create-outfit', {
        pagename: 'outfit',
        tops: articles.tops,
        bottoms: articles.bottoms,
        singles: articles.singles
      });
    })
    .catch((err) => {
      console.log(err);
    });
});
router.post('/new', (req, res) => {
  // add row with the given article(s) to outfit table
  // if single item outfit, associate it with itself
  res.send(`you just posted \n ${req.body}`);
});

module.exports = router;
