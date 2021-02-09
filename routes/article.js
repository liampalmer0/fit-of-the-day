const express = require('express');

const router = express.Router();
const {
  showArticle,
  showCreate,
  createArticle,
  showEdit,
  editArticle,
  deleteArticle
} = require('../controller/articleController');

const multer = require('multer');
const upload = multer({ dest: 'public/user_img/liam/' });

/* GET article page. */
router.get('/', showArticle);

router.get('/new', showCreate);

router.post('/new', upload.single('image'), createArticle);

router.get('/edit', showEdit);

router.post('/edit', upload.single('image'), editArticle);

router.post('/delete', deleteArticle);

module.exports = router;
