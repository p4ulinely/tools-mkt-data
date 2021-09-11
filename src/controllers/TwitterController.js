const twitter = require('twitter-lite');
const mongoose = require('mongoose');
require('dotenv-safe').config();
const nlp = require('./../services/nlp');
const consultas_mdb = require('./../models/consultas');
// const fs = require('fs');

const Fintwit = mongoose.model('Fintwit');
const SentimentosPalavras = mongoose.model('SentimentosPalavras');

const client = new twitter({
    subdomain: "api", // "api" is the default (change for other subdomains)
    version: "1.1", // version "1.1" is the default (change for other subdomains)
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

const perfisFintwit = [
    "cafecomferri", "albuquerque_af", "hbredda", "fernandocluiz", "josuenunes", 
    "PabloSpyer", "quantzed", "MeninRibeiro", "ThiagoNigro", "helocruz", 
    "FariaLimaElevat", "sf2invest", "jlbraga", "PLynchado", "IVANKRAISER",
    "jcamargonyc", "lnunesjr", "leononatotrader", "israel_massa", "THIAGOSALOMAO",
    "rafaelbboa", "renoirvieira", "femisapien_z", "OgroWallSt", "KIMPAIFFER"];

module.exports = {
    async getTweets(req, res){
        try {

            let perfil = req.params.perfil || "twitter"
            let ult_type = req.query.ult_type || "mixed"
            let tweets = []

            console.log(`requesting tweets de "${perfil}"...`)

            const requestTwitter = await client.get("statuses/user_timeline", {
                screen_name: perfil,
                include_entities: true,
                count: 200,
                ult_type, // mixed(default), popular, recent
                // until: "2020-06-18"
            })

            for (let tweet of requestTwitter) {
                tweets.push([
                    tweet.id,
                    tweet.created_at,
                    tweet.text
                ])
            }

            console.log(" :: tweets coletados:", tweets.length)

            return res.json(tweets)
        } catch (err) {
            console.error(err)

            return res.status(400).json({
                msg: "ErrorCatch"
            })
        }
    },

    async coletarFintwit(req, res){
        try {

            let tweetsInseridos = 0
            let tweetsExistentes = 0
            const perfilEspecifico = req.params.perfil
            const perfis = perfilEspecifico ? [perfilEspecifico] : perfisFintwit

            for (let perfil of perfis) {

                console.log(`requesting tweets de "${perfil}"...`)

                const requestTwitter = await client.get("statuses/user_timeline", {
                    screen_name: perfil,
                    include_entities: true,
                    count: 200,
                    result_type: "mixed", // mixed (default), popular or recent
                    // until: "2020-06-14"
                })

                console.log(` :: ${requestTwitter.length} tweets coletados!`)
                console.log(`  : verificando se tweets já existem...`)

                for (let tweet of requestTwitter) {

                    const tweetExiste = await Fintwit.find({
                        tweet_id: tweet.id,
                    })

                    if (tweetExiste.length == 0) {
                        await Fintwit.create({
                            perfil,
                            tweet_id: tweet.id,
                            created_at: tweet.created_at,
                            text: tweet.text,
                            hashtags: tweet.hashtags,
                            symbols: tweet.symbols
                        })

                        tweetsInseridos++
                    } else tweetsExistentes++
                }
            }

            console.log("inseridos:", tweetsInseridos)
            console.log("já existentes:", tweetsExistentes)

            return res.json({
                "inseridos": tweetsInseridos,
                "existentes": tweetsExistentes
            })

        } catch (err) {
            console.error(err)

            return res.status(400).json({
                msg: "ErrorCatch"
            })
        }
    },
	
    async mostrarFintwit(req, res){
        try {
            
            const { perfil = "todos" } = req.params
            const { page = 1 } = req.query
            let tweets = null

            console.log("coletando do BD...")
                
            if (perfil != "" && perfil != "todos" ){
                tweets = await Fintwit.paginate({ perfil }, {
                    page,
                    limit: 50, 
                    sort: {
                        created_at: -1
                    }
                })
            } else {
                tweets = await Fintwit.paginate({}, {
                    page,
                    limit: 50, 
                    sort: {
                        created_at: -1
                    }
                })
            }

            console.log(`tweets coletados: ${tweets.total}, pagina: ${tweets.page}, paginas: ${tweets.pages}`)

            return res.json({ tweets })

        } catch (err) {
            console.error(err)

            return res.status(400).json({
                msg: "ErrorCatch"
            })
        }
    },

    // async calcularFrequenciaParaFrase(req, res) {
    //     try {
            
    //         let frasePOST = req.body.frase || ""
    //         console.log("calculando frequencias...")

    //         let frequencias_tokens = frasePOST == "" ? "vazio" : nlp.listaDeFrequenciasParaFrase(frasePOST)

    //         console.log(` :: ${Object.keys(frequencias_tokens).length} frequencias calculadas para frase informada.`)
            
    //         res.json({ frequencias_tokens })
    //     } catch (err) {
    //         console.error(err)

    //         res.status(400).json({
    //             msg: "ErrorCatch"
    //         })
    //     }
    // },
    
    async tweetsPorData(req, res){
        try {
         
            console.log("coletando e agrupando tweets do BD...")

            const tweetsBD = await Fintwit.aggregate([
                {
                    $group: {
                        _id : {
                            $dateToString: { format: "%Y-%m-%d", date: "$created_at" }
                        },
                        entry: {
                            $push: {
                                tweet_id: "$tweet_id",
                                perfil: "$perfil",
                                text: "$text",
                                hashtags: "$hashtags"
                            }
                        }
                    }
                    
                },
                {
                    $sort: {
                        _id: -1
                    }
                }
            ])
            // fs.writeFileSync("/Users/paulinelymorgan/git/fintwit/dados/tweets_230620.json", JSON.stringify(tweetsBD) , 'utf-8') 
            res.json(tweetsBD)
        } catch (err) {
            console.error(err) 

            res.status(400).json({
                msg: "ErrorCatch"
            })
        }
    },

    async intensidadeTweetsPorData(req, res) {
        try {
            
            console.log("coletando e agrupando tweets do BD...")

            // consulta para retornar quantidade de tweets por dia
            const tweetsPorDiaFINTWIT = await Fintwit.aggregate(consultas_mdb.intensidade_t_data_ordenado)

            res.json(tweetsPorDiaFINTWIT)
        } catch (err) {
            console.error(err)

            res.status(400).json({
                msg: "ErrorCatch"
            })
        }
    },

    //NAO usar até que ache uma forma de usar nlp.js:carregaOntoPT()
    async geraSentimentosSeteDia(req, res){
        try {
          
            console.log("coletando e agrupando tweets do BD...")

            const tweetsBD = await Fintwit.aggregate(consultas_mdb.t_data_limitada)

            console.log(`calculando tokens e sentimentos dos dias...`)

            for (let dia of tweetsBD) {

                let sentimentoParaODia = 0
                let tokensParaODia = new Set()

                const diaJaExiste = await SentimentosPalavras.find({
                    data: new Date(dia._id),
                })

                if (diaJaExiste.length == 0) {

                    console.log(` :: dia ${dia._id} | ${dia.entry.length} tweets para calcular...`)

                    for (let tweet of dia.entry) {

                        // apenas para salvar os tokens do dia
                        let tokens = nlp.atomizadorDeFrase(tweet.text)
                        for (let t of tokens) tokensParaODia.add(t)

                        // calcula sentimento para frase
                        let sentiDaFrase = nlp.sentimentoDaFrase(tweet.text)
                        sentimentoParaODia += sentiDaFrase != null ? sentiDaFrase : 0 
                    }

                    await SentimentosPalavras.create({
                        data: new Date(dia._id),
                        sentimento: sentimentoParaODia,
                        palavras: Array.from(tokensParaODia)
                    })

                    console.log(`  : ${dia._id} salvo!`)
                } else {
                    console.log(` :: dia ${dia._id} ja existe!`)
                }
            } // for

           res.json({"msg": "sucesso"})
        } catch (err) {
            console.error(err)

            res.status(400).json({
                msg: "ErrorCatch"
            })
        }
    },

    //NAO usar até que ache uma forma de usar nlp.js:carregaOntoPT()
    async mostraSentimentos(req, res){
        try {

            console.log(`coletando sentimentos historicos dos tweets...`)

            const sentimentosTokens = await SentimentosPalavras.aggregate(consultas_mdb.sentimento_t_data)

            res.json(sentimentosTokens)
        } catch(err){
            console.error(err)

            res.status(400).json({
                msg: "ErrorCatch"
            })
        }
    },

}