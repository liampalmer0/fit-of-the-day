const { models } = require('../sequelize');

function showCloset(req, res, next) {
  const { success } = req.session;
  const { error } = req.session;
  getArticles(req.session.username)
    .then((query) => {
      const data = {
        title: 'FOTD - Closet',
        pagename: 'closet',
        success,
        error,
        articles: query
      };
      req.session.success = false;
      req.session.error = false;
      res.render('closet', data);
    })
    .catch((err) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(err);
      }
      const data = {
        title: 'FOTD - Closet - Error',
        pagename: 'closet',
        success,
        error
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
            where: { username },
            required: true
          }
        ],
        required: true
      }
    ]
  });
}
module.exports = {
  showCloset,
  getArticles
};
