const express = require('express');

const router = express.Router();
const articleRouter = require('./article');
const { showCloset } = require('../controller/closetController');

/* GET closet page. */
router.get('/', showCloset);

router.use('/article', articleRouter);

module.exports = router;
