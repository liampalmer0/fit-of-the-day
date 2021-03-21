const { Sequelize, models } = require('../sequelize');
const { Op } = require('sequelize');
const { getCloset } = require('../controller/closetController');
const { getEvents } = require('../controller/calendarController');
const { TYPE_IDS } = require('../common/constants');
const Outfit = require('../common/Outfit');

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

/**
 *
 * @param {Number} dayTemp the days temperature
 * @param {Array<Number>} dressCodes
 * @param {Array<Number>} garmentTypes
 */
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

/**
 * Attempts to fill in any empty article spaces in a given array of outfits
 *
 * @param {*} outfits existing outfits to fill around
 * @param {*} closet the user's closet
 * @param {*} options specifications (weather, dress codes)
 */
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
      TYPE_IDS.single
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
          // when partner arr is smaller than bases
          // if no possible match for day
          if (fillerPartners.length === 0) {
            outfits[i] = new Outfit(fillerBases[i], -1);
          } else {
            let p = i;
            // reduce p until it can be used to get a partner
            while (fillerPartners.length <= p) {
              p = p === 0 ? 0 : p - 1;
            }
            outfits[i] = new Outfit(fillerBases[i], fillerPartners[p]);
          }
        }
      } else {
        outfits[i] = new Outfit(-1);
      }
    }
  }
  return outfits;
}

/**
 * Find 3 outfits that match the given weather data
 *
 * @param {String} username username for finding correct closet
 * @param {*} weather the day's weather data
 */
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
        where: recParams(dayTemp, nextEventDc, [TYPE_IDS.btm, TYPE_IDS.single])
      },
      where: recParams(dayTemp, nextEventDc, [TYPE_IDS.top, TYPE_IDS.single]),
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
  Outfit,
  getEvents,
  getRandomByType,
  recRand,
  recRandFiltered,
  recParams,
  fill,
  recommend
};
