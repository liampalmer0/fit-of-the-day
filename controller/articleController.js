const { models } = require('../sequelize');
const fs = require('fs');
const path = require('path');
const { getCloset } = require('./closetController');

const TYPE_IDS = { top: 1, bottom: 2, 'one piece': 3 };
const DRESS_CODE_IDS = { casual: 1, 'semi-formal': 2, formal: 3 };

async function getArticle(articleId, username) {
  try {
    const closet = await getCloset(username);
    if (!closet) {
      return [];
    }
    return await closet.getArticles({
      include: { all: true },
      where: { articleId },
      limit: 1
    });
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.log(err);
    }
    return [];
  }
}

async function createArticle(req, res, next) {
  // create article from req.body
  try {
    let filepath = '';
    const dirty = req.body.dirty ? 't' : 'f';

    if (!req.file) {
      if (TYPE_IDS[req.body.type] === 1) {
        filepath = 's-null.png';
      } else {
        filepath = 'p-null.png';
      }
    } else {
      filepath = req.file.filename;
    }
    const closet = await getCloset(req.session.username);
    const dbRes = await closet.createArticle({
      name: req.body.name,
      desc: req.body.desc,
      dirty,
      garmentTypeId: TYPE_IDS[req.body.type],
      color: parseInt(req.body.color.slice(1), 16),
      dressCodeId: DRESS_CODE_IDS[req.body.dressCode],
      tempMin: req.body.tempMin,
      tempMax: req.body.tempMax,
      filepath
    });
    req.session.opStatus = {
      success: { msg: 'Article created successfully' },
      error: false
    };
    res.redirect(
      `/${req.session.username}/closet/article?id=${dbRes.dataValues.articleId}`
    );
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.log(err);
    }
    req.session.opStatus = {
      success: false,
      error: { msg: 'Article creation failed' }
    };
    res.redirect(`/${req.session.username}/closet`);
  }
}
async function editArticle(req, res, next) {
  try {
    let filepath = '';
    const dirty = req.body.dirty ? 't' : 'f';

    if (!req.file) {
      if (!req.body.previousFile) {
        if (TYPE_IDS[req.body.type] === 1) {
          filepath = 's-null.png';
        } else {
          filepath = 'p-null.png';
        }
      } else {
        filepath = req.body.filepath;
      }
    } else {
      filepath = req.file.filename;
    }
    await models.article.update(
      {
        name: req.body.name,
        desc: req.body.desc,
        dirty,
        garmentTypeId: TYPE_IDS[req.body.type],
        color: parseInt(req.body.color.slice(1), 16),
        dressCodeId: DRESS_CODE_IDS[req.body.dressCode],
        tempMin: req.body.tempMin,
        tempMax: req.body.tempMax,
        filepath
      },
      {
        include: {
          model: models.closet,
          attributes: ['closetId'],
          include: {
            model: models.user,
            attributes: ['username'],
            where: { username: req.session.username },
            required: true
          }
        },
        where: {
          articleId: req.query.id
        }
      }
    );
    req.session.opStatus = {
      success: { msg: 'Article updated successfully' },
      error: false
    };
    res.redirect(`/${req.session.username}/closet/article?id=${req.query.id}`);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`${err.message}\n${err.name}\n${err.stack}`);
    }
    req.session.opStatus = {
      success: false,
      error: { msg: 'Article update failed' }
    };
    res.redirect(`/${req.session.username}/closet/article?id=${req.query.id}`);
  }
}
async function deleteArticle(req, res, next) {
  try {
    const filepathRow = await models.article.findOne({
      attributes: ['filepath'],
      include: {
        model: models.closet,
        attributes: ['closetId'],
        required: true,
        include: {
          model: models.user,
          attributes: ['userId', 'username'],
          required: true
        }
      },
      where: { articleId: req.query.id }
    });
    if (filepathRow) {
      if (
        filepathRow.dataValues.filepath !== 'p-null.png' &&
        filepathRow.dataValues.filepath !== 's-null.png' &&
        filepathRow.dataValues.filepath.slice(-4) !== '.png' // if not test data img
      ) {
        fs.unlink(
          path.join('public/user_img/liam', filepathRow.dataValues.filepath),
          (err) => {
            if (err) {
              throw err;
            }
          }
        );
      }
    }

    await models.article.destroy({
      include: [
        {
          model: models.closet,
          attributes: ['closetId'],
          include: [
            {
              model: models.user,
              attributes: ['username'],
              where: { username: req.session.username },
              required: true
            }
          ],
          required: true
        }
      ],
      where: {
        articleId: req.query.id
      }
    });
    req.session.opStatus = {
      success: { msg: 'Article deleted successfully' },
      error: false
    };
    res.redirect(`/${req.session.username}/closet`);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`${err.message}\n${err.name}\n${err.stack}`);
    }
    req.session.opStatus = {
      success: false,
      error: { msg: 'Article deletion failed' }
    };
    res.redirect(`/${req.session.username}/closet/article?id=${req.query.id}`);
  }
}
function showArticle(req, res, next) {
  let success = req.session.opStatus.success;
  let error = req.session.opStatus.error;
  getArticle(req.query.id, req.session.username)
    .then((rows) => {
      if (rows.length === 0) {
        success = false;
        error = { msg: 'Article could not be found' };
      }
      const data = {
        title: `FOTD - ${rows[0].name}`,
        pagename: 'article',
        success,
        error,
        article: {
          articleId: rows[0].articleId,
          name: rows[0].name,
          desc: rows[0].desc,
          color: rows[0].color.toString(16).padStart(6, '0'),
          dirty: rows[0].dirty,
          garmentType: rows[0].garmentType.dataValues.name,
          dressCode: rows[0].dressCode.dataValues.name,
          tempMin: rows[0].tempMin,
          tempMax: rows[0].tempMax,
          filepath: rows[0].filepath
        }
      };
      req.session.opStatus.success = false;
      req.session.opStatus.error = false;
      res.render('article', data);
    })
    .catch((err) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(err);
      }
      const data = {
        title: 'FOTD - Error',
        pagename: 'article',
        success,
        error: { msg: 'Article data unavailable. Please try again later.' }
      };
      res.render('article', data);
    });
}
function showCreate(req, res, next) {
  const data = {
    title: 'FOTD - Create Article',
    pagename: 'createArticle',
    action: 'new',
    submitVal: 'Create'
  };
  res.render('create-article', data);
}
function showEdit(req, res, next) {
  getArticle(req.query.id, req.session.username)
    .then((rows) => {
      if (rows.length === 0) {
        throw new Error('User not authorized for the requested article');
      }
      const data = {
        title: `FOTD - Edit ${rows[0].name}`,
        pagename: 'editArticle',
        article: {
          articleId: rows[0].articleId,
          name: rows[0].name,
          desc: rows[0].desc,
          color: rows[0].color.toString(16).padStart(6, '0'),
          dirty: rows[0].dirty,
          garmentType: rows[0].garmentType.dataValues.name,
          dressCode: rows[0].dressCode.dataValues.name,
          tempMin: rows[0].tempMin,
          tempMax: rows[0].tempMax,
          filepath: rows[0].filepath
        }
      };
      data.action = '';
      data.submitVal = 'Save';
      res.render('edit-article', data);
    })
    .catch((err) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(err);
      }
      res.render('edit-article', {
        title: 'FOTD - Edit - Error',
        pagename: 'editArticle',
        error: true
      });
    });
}

module.exports = {
  getArticle,
  showArticle,
  showCreate,
  createArticle,
  showEdit,
  editArticle,
  deleteArticle
};
