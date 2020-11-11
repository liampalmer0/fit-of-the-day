const express = require('express');
const router = express.Router();
const { models } = require('../sequelize');

async function getArticle(article_id) {
  //hard coded to look in the test closet
  return await models.article.findAll({
    include: { all: true },
    where: { closet_id: 4, article_id: article_id },
  });
}

function showArticle(req, res, next) {
  res.locals.toParent = '../';
  getArticle(req.query.id)
    .then((rows) => {
      let data = {};
      data.title = `FOTD - ${rows[0].name}`;
      data.pagename = 'article';
      data.article = {
        article_id: rows[0].article_id,
        name: rows[0].name,
        desc: rows[0].desc,
        color: rows[0].color,
        dirty: rows[0].dirty,
        garment_type: rows[0].garment_type.dataValues.name,
        dress_code: rows[0].dress_code.dataValues.name,
        filepath: rows[0].filepath,
      };
      res.render('article', data);
    })
    .catch((err) => {
      console.log(err);
      res.render('error', {
        message: 'Closet Unavailable',
        error: { status: err, stack: err.stack },
      });
    });
}

/* GET article page. */
router.get('/', showArticle);

module.exports = router;
