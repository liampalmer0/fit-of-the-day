const { Sequelize, models } = require('../sequelize');

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

module.exports = {
  recRand,
  recRandFiltered
};
