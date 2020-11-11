const express = require('express');
const router = express.Router();
const { models } = require('../sequelize');
const articleRouter = require('./article');

async function getArticles(usertoken, closetid) {
  return await models.article.findAll({
    include: [
      {
        model: models.closet,
        attributes: ['name'],
        where: { closet_id: closetid },
        include: [
          {
            attributes: ['username'],
            model: models.User,
          },
        ],
      },
    ],
  });
}

function showCloset(req, res, next) {
  getArticles(0, 4)
    .then((query) => {
      // console.log(query[0]);
      let data = {};
      data.title = 'FOTD - Closet';
      data.pagename = 'closet';
      data.articles = query;
      res.render('closet', data);
    })
    .catch((err) => {
      res.render('error', {
        message: 'Closet Unavailable',
        error: { status: err, stack: err.stack },
      });
    });
}

/* GET closet page. */
router.get('/', showCloset);

router.use('/article', articleRouter);

module.exports = router;
