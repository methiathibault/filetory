const express = require('express');
const router = express.Router();

const fileController = require('../controllers/fileController');
const middleware = require("../controllers/middleware");

router.post('/upload', middleware.authenticate, fileController.uploadFiles);
router.get('/', middleware.authenticate, fileController.getFiles);
router.get('/:id/download', middleware.authenticate, fileController.downloadFile);
router.delete('/:id', middleware.authenticate, fileController.deleteFile);

module.exports = router;