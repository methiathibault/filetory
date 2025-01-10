const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.get('/', userController.getUsers);
router.post('/', userController.createUser);
router.post('/connection', userController.connectUser);

module.exports = router;