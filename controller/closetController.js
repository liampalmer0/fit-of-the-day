const { models } = require('../sequelize');
const { Op } = require('sequelize');

async function getCloset(username) {
  return await models.closet.findOne({
    attributes: ['closetId'],
    include: {
      attributes: ['userId'],
      model: models.user,
      where: { username },
      required: true
    }
  });
}

async function showCloset(req, res, next) {
  try {
    const success = req.session.opStatus.success;
    const error = req.session.opStatus.error;
    const closet = await getCloset(req.session.username);
    const articles = await closet.getArticles();
    const data = {
      title: 'FOTD - Closet',
      pagename: 'closet',
      success,
      error,
      articles
    };
    req.session.opStatus.success = false;
    req.session.opStatus.error = false;
    res.render('closet', data);
  } catch (err) {
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
  }
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
  try {
    const closet = await getCloset(req.session.username);
    const articles = await closet.getArticles({ where: createWhere(req.body) });
    res.render('includes/closet-articles', { articles: articles });
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.log(err);
    }
    res.render('includes/closet-articles');
  }
}

async function laundryDay(req, res, next) {
  try {
    let closet = await getCloset(req.session.username);
    await models.article.update(
      {
        dirty: 'f'
      },
      { where: { dirty: 't', closetId: closet.dataValues.closetId } }
    );
    req.session.opStatus.success = { msg: "All articles set to 'clean'" };
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
  getCloset,
  showCloset,
  filterCloset,
  createWhere,
  laundryDay
};
