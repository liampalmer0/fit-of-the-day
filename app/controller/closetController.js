const { models } = require('../sequelize');
const { Op } = require('sequelize');
const { TYPE_IDS } = require('../common/constants');
const Outfit = require('../common/Outfit');

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
async function getOutfits(closet) {
  let outfits = [];
  let bases = await closet.getArticles({
    include: {
      model: models.article,
      as: 'partner',
      required: true,
      where: { garmentTypeId: [TYPE_IDS.btm, TYPE_IDS.single] }
    },
    where: { garmentTypeId: [TYPE_IDS.top, TYPE_IDS.single] }
  });
  // Iterate through base outfits and the favorites/saved outfits favorites
  bases.forEach((base) => {
    base.dataValues.partner.forEach((partner) => {
      if (partner.dataValues.outfit.favorite) {
        outfits.push(new Outfit(base, partner, true));
      }
    });
  });
  return outfits;
}

async function showCloset(req, res, next) {
  try {
    const closet = await getCloset(req.session.username);
    const data = {
      title: 'FOTD - Closet',
      pagename: 'closet',
      success: req.session.opStatus.success,
      error: req.session.opStatus.error,
      articles: await closet.getArticles({ order: [['garmentTypeId', 'ASC']] }),
      outfits: await getOutfits(closet),
      tab: req.query.outfits ? 'outfits' : 'articles'
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
    res.render('includes/closet-articles', {
      articles: await closet.getArticles({ where: createWhere(req.body) })
    });
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
