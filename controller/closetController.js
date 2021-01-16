const { models } = require('../sequelize');
const { Op } = require('sequelize');

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
async function getArticles(username, where = {}) {
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
    ],
    where: where
  });
}

function createWhereFromFilters(filters) {
  // prettier-ignore
  let where = {
    'temp_min': { [Op.gte]: filters.tempMin },
    'temp_max': { [Op.lte]: filters.tempMax }
  };

  if (filters.color !== '*') {
    where.color = filters.color;
  }
  if (filters.type !== '*') {
    where['garment_type_id'] = filters.type;
  }
  if (filters.dresscode !== '*') {
    where['dress_code_id'] = filters.dresscode;
  }
  if (filters.clean !== '*') {
    where.dirty = filters.clean;
  }

  return where;
}

async function filterCloset(req, res, next) {
  getArticles(req.session.username, createWhereFromFilters(req.body))
    .then((query) => {
      res.render('includes/closet-articles', { articles: query });
    })
    .catch((err) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(err);
      }
      res.render('includes/closet-articles');
    });
}

module.exports = {
  showCloset,
  getArticles,
  filterCloset,
  createWhereFromFilters
};
