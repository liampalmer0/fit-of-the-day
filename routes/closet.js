const express = require('express');

const router = express.Router();
const articleRouter = require('./article');
const outfitRouter = require('./outfit');
const {
  showCloset,
  filterCloset,
  laundryDay
} = require('../controller/closetController');

/* GET closet page. */
router.get('/', showCloset);

router.use('/article', articleRouter);

router.post('/filter', filterCloset);

router.get('/laundryDay', laundryDay);

router.use('/outfits', outfitRouter);

module.exports = router;
