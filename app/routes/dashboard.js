const express = require('express');

const router = express.Router();
const controller = require('../controller/dashboardController');

/* GET home page. */
router.get('/', controller.showDashboard);

router.post('/', controller.regenFiltered);

router.get('/recommend', controller.regenRecommendations);

router.post('/favorite', controller.setFavorite);

router.get('/dirty', controller.setDirty);

module.exports = router;
