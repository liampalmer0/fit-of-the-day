const { models } = require('../sequelize');

function showCloset(req, res, next) {
  let success = req.session.success;
  let error = req.session.error;
  getArticles(req.session.username)
    .then((query) => {
      let data = {
        title: 'FOTD - Closet',
        pagename: 'closet',
        success: success,
        error: error,
        articles: query,
      };
      req.session.success = false;
      req.session.error = false;
      res.render('closet', data);
    })
    .catch((err) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(err);
      }
      let data = {
        title: 'FOTD - Closet - Error',
        pagename: 'closet',
        success: success,
        error: error,
      };
      req.session.success = false;
      req.session.error = false;
      res.render('closet', data);
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
