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
  let success = req.query.success ? req.query.success : '';
  getArticle(req.query.id)
    .then((rows) => {
      let data = {};
      data.success = success;
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

function showCreate(req, res, next) {
  let data = {};
  data.action = 'new';
  data.submitVal = 'Create';
  res.locals.toParent = '../../';
  res.render('create-article', data);
}

function showEdit(req, res, next) {
  getArticle(req.query.id)
    .then((rows) => {
      let data = {};
      data.title = `FOTD - Edit ${rows[0].name}`;
      data.pagename = 'edit-article';
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
      data.action = '';
      data.submitVal = 'Save';
      res.locals.toParent = '../../';
      res.render('edit-article', data);
    })
    .catch((err) => {
      console.log(err);
      res.render('error', {
        message: 'Closet Unavailable',
        error: { status: err, stack: err.stack },
      });
    });
}

async function createArticle(req, res, next) {
  //create article from req.body
  let type = 0;
  let dress_code = 0;
  let filepath = '';

  if (req.body.type === 'top') {
    type = 1;
    filepath = 's-null.png';
  } else if (req.body.type === 'bottom') {
    type = 2;
    filepath = 'p-null.png';
  } else {
    type = 3;
    filepath = 'p-null.png';
  }

  if (req.body.dress_code === 'casual') dress_code = 1;
  else if (req.body.dress_code === 'semi-formal') dress_code = 2;
  else dress_code = 3;

  let dbres = await models.article.create({
    closet_id: '4',
    name: req.body.name,
    desc: req.body.desc,
    dirty: 'f',
    garment_type_id: type,
    color: req.body.color,
    dress_code_id: dress_code,
    rating_id: '5',
    temp_min: '0',
    temp_max: '100',
    filepath: filepath,
  });

  res.redirect(
    '../article?id=' + dbres.dataValues.article_id + '&success=true'
  );
}

async function editArticle(req, res) {
  //create article from req.body

  if (req.body.type === 'top') {
    type = 1;
    filepath = 's-null.png';
  } else if (req.body.type === 'bottom') {
    type = 2;
    filepath = 'p-null.png';
  } else {
    type = 3;
    filepath = 'p-null.png';
  }

  if (req.body.dress_code === 'casual') dress_code = 1;
  else if (req.body.dress_code === 'semi-formal') dress_code = 2;
  else dress_code = 3;

  try {
    await models.article.update(
      {
        name: req.body.name,
        desc: req.body.desc,
        garment_type_id: type,
        color: req.body.color,
        dress_code_id: dress_code,
      },
      {
        where: {
          article_id: req.query.id,
        },
      }
    );
    res.redirect('../article?id=' + req.query.id + '&success=true');
  } catch (err) {
    console.log(err);
  }
}

/* GET article page. */
router.get('/', showArticle);

router.get('/new', showCreate);

router.post('/new', createArticle);

router.get('/edit', showEdit);

router.post('/edit', editArticle);

module.exports = router;
