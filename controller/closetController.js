const { models } = require('../sequelize');

module.exports = {
  getClosetId: async function getClosetId(username) {
    let closet = await models.closet.findOne({
      include: {
        attributes: ['user_id'],
        model: models.user,
        where: { username: username },
        required: true,
      },
    });
    return closet.dataValues.closet_id;
  },
  getArticles: async function getArticles(username, closetid) {
    return await models.article.findAll({
      include: [
        {
          model: models.closet,
          attributes: ['name'],
          where: { closet_id: closetid },
          include: [
            {
              attributes: ['username'],
              model: models.user,
              where: { username: username },
            },
          ],
          required: true,
        },
      ],
    });
  },
};
