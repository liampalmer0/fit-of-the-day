const { models } = require('../sequelize');

function showCloset(req, res, next) {
  const { success } = req.session;
  const { error } = req.session;
  getArticles(req.session.username)
    .then((query) => {
      const data = {
        title: 'FOTD - Closet',
        pagename: 'closet',
        success,
        error,
        articles: query
      };
      req.session.success = false;
      req.session.error = false;
      res.render('closet', data);
    })
    .catch((err) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(err);
      }
      const data = {
        title: 'FOTD - Closet - Error',
        pagename: 'closet',
        success,
        error
      };
      req.session.success = false;
      req.session.error = false;
      res.render('closet', data);
    });
}
async function getArticles(username) {
  return await models.article.findAll({
    include: [
      {
        model: models.closet,
        attributes: ['name'],
        include: [
          {
            attributes: ['username'],
            model: models.user,
            where: { username },
            required: true
          }
        ],
        required: true
      }
    ]
  });
}

async function getArticlesFiltered(username, body) {
  // prettier-ignore
  let where = {};

  if (body.color !== '*') {
    where.color = body.color;
  }
  if (body.type !== '*') {
    where['garment_type_id'] = body.type;
  }
  if (body.dress_code !== '*') {
    where['dress_code_id'] = body['dress_code'];
  }
  if (body.clean !== '*') {
    where.dirty = body.clean;
  }
  if (body.temp_min !== -15) {
    where['temp_min'] = body['temp_min'];
  }
  if (body.temp_max !== 120) {
    where['temp_max'] = body['temp_max'];
  }

  return await models.article.findAll({
    include: [
      {
        model: models.closet,
        attributes: ['name'],
        include: [
          {
            attributes: ['username'],
            model: models.user,
            where: { username: username },
            required: true
          }
        ],
        required: true
      }
    ],
    where: where
  });
}

async function closetFilter(req, res, next) {
  const { success } = req.session;
  const { error } = req.session;

  getArticlesFiltered(req.session.username, req.body)
    .then((query) => {
      const data = {
        title: 'FOTD - Closet',
        pagename: 'closet',
        success,
        error,
        articles: query
      };
      req.session.success = false;
      req.session.error = false;
      res.render('closet', data);
    })
    .catch((err) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(err);
      }
      const data = {
        title: 'FOTD - Closet - Error',
        pagename: 'closet',
        success,
        error
      };
      req.session.success = false;
      req.session.error = false;
      res.render('closet', data);
    });
}

module.exports = {
  showCloset,
  getArticles,
  closetFilter,
  getArticlesFiltered
};
