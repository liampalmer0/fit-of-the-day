const { models } = require('../sequelize');

async function getArticle(article_id, username) {
  return await models.article.findAll({
    include: [
      { all: true },
      {
        model: models.closet,
        include: {
          model: models.user,
          attributes: ['username'],
          where: { username: username },
          required: true,
        },
        required: true,
      },
    ],
    where: { article_id: article_id },
  });
}
async function getClosetId(username) {
  let closet = await models.closet.findOne({
    attributes: ['closet_id'],
    include: {
      model: models.user,
      attributes: ['username'],
      where: { username: username },
      required: true,
    },
  });
  return closet.dataValues.closet_id;
}
function showArticle(req, res, next) {
  res.locals.toParent = '../';
  let success = req.query.success ? req.query.success : '';
  getArticle(req.query.id, req.session.username)
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
        temp_min: rows[0].temp_min,
        temp_max: rows[0].temp_max,
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
  data.pagename = 'createArticle';
  data.action = 'new';
  data.submitVal = 'Create';
  res.locals.toParent = '../../';
  res.render('create-article', data);
}
function showEdit(req, res, next) {
  getArticle(req.query.id, req.session.username)
    .then((rows) => {
      let data = {};
      data.title = `FOTD - Edit ${rows[0].name}`;
      data.pagename = 'editArticle';
      data.article = {
        article_id: rows[0].article_id,
        name: rows[0].name,
        desc: rows[0].desc,
        color: rows[0].color,
        dirty: rows[0].dirty,
        garment_type: rows[0].garment_type.dataValues.name,
        dress_code: rows[0].dress_code.dataValues.name,
        temp_min: rows[0].temp_min,
        temp_max: rows[0].temp_max,
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
  let dirty = req.body.dirty ? 't' : 'f';

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
    let closetId = await getClosetId(req.session.username);
    let dbres = await models.article.create({
      closet_id: closetId,
      name: req.body.name,
      desc: req.body.desc,
      dirty: dirty,
      garment_type_id: type,
      color: req.body.color,
      dress_code_id: dress_code,
      rating_id: '5',
      temp_min: req.body.tempmin,
      temp_max: req.body.tempmax,
      filepath: filepath,
    });

    res.redirect(
      '../article?id=' + dbres.dataValues.article_id + '&success=true'
    );
  } catch (err) {
    console.log(err);
  }
}
async function editArticle(req, res, next) {
  let type = 0;
  let dress_code = 0;
  let filepath = '';
  let dirty = req.body.dirty ? 't' : 'f';

  if (!req.body.filepath) {
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
  } else {
    filepath = req.body.filepath;
  }

  if (req.body.dress_code === 'casual') dress_code = 1;
  else if (req.body.dress_code === 'semi-formal') dress_code = 2;
  else dress_code = 3;

  try {
    await models.article.update(
      {
        name: req.body.name,
        desc: req.body.desc,
        dirty: dirty,
        garment_type_id: type,
        color: req.body.color,
        dress_code_id: dress_code,
        // rating_id: '5',
        temp_min: req.body.tempmin,
        temp_max: req.body.tempmax,
        filepath: filepath,
      },
      {
        include: {
          model: models.closet,
          attributes: ['closet_id'],
          include: {
            model: models.user,
            attributes: ['username'],
            where: { username: req.session.username },
            required: true,
          },
        },
        where: {
          article_id: req.query.id,
        },
      }
    );
    res.redirect('../article?id=' + req.query.id + '&success=true');
  } catch (err) {
    console.log(`${err.message}\n${err.name}\n${err.stack}`);
  }
}
function deleteArticle(req, res, next) {
  models.article
    .destroy({
      include: [
        {
          model: models.closet,
          attributes: ['closet_id'],
          include: [
            {
              model: models.user,
              attributes: ['username'],
              where: { username: req.session.username },
              required: true,
            },
          ],
        },
      ],
      where: {
        article_id: req.query.id,
      },
    })
    .then((output) => {
      req.session.success = true;
      res.redirect(`/${req.session.username}/closet`);
    })
    .catch((err) => {
      console.log(`${err.message}\n${err.name}\n${err.stack}`);
      req.session.success = false;
      res.redirect(`/${req.session.username}/closet`);
    });
}
module.exports = {
  getArticle: getArticle,
  getClosetId: getClosetId,
  showArticle: showArticle,
  showCreate: showCreate,
  createArticle: createArticle,
  showEdit: showEdit,
  editArticle: editArticle,
  deleteArticle: deleteArticle,
};
