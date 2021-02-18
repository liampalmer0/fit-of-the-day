const { Sequelize, models } = require('../sequelize');
const { Op } = require('sequelize');
const { getCloset } = require('../controller/closetController');

const TYPE_IDS = { top: 1, btm: 2, oneP: 3 };
const ARTICLE_ATTR = [
  'articleId',
  'name',
  'desc',
  'garmentTypeId',
  'dressCodeId',
  'tempMin',
  'tempMax',
  'filepath'
];
class Outfit {
  constructor(base, partner = {}) {
    this.base = base;
    this.partner = partner === {} ? partner : base;
  }
}
async function getEvents(username, begin = null, end = null) {
  try {
    let where = {};
    if (begin && end) {
      where = { dateTimeStart: { [Op.between]: [begin, end] } };
    }
    return await models.event.findAll({
      include: {
        attributes: ['userId'],
        model: models.user,
        where: { username },
        required: true
      },
      where: where,
      order: [['dateTimeStart', 'ASC']]
    });
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.log(err);
    }
    return [];
  }
}
async function getRandomByType(username, typeId, count = 3) {
  const closet = await getCloset(username);
  return await closet.getArticles({
    where: { garmentTypeId: typeId },
    order: Sequelize.literal('RANDOM()'),
    limit: count
  });
}
async function recRand(username) {
  try {
    const tops = await getRandomByType(username, TYPE_IDS.top);
    const bottoms = await getRandomByType(username, TYPE_IDS.btm);
    if (tops.length < 3 || bottoms.length < 3) {
      throw new Error('FIX ME : not enough data to show recs');
    }
    return [
      { top: tops[0], bottom: bottoms[0] },
      { top: tops[1], bottom: bottoms[1] },
      { top: tops[2], bottom: bottoms[2] }
    ];
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.log(err);
    }
    return 0;
  }
}
/**
 * @deprecated
 * @param {*} username
 * @param {*} filters
 */
async function recRandFiltered(username, filters) {
  // for (const param in filters) {
  //   if (filters.hasOwnProperty(param)) {
  //     const element = filters[param];
  //   }
  // }

  //currently only coded to filter by color
  const color = filters[0].toLowerCase();
  const closet = getCloset(username);
  const tops = await closet.getArticles({
    where: {
      garmentTypeId: 1,
      color
    },
    order: Sequelize.literal('RANDOM()'),
    limit: 3
  });
  const bottoms = await closet.getArticles({
    where: {
      garmentTypeId: 2,
      color
    },
    order: Sequelize.literal('RANDOM()'),
    limit: 3
  });
  return [
    { top: tops[0], bottom: bottoms[0] },
    { top: tops[1], bottom: bottoms[1] },
    { top: tops[2], bottom: bottoms[2] }
  ];
}
function recParams(
  dayTemp = 75,
  dressCodes = [1, 2, 3],
  garmentTypes = [1, 2, 3]
) {
  let gtClause = { garmentTypeId: garmentTypes };
  let dcClause = { dressCodeId: dressCodes };
  let tempClause = {
    [Op.and]: [
      { tempMax: { [Op.gte]: dayTemp } },
      { tempMin: { [Op.lte]: dayTemp } }
    ]
  };
  return { ...tempClause, ...gtClause, ...dcClause, dirty: 'f' };
}
async function findRandomPartner(closet, dayTemp, dressCode) {
  let partner = await closet.getArticles({
    attributes: ARTICLE_ATTR,
    where: recParams(dayTemp, dressCode, [TYPE_IDS.btm]),
    limit: 1,
    order: Sequelize.literal('RANDOM()')
  });
  // if partner still not found, return -1
  if (!partner || partner.length !== 1) {
    return -1;
  } else {
    return partner[0];
  }
}

function consolidateItems(bases, partners) {
  let outfits = [];
  if (bases.length === 0) {
    // no items matched the day at all, return 3 empty outfits
    return [new Outfit(-1), new Outfit(-1), new Outfit(-1)];
  } else {
    for (let i = 0; i < 3; i++) {
      let outfit = new Outfit(-1);
      // if base not null
      if (bases[i]) {
        outfit.base = bases[i];
        // if partner not null & not empty
        if (partners[i] && partners[i] !== -1) {
          outfit.partner = partners[i];
        } else {
          outfit.partner = -1;
        }
      }
      outfits.push(outfit);
    }
    return outfits;
  }
}
async function recommend(username, weather = { tempAverage: 75 }) {
  try {
    const closet = await getCloset(username);
    const now = new Date();
    let nextDay = new Date(now.toUTCString());
    nextDay.setUTCHours(now.getUTCDate() + 1);
    const upcoming = await getEvents(
      username,
      now.toUTCString(),
      nextDay.toUTCString()
    );
    const nextEventDc =
      upcoming.length !== 0 ? upcoming[0].dataValues.dressCodeId : [1, 2, 3];
    let dayTemp = 75;
    if (weather.tempAverage) {
      dayTemp = !isNaN(weather.tempAverage) ? weather.tempAverage : dayTemp;
    }
    // Get 3 Base Articles
    let bases = await closet.getArticles({
      attributes: ARTICLE_ATTR,
      where: recParams(dayTemp, nextEventDc, [TYPE_IDS.top, TYPE_IDS.oneP]),
      order: Sequelize.literal('RANDOM()'),
      limit: 3
    });
    let partners = [];
    //iterate through base article and find saved/make new partners
    for (let item of bases) {
      // if base item is not a one piece
      if (item.dataValues.garmentTypeId !== TYPE_IDS.oneP) {
        // look for saved outfit partners
        let p = await item.getPartner({
          attributes: ARTICLE_ATTR,
          where: recParams(dayTemp, nextEventDc, [TYPE_IDS.btm]),
          order: Sequelize.literal('RANDOM()'),
          limit: 1
        });
        // if missing partner, find random
        p[0] = p[0] ? p[0] : await findRandomPartner(closet, dayTemp);
        partners.push(p[0]);
      } else {
        // if one piece, just add item again as partner
        partners.push(item);
      }
    }
    return consolidateItems(bases, partners);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.log(err);
    }
    return [new Outfit(-1), new Outfit(-1), new Outfit(-1)];
  }
}

module.exports = {
  recRand,
  recRandFiltered,
  recParams,
  consolidateItems,
  recommend
};
