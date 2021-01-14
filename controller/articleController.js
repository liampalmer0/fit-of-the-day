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
async function getArticle(articleId, username) {
  return await models.article.findAll({
    include: [
      { all: true },
      {
        model: models.closet,
        include: {
          model: models.user,
          attributes: ['username'],
          where: { username },
          required: true
        },
        required: true
      }
    ],
    // prettier-ignore
    where: { 'article_id': articleId }
  });
}
async function getClosetId(username) {
  const closet = await models.closet.findOne({
    attributes: ['closet_id'],
    include: {
      model: models.user,
      attributes: ['username'],
      where: { username },
      required: true
    }
  });
  return closet.dataValues.closet_id;
}

async function createArticle(req, res, next) {
  // create article from req.body
  const catIds = categoricalToId(req.body.type, req.body.dressCode);
  let filepath = '';
  const dirty = req.body.dirty ? 't' : 'f';

  if (!req.body.filepath) {
    if (catIds[0] === 1) filepath = 's-null.png';
    else filepath = 'p-null.png';
  } else {
    filepath = req.body.filepath;
  }

  try {
    const closetId = await getClosetId(req.session.username);
    // prettier-ignore
    const dbRes = await models.article.create({
      'closet_id': closetId,
      name: req.body.name,
      desc: req.body.desc,
      dirty,
      'garment_type_id': catIds[0],
      color: req.body.color,
      'dress_code_id': catIds[1],
      'rating_id': '5',
      'temp_min': req.body.tempMin,
      'temp_max': req.body.tempMax,
      filepath
    });
    req.session.success = { create: true, edit: false };
    req.session.error = false;
    res.redirect(`../article?id=${dbRes.dataValues.article_id}`);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.log(err);
    }
    req.session.success = false;
    req.session.error = { create: true, edit: false };
  }
  res.redirect(`/${req.session.username}/closet`);
}
async function editArticle(req, res, next) {
  const catIds = categoricalToId(req.body.type, req.body.dressCode);
  let filepath = '';
  const dirty = req.body.dirty ? 't' : 'f';

  if (!req.body.filepath) {
    if (catIds[0] === 1) filepath = 's-null.png';
    else filepath = 'p-null.png';
  } else {
    filepath = req.body.filepath;
  }

  try {
    // prettier-ignore
    await models.article.update(
      {
        name: req.body.name,
        desc: req.body.desc,
        dirty,
        'garment_type_id': catIds[0],
        color: req.body.color,
        'dress_code_id': catIds[1],
        // rating_id: '5',
        'temp_min': req.body.tempMin,
        'temp_max': req.body.tempMax,
        filepath
      },
      {
        include: {
          model: models.closet,
          attributes: ['closet_id'],
          include: {
            model: models.user,
            attributes: ['username'],
            where: { username: req.session.username },
            required: true
          }
        },
        where: {
          'article_id': req.query.id
        }
      }
    );
    req.session.success = { create: false, edit: true };
    req.session.error = false;
    res.redirect(`../article?id=${req.query.id}`);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`${err.message}\n${err.name}\n${err.stack}`);
    }
    req.session.success = false;
    req.session.error = { create: false, edit: true };
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
              required: true
            }
          ],
          required: true
        }
      ],
      // prettier-ignore
      where: {
        'article_id': req.query.id
      }
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
  let success = req.session.success ? req.session.success : false;
  let error = req.session.error ? req.session.error : false;
  getArticle(req.query.id, req.session.username)
    .then((rows) => {
      if (rows.length === 0) {
        success = false;
        error = true;
        throw new Error('User not authorized for the requested article');
      }
      const data = {
        title: `FOTD - ${rows[0].name}`,
        pagename: 'article',
        success,
        error,
        article: {
          articleId: rows[0].article_id,
          name: rows[0].name,
          desc: rows[0].desc,
          color: rows[0].color,
          dirty: rows[0].dirty,
          garmentType: rows[0].garment_type.dataValues.name,
          dressCode: rows[0].dress_code.dataValues.name,
          tempMin: rows[0].temp_min,
          tempMax: rows[0].temp_max,
          filepath: rows[0].filepath
        }
      };
      res.render('article', data);
    })
    .catch((err) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(err);
      }
      const data = {
        title: 'FOTD - Error',
        pagename: 'article',
        success,
        error
      };
      res.render('article', data);
    });
}
function showCreate(req, res, next) {
  const data = {
    title: 'FOTD - Create Article',
    pagename: 'createArticle',
    action: 'new',
    submitVal: 'Create'
  };
  res.locals.toParent = '../../';
  res.render('create-article', data);
}
function showEdit(req, res, next) {
  getArticle(req.query.id, req.session.username)
    .then((rows) => {
      if (rows.length === 0) {
        throw new Error('User not authorized for the requested article');
      }
      const data = {
        title: `FOTD - Edit ${rows[0].name}`,
        pagename: 'editArticle',
        article: {
          articleId: rows[0].article_id,
          name: rows[0].name,
          desc: rows[0].desc,
          color: rows[0].color,
          dirty: rows[0].dirty,
          garmentType: rows[0].garment_type.dataValues.name,
          dressCode: rows[0].dress_code.dataValues.name,
          tempMin: rows[0].temp_min,
          tempMax: rows[0].temp_max,
          filepath: rows[0].filepath
        }
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
        title: 'FOTD - Edit - Error',
        pagename: 'editArticle',
        error: true
      });
    });
}

module.exports = {
  getArticle,
  getClosetId,
  showArticle,
  showCreate,
  createArticle,
  showEdit,
  editArticle,
  deleteArticle,
  categoricalToId
};
