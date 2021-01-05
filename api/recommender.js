const { Sequelize, models } = require('../sequelize');
const typeIds = { top: 1, btm: 2, oneP: 3 };

async function getRandomByType(username, type_id, count = 3) {
  return await models.article.findAll({
    include: {
      attributes: ['closet_id', 'user_id'],
      model: models.closet,
      include: [
        {
          attributes: ['user_id', 'username'],
          model: models.user,
          where: { username: username },
        },
      ],
      required: true,
    },
    where: { garment_type_id: type_id },
    order: Sequelize.literal('RANDOM()'),
    limit: count,
  });
}
async function recRand(username) {
  let tops = await getRandomByType(username, typeIds.top);
  let bottoms = await getRandomByType(username, typeIds.btm);
  if (tops.length < 3 || bottoms.length < 3) {
    console.log('TODO : FIX : not enough data to show recs ');
    return 0;
  }
  return [
    { top: tops[0], bottom: bottoms[0] },
    { top: tops[1], bottom: bottoms[1] },
    { top: tops[2], bottom: bottoms[2] },
  ];
}

async function recRandFiltered(username, filters) {
  // for (const param in filters) {
  //   if (filters.hasOwnProperty(param)) {
  //     const element = filters[param];
  //   }
  // }
  let color = filters[0].toLowerCase();
  let tops = await models.article.findAll({
    include: {
      model: models.closet,
      include: [
        {
          model: models.user,
          where: { username: username },
        },
      ],
    },
    where: {
      garment_type_id: 1,
      color: color,
    },
    order: Sequelize.literal('RANDOM()'),
    limit: 3,
  });
  let bottoms = await models.article.findAll({
    include: {
      model: models.closet,
      include: [
        {
          model: models.user,
          where: { username: username },
        },
      ],
    },
    where: {
      garment_type_id: 2,
      color: color,
    },
    order: Sequelize.literal('RANDOM()'),
    limit: 3,
  });
  return [
    { top: tops[0], bottom: bottoms[0] },
    { top: tops[1], bottom: bottoms[1] },
    { top: tops[2], bottom: bottoms[2] },
  ];
}

module.exports = {
  recRand: recRand,
  recRandFiltered: recRandFiltered,
};
