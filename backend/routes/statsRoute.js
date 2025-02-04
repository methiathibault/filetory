const express = require('express');
const router = express.Router();

const statsController = require('../controllers/statsController');
const middleware = require("../controllers/middleware");

router.get('/', middleware.authenticate, statsController.getStats);

module.exports = router;