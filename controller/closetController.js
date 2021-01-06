const { models } = require('../sequelize');

function showCloset(req, res, next) {
  getArticles(req.session.username)
    .then((query) => {
      let data = {};
      data.success = req.session.success ? req.session.success : false;
      req.session.success = false;
      data.title = 'FOTD - Closet';
      data.pagename = 'closet';
      data.articles = query;
      res.render('closet', data);
    })
    .catch((err) => {
      res.render('error', {
        message: 'Closet Unavailable',
        error: { status: err, stack: err.stack },
      });
    });
}
async function getArticles(username) {
  return await models.article.findAll({
    include: [
      {
        model: models.closet,
        attributes: ['name'],
        include: [
          {
            attributes: ['username'],
            model: models.user,
            where: { username: username },
            required: true,
          },
        ],
        required: true,
      },
    ],
  });
}
module.exports = {
  showCloset: showCloset,
  getArticles: getArticles,
};
