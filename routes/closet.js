const express = require('express');

const router = express.Router();
const articleRouter = require('./article');
const { showCloset, closetFilter } = require('../controller/closetController');

/* GET closet page. */
router.get('/', showCloset);

router.use('/article', articleRouter);

router.post('/', closetFilter);

module.exports = router;
