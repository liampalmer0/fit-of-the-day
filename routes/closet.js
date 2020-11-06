const express = require('express');
const router = express.Router();
const db = require('../db');

function getArticles(usertoken, closetid) {
  return new Promise((resolve, reject) => {
    try {
      //need to eventually verify legitimacy of this request
      let res = db.query(
        // 'SELECT "name", dirty, rating_id FROM article WHERE closet_id=1;'
        'SELECT a.article_id as "id", u.username AS "owner", c.name AS "closet", a.name AS "name", a.desc AS "desc", a.filepath as "path" FROM article AS a JOIN closet AS c ON c.closet_id = a.closet_id JOIN "user" AS u ON c.user_id = u.user_id WHERE u.username = \'lamp\' ORDER BY c.closet_id'
      );
      return resolve(res);
    } catch (err) {
      // console.log(err);
      return reject(err);
    }
  });
}

function showCloset(req, res, next) {
  getArticles()
    .then((data) => {
      console.log(data.rows);
      data.title = 'FOTD - Closet';
      data.pagename = 'closet';
      data.articles = data.rows;
      data.rows = 0;
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

module.exports = router;
