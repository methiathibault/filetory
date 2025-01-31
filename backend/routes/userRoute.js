const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const middleware =  require("../controllers/middleware")

router.get('/', middleware.authenticate, userController.getUsers);
router.get('/:id', middleware.authenticate, userController.getUser);
router.get('/mail', userController.sendmail);
router.post('/', userController.createUser);
router.delete('/:id', middleware.authenticate, userController.deleteUser);
router.post('/connection', userController.connectUser);

module.exports = router;