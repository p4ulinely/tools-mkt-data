const express = require('express')
const router = express.Router()
const TwitterController = require('./../controllers/TwitterController')

router.get('/perfil/:perfil?', TwitterController.getTweets)
router.get('/coletar/:perfil?', TwitterController.coletarFintwit)
router.get('/mostrar/:perfil?', TwitterController.mostrarFintwit)
// router.post('/frequencia/:frase?', TwitterController.calcularFrequenciaParaFrase)// desnecessário, já tem na rota de nlp
router.get('/pordata/tweets', TwitterController.tweetsPorData) // Retorna todos os tweets é um arquivo gigante.
router.get('/pordata/itweets', TwitterController.intensidadeTweetsPorData)
// router.get('/sentimentos/gera', TwitterController.geraSentimentosSeteDia) // NAO usar até que ache uma forma de usar nlp.js:carregaOntoPT()
// router.get('/sentimentos/mostra', TwitterController.mostraSentimentos) // NAO usar até que ache uma forma de usar nlp.js:carregaOntoPT()

module.exports = router