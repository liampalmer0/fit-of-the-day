const { models } = require('../sequelize');
const { Op } = require('sequelize');

function showCloset(req, res, next) {
  const success = req.session.opStatus.success;
  const error = req.session.opStatus.error;
  getArticles(req.session.username)
    .then((query) => {
      const data = {
        title: 'FOTD - Closet',
        pagename: 'closet',
        success,
        error,
        articles: query
      };
      req.session.opStatus.success = false;
      req.session.opStatus.error = false;
      res.render('closet', data);
    })
    .catch((err) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(err);
      }
      const data = {
        title: 'FOTD - Closet - Error',
        pagename: 'closet',
        success: false,
        error: { msg: 'Closet data unavailable. Please try again later.' }
      };
      req.session.opStatus.success = false;
      req.session.opStatus.error = false;
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

function createWhere(filters = {}) {
  let where = {};
  if (filters.tempMin) {
    where.tempMin = { [Op.gte]: filters.tempMin };
  }
  if (filters.tempMax) {
    where.tempMax = { [Op.lte]: filters.tempMax };
  }
  if (filters.color !== '' && filters.color) {
    where.color = filters.color;
  }
  if (filters.type !== '' && filters.type) {
    where.garmentTypeId = filters.type;
  }
  if (filters.dresscode !== '' && filters.dresscode) {
    where.dressCodeId = filters.dresscode;
  }
  if (filters.dirty !== '' && filters.dirty) {
    where.dirty = filters.dirty;
  }

  return where;
}

async function filterCloset(req, res, next) {
  getArticles(req.session.username, createWhere(req.body))
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

async function laundryDay(req, res, next) {
  try {
    let closet = await models.closet.findOne({
      attributes: ['closetId'],
      include: {
        model: models.user,
        attributes: ['username'],
        where: { username: req.session.username },
        required: true
      }
    });
    await models.article.update(
      {
        dirty: 'f'
      },
      { where: { dirty: 't', closetId: closet.dataValues.closetId } }
    );
    req.session.opStatus.success = { msg: 'Closet updated successfully' };
    req.session.opStatus.error = false;
    res.redirect('/' + req.session.username + '/closet');
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.log(err);
    }
    req.session.opStatus.success = false;
    req.session.opStatus.error = { msg: 'Closet update failed' };
    res.redirect('/' + req.session.username + '/closet');
  }
}

module.exports = {
  showCloset,
  getArticles,
  filterCloset,
  createWhere,
  laundryDay
};
