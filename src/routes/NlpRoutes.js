const express = require('express');
const router = express.Router();

const NlpController = require('./../controllers/NlpController');

router.post('/atomizadorFrase', NlpController.atomizadorFrase);
router.post('/bowDeFrases', NlpController.calcularFrequenciasParaFrases);
// router.get('/mostrar/:data?', NlpController.)

module.exports = router;