const { Sequelize, models } = require('../sequelize');
const { Op } = require('sequelize');
const { getCloset } = require('../controller/closetController');

const TYPE_IDS = { top: 1, btm: 2, oneP: 3 };

class Outfit {
  constructor(base, partner = null, favorite = false) {
    this.base = base;
    this.partner = partner ? partner : base;
    this.favorite = favorite;
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

async function fill(
  outfits,
  closet,
  options = {
    dayTemp: 75,
    dressCodes: [1, 2, 3]
  }
) {
  // pre-load 3 new bases & partners
  const fillerBases = await closet.getArticles({
    where: recParams(options.dayTemp, options.dressCodes, [
      TYPE_IDS.top,
      TYPE_IDS.oneP
    ]),
    order: Sequelize.literal('RANDOM()')
  });
  const fillerPartners = await closet.getArticles({
    where: recParams(options.dayTemp, options.dressCodes, [TYPE_IDS.btm]),
    order: Sequelize.literal('RANDOM()')
  });
  for (let i = 0; i < 3; i++) {
    if (outfits[i].base === -1) {
      if (fillerBases[i]) {
        if (fillerBases[i].dataValues.garmentTypeId === 3) {
          outfits[i] = new Outfit(fillerBases[i]);
        } else {
          outfits[i] = new Outfit(
            fillerBases[i],
            fillerPartners[i] ? fillerPartners[i] : -1
          );
        }
      } else {
        outfits[i] = new Outfit(-1);
      }
    }
  }
  return outfits;
}

async function recommend(username, weather = { tempAverage: 75 }) {
  try {
    const closet = await getCloset(username);
    const now = new Date();
    const nextDay = new Date(now.toUTCString());
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

    // Get at most 3 favorited outfits that match the day
    let bases = await closet.getArticles({
      include: {
        model: models.article,
        as: 'partner',
        required: true,
        where: recParams(dayTemp, nextEventDc, [TYPE_IDS.btm, TYPE_IDS.oneP])
      },
      where: recParams(dayTemp, nextEventDc, [TYPE_IDS.top, TYPE_IDS.oneP]),
      order: Sequelize.literal('RANDOM()')
    });
    let outfits = [new Outfit(-1), new Outfit(-1), new Outfit(-1)];

    // Iterate through base articles and find partners
    const matchCount = bases.length < 3 ? bases.length : 3;
    let missing = 3;
    for (let i = 0; i < matchCount; i++) {
      if (bases[i].dataValues.partner[0].outfit.dataValues.favorite) {
        outfits[i] = new Outfit(bases[i], bases[i].dataValues.partner[0], true);
        missing--;
      }
    }
    if (missing > 0) {
      outfits = await fill(outfits, closet, {
        dayTemp,
        dressCodes: nextEventDc
      });
    }
    return outfits;
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
