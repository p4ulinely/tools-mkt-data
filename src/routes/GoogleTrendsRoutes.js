const express = require('express');
const router = express.Router();

const GoogleTrendsController = require('./../controllers/GoogleTrendsController');

router.get('/tempoReal', GoogleTrendsController.realTimeTrendsByRegion);
router.get('/tendenciasDia', GoogleTrendsController.dailyTrendsByRegion);
router.get('/frequenciasTendenciasDia', GoogleTrendsController.dailyTrendsFrequenciesByRegion);

module.exports = router;
