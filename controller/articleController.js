const { models } = require('../sequelize');

function categoricalToId(type, dresscode) {
  if (type === 'top') {
    type = 1;
  } else if (type === 'bottom') {
    type = 2;
  } else {
    type = 3;
  }

  if (dresscode === 'casual') dresscode = 1;
  else if (dresscode === 'semi-formal') dresscode = 2;
  else dresscode = 3;

  return [type, dresscode];
}
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
async function createArticle(req, res, next) {
  //create article from req.body
  let catIds = categoricalToId(req.body.type, req.body.dress_code);
  let filepath = '';
  let dirty = req.body.dirty ? 't' : 'f';

  if (!req.body.filepath) {
    if (catIds[0] === 1) filepath = 's-null.png';
    else filepath = 'p-null.png';
  } else {
    filepath = req.body.filepath;
  }

  try {
    let closetId = await getClosetId(req.session.username);
    let dbRes = await models.article.create({
      closet_id: closetId,
      name: req.body.name,
      desc: req.body.desc,
      dirty: dirty,
      garment_type_id: catIds[0],
      color: req.body.color,
      dress_code_id: catIds[1],
      rating_id: '5',
      temp_min: req.body.tempmin,
      temp_max: req.body.tempmax,
      filepath: filepath,
    });
    req.session.success = { create: true };
    req.session.error = false;
    res.redirect(`../article?id=${dbRes.dataValues.article_id}`);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.log(err);
    }
    req.session.success = false;
    req.session.error = { create: true };
    res.redirect(`/${req.session.username}/closet`);
  }
}
async function editArticle(req, res, next) {
  let catIds = categoricalToId(req.body.type, req.body.dress_code);
  let filepath = '';
  let dirty = req.body.dirty ? 't' : 'f';

  if (!req.body.filepath) {
    if (catIds[0] === 1) filepath = 's-null.png';
    else filepath = 'p-null.png';
  } else {
    filepath = req.body.filepath;
  }

  try {
    await models.article.update(
      {
        name: req.body.name,
        desc: req.body.desc,
        dirty: dirty,
        garment_type_id: catIds[0],
        color: req.body.color,
        dress_code_id: catIds[1],
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
    req.session.success = { edit: true };
    req.session.error = false;
    res.redirect(`../article?id=${req.query.id}`);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`${err.message}\n${err.name}\n${err.stack}`);
    }
    req.session.success = false;
    req.session.error = { edit: true };
    res.redirect(`../article?id=${req.query.id}`);
  }
}
async function deleteArticle(req, res, next) {
  try {
    await models.article.destroy({
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
    });
    req.session.success = { delete: true };
    req.session.error = false;
    res.redirect(`/${req.session.username}/closet`);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`${err.message}\n${err.name}\n${err.stack}`);
    }
    req.session.success = false;
    req.session.error = { delete: true };
    res.redirect(`../article?id=${req.query.id}`);
  }
}
function showArticle(req, res, next) {
  res.locals.toParent = '../';
  let success = req.session.success;
  let error = req.session.error;
  getArticle(req.query.id, req.session.username)
    .then((rows) => {
      let data = {
        title: `FOTD - ${rows[0].name}`,
        pagename: 'article',
        success: success,
        error: error,
        article: {
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
        },
      };
      res.render('article', data);
    })
    .catch((err) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(err);
      }
      let data = {
        title: `FOTD - Error`,
        pagename: 'article',
        success: success,
        error: error,
      };
      res.render('article', data);
    });
}
function showCreate(req, res, next) {
  let data = {
    pagename: 'createArticle',
    action: 'new',
    submitVal: 'Create',
  };
  res.locals.toParent = '../../';
  res.render('create-article', data);
}
function showEdit(req, res, next) {
  getArticle(req.query.id, req.session.username)
    .then((rows) => {
      let data = {
        title: `FOTD - Edit ${rows[0].name}`,
        pagename: 'editArticle',
        article: {
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
        },
      };
      data.action = '';
      data.submitVal = 'Save';
      res.locals.toParent = '../../';
      res.render('edit-article', data);
    })
    .catch((err) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(err);
      }
      res.render('edit-article', {
        title: `FOTD - Edit - Error`,
        pagename: 'editArticle',
        error: true,
      });
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
