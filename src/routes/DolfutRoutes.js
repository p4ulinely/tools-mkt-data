const express = require('express');
const router = express.Router();

const PtaxController = require('./../controllers/dolfut/PtaxController');
const AjusteController = require('./../controllers/dolfut/AjusteController');
const PainelController = require('./../controllers/dolfut/PainelController');
const DolfutController = require('./../controllers/dolfut/DolfutController');

router.get('/', (req, res) => {
	res.send('dados ptax: /dolfut/ptax/MM-DD-AAAA ou AA <br>dados ajuste: /dolfut/ajusteDolar/MM-DD-AAAA');

});

//
router.get(`/painel`, PainelController.index)

// rotas para dados do Dolfut
router.get(`/tudo`, DolfutController.index);
router.get(`/:data`, DolfutController.show);
router.post(``, DolfutController.create);

// rotas para ptax
router.get(`/ptax/tudo`, PtaxController.index);
router.get(`/ptax/:data`, PtaxController.show);
router.post(`/ptax`, PtaxController.coletar);
router.get(`/ptax/media/:dias`, PtaxController.media);

// rotas para ajustes do Dolfut
router.get(`/ajuste/tudo`, AjusteController.index);
router.get(`/ajuste/:data`, AjusteController.show);
router.post(`/ajuste`, AjusteController.coletar);

module.exports = router;