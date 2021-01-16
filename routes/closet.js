const express = require('express');

const router = express.Router();
const articleRouter = require('./article');
const { showCloset, filterCloset } = require('../controller/closetController');

/* GET closet page. */
router.get('/', showCloset);

router.use('/article', articleRouter);

router.post('/filter', filterCloset);

module.exports = router;
