const nlpService = require('./../services/nlp');

module.exports = {
    async atomizadorFrase(req, res) {
        try {
            let frasePOST = req.body.frase;

            if (frasePOST === "")
                return res.status(400).json({
                    error: "informe a 'frase'"
                });

            if (!(typeof(frasePOST) == "string"))
                return res.status(400).json({
                    error: "informe a 'frase' como um string"
                });

            console.log("atomizando frase...");

            const fraseAtomizada = nlpService.atomizadorDeFrase(frasePOST);

            res.json({ fraseAtomizada });
        } catch (err) {
            console.error(err);

            res.status(400).json({
                msg: "ErrorCatch"
            });
        }
    },

    async calcularFrequenciasParaFrases(req, res) {
        try {
            let frasesPOST = req.body.frases;
            
            if (!frasesPOST)
                return res.status(400).json({
                    error: "informe as 'frases'"
                });

            if (!Array.isArray(frasesPOST))
                return res.status(400).json({
                    error: "as 'frases' têm que estar em um formato de array"
                });

            console.log("calculando frequencias...");

            const frasesSeparadasPorQuebraDeLinha = frasesPOST.join('\n');
            const frequenciasDasFrases = nlpService.listaDeFrequenciasParaFrase(frasesSeparadasPorQuebraDeLinha);

            res.json({ frequenciasDasFrases });
        } catch (err) {
            console.error(err);

            res.status(400).json({
                msg: "ErrorCatch"
            });
        }
    }
}