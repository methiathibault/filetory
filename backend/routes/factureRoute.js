const express = require('express');
const router = express.Router();

const factureController = require('../controllers/factureController');
const middleware =  require("../controllers/middleware")

router.get('/', middleware.authenticate, factureController.getFactures);
router.get('/:id', middleware.authenticate, factureController.getFacture);
router.get('/user/:id', middleware.authenticate, factureController.getFactureByUserId);
router.post('/', middleware.authenticate, factureController.newFacture);
router.delete('/', middleware.authenticate, factureController.deleteFacture);

module.exports = router;