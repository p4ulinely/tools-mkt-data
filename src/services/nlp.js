const stopwords = require('./stop_words_pt');
const { listaCaracteresProibidos } = require('./caracteres_proibidos');

// metodo para verificar se string é URL ou não
const eUmaURL = str => {
    let eRegular = new RegExp(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi);

    return str.match(eRegular) ? true : false;
}

// metodo para atomizador frases em palavras e suas respectivas frequencias
const atomizadorDeFrase = frase => {
    let palavrasAtomizadas = [];
    
    frase = frase.split(' ');

    for(let i = 0; i < frase.length; i++){
        let palavra = frase[i].toLowerCase();
      
        if(!isNaN(parseInt(palavra))) continue; // elimina numeros
        if(palavra.length < 2) continue; // elimina letras
        if(eUmaURL(palavra)) continue; // elimina urls
        // if(palavra.indexOf('@') != -1) continue; // elimina mencoes
        // if(stopwords.eUmaStopWord(palavra)) continue; // elimina stopwords

        // elimina caracteres proibidos
        let charsFiltrados = palavra.split('').filter(char => ( 
            !listaCaracteresProibidos.includes(char)
        ));
        let palavraFiltrada = charsFiltrados.join('');

        if(palavraFiltrada.length < 2) continue; // elimina letras remanescentes (ex. antes de eliminar chars proibidos: e+)

        if(palavraFiltrada != "") palavrasAtomizadas.push(palavraFiltrada);
    }

    return palavrasAtomizadas;
};

module.exports = {
    atomizadorDeFrase,

    listaDeFrequenciasParaFrase (frase) {
        const listaTokens = [];
        const listaTokensUnicos = new Set();
        const tokensUnicosFrequencia = {};
    
        let linhas = frase.split('\n');
    
        for(let linha of linhas){
            let tokens = atomizadorDeFrase(linha);
    
            for(let t of tokens){
                listaTokens.push(t);
                listaTokensUnicos.add(t);  
            }
        }
    
        for(let token of listaTokensUnicos){
            let qnt = listaTokens.filter(t => t == token).length;
    
            tokensUnicosFrequencia[token] = qnt;
        }
    
        return tokensUnicosFrequencia;
    },

};
