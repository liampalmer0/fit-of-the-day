const express = require('express');
const router = express.Router();
const db = require('../db');

function getArticles(usertoken, closetid) {
  return new Promise((resolve, reject) => {
    try {
      //need to eventually verify legitimacy of this request
      let res = db.query(
        'SELECT "name", dirty, rating_id FROM article WHERE closet_id=1;'
      );
      return resolve(res);
    } catch (err) {
      // console.log(err);
      return reject(err);
    }
  });
}

function showCloset(req, res, next) {
  getArticles().then((result) => {
    console.log(result.rows);
    result.pagename = 'closet';
    res.render('closet', { articles: result.rows });
  });
}

/* GET closet page. */
router.get('/', showCloset);

module.exports = router;
