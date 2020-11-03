const express = require('express');
const router = express.Router();
const controller = require('../controller/dashboardController');

/* GET home page. */
router.get('/', controller.showDashboard);

module.exports = router;
