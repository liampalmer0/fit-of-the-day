const { Sequelize, models } = require('../sequelize');

async function recRand(username) {
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
    where: { garment_type_id: 1 },
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
    where: { garment_type_id: 2 },
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
};
