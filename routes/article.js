const express = require('express');
const router = express.Router();
const {
  showArticle,
  showCreate,
  createArticle,
  showEdit,
  editArticle,
  deleteArticle,
} = require('../controller/articleController');

/* GET article page. */
router.get('/', showArticle);

router.get('/new', showCreate);

router.post('/new', createArticle);

router.get('/edit', showEdit);

router.post('/edit', editArticle);

router.post('/delete', deleteArticle);

module.exports = router;
