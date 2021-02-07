const { Sequelize, models } = require('../sequelize');
const { Op } = require('sequelize');

const typeIds = { top: 1, btm: 2, oneP: 3 };

async function getRandomByType(username, typeId, count = 3) {
  return await models.article.findAll({
    include: {
      attributes: ['closetId', 'userId'],
      model: models.closet,
      include: [
        {
          attributes: ['userId', 'username'],
          model: models.user,
          where: { username }
        }
      ],
      required: true
    },
    where: { garmentTypeId: typeId },
    order: Sequelize.literal('RANDOM()'),
    limit: count
  });
}
async function recRand(username) {
  try {
    const tops = await getRandomByType(username, typeIds.top);
    const bottoms = await getRandomByType(username, typeIds.btm);
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

async function recRandFiltered(username, filters) {
  // for (const param in filters) {
  //   if (filters.hasOwnProperty(param)) {
  //     const element = filters[param];
  //   }
  // }

  //currently only coded to filter by color
  const color = filters[0].toLowerCase();
  const tops = await models.article.findAll({
    include: {
      model: models.closet,
      include: [
        {
          model: models.user,
          attributes: ['username'],
          where: { username }
        }
      ],
      required: true
    },
    where: {
      garmentTypeId: 1,
      color
    },
    order: Sequelize.literal('RANDOM()'),
    limit: 3
  });
  const bottoms = await models.article.findAll({
    include: {
      model: models.closet,
      include: [
        {
          model: models.user,
          attributes: ['username'],
          where: { username }
        }
      ],
      required: true
    },
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
async function findRandomPartner(closet, weather) {
  let partner = await closet.getArticles({
    attributes: [
      'articleId',
      'name',
      'desc',
      'garmentTypeId',
      'dressCodeId',
      'tempMin',
      'tempMax',
      'filepath'
    ],
    where: {
      [Op.and]: [
        { tempMax: { [Op.gt]: weather.tempAverage } },
        { tempMin: { [Op.lt]: weather.tempAverage } }
      ],
      garmentTypeId: 2
    },
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
async function recommend(username, weather = { tempAverage: 75 }) {
  try {
    let dayTemp = 75;
    if (weather.tempAverage) {
      dayTemp = !isNaN(weather.tempAverage) ? weather.tempAverage : 75;
    }
    let closet = await models.closet.findOne({
      attributes: ['closetId'],
      include: {
        attributes: ['userId'],
        model: models.user,
        where: { username },
        required: true
      }
    });
    let bases = await closet.getArticles({
      attributes: [
        'articleId',
        'name',
        'desc',
        'garmentTypeId',
        'dressCodeId',
        'tempMin',
        'tempMax',
        'filepath'
      ],
      where: {
        [Op.and]: [
          {
            [Op.and]: [
              { tempMax: { [Op.gt]: dayTemp } },
              { tempMin: { [Op.lt]: dayTemp } }
            ]
          },
          {
            [Op.or]: [
              {
                garmentTypeId: 1
              },
              {
                garmentTypeId: 3
              }
            ]
          }
        ]
      },
      order: Sequelize.literal('RANDOM()'),
      limit: 3
    });
    let partners = [];
    for (let item of bases) {
      if (item.dataValues.garmentTypeId !== 3) {
        let p = await item.getPartner({
          attributes: [
            'articleId',
            'name',
            'desc',
            'garmentTypeId',
            'dressCodeId',
            'tempMin',
            'tempMax',
            'filepath'
          ],
          where: {
            [Op.and]: [
              { tempMax: { [Op.gt]: dayTemp } },
              { tempMin: { [Op.lt]: dayTemp } }
            ],
            garmentTypeId: 2,
            dirty: 'f'
          },
          order: Sequelize.literal('RANDOM()'),
          limit: 1
        });
        // if missing partner, find random
        p[0] = p[0]
          ? p[0]
          : await findRandomPartner(closet, { tempAverage: dayTemp });
        partners.push(p[0]);
      } else {
        partners.push(item);
      }
    }
    let outfits = [];
    for (let i = 0; i < 3; i++) {
      let outfit = {};
      if (bases[i]) {
        outfit.base = bases[i];
        if (partners[i] && partners[i] !== -1) {
          outfit.partner = partners[i];
        } else {
          outfit.partner = -1;
        }
      } else {
        outfit.base = -1;
        outfit.partner = -1;
      }
      outfits.push(outfit);
    }
    return outfits;
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.log(err);
    }
    return { bases: [-1, -1, -1], partners: [-1, -1, -1] };
  }
}

module.exports = {
  recRand,
  recRandFiltered,
  recommend
};
