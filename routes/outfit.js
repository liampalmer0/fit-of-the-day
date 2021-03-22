const express = require('express');
const router = express.Router();
const { models } = require('../sequelize');

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

/**
 * add row with the given article(s) to outfit table
 * if single item outfit, associate it with itself
 */
router.post('/new', async (req, res) => {
  try {
    let article = -1;
    let partner = -1;
    if (req.body.single) {
      article = req.body.single;
      partner = req.body.single;
    } else if (req.body.top && req.body.bottom) {
      article = req.body.top;
      partner = req.body.bottom;
    }
    await models.outfit.create({
      articleArticleId: article,
      partnerArticleId: partner,
      name: 'createdOutfit',
      favorite: true
    });
    req.session.opStatus = {
      success: { msg: 'Outfit saved successfully' },
      error: false
    };
    res.redirect('/' + req.session.username + '/closet?outfits=true');
  } catch (err) {
    if (
      err.errors &&
      err.errors.length === 2 &&
      err.errors[0].type === 'unique violation' &&
      err.errors[1].type === 'unique violation'
    ) {
      req.session.opStatus = {
        success: { msg: 'Outfit saved successfully' },
        error: false
      };
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.log(err);
      }
      req.session.opStatus = {
        error: { msg: 'Outfit creation failed' },
        success: false
      };
    }
    res.redirect('/' + req.session.username + '/closet?outfits=true');
  }
});

module.exports = router;
