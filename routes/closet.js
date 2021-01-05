const express = require('express');
const router = express.Router();
const articleRouter = require('./article');
const { getArticles, getClosetId } = require('../controller/closetController');

function showCloset(req, res, next) {
  getClosetId(req.session.username)
    .then((closetId) => {
      return getArticles(req.session.username, closetId);
    })
    .then((query) => {
      let data = {};
      data.success = req.session.success ? req.session.success : false;
      req.session.success = false;
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
