const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const middleware =  require("../controllers/middleware")

router.get('/', middleware.authenticate, userController.getUsers);
router.get('/mail', userController.sendmail);
router.post('/', userController.createUser);
router.delete('/', userController.deleteUser);
router.post('/connection', userController.connectUser);

module.exports = router;