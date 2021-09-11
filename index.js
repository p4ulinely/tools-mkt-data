const express = require('express')
const mongoose = require('mongoose')
const requireDir = require('require-dir')
require('dotenv-safe').config()

// iniciando app
const port = process.env.PORT || 3000
const app = express()
app.use(express.json())

// //////////////////////////////////////////// BD
mongoose.connect(process.env.CONNECTION_STRING_BD, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log(`MongoDB is on!`)
}).catch(err => {
    console.log(`MongoDB: ${err}`)
})
// mongoose.set('useFindAndModify', true)
// mongoose.set('useUnifiedTopology', true)

// //////////////////////////////////////////// models
requireDir('./src/models', { recurse: true });

// //////////////////////////////////////////// rotas 
const versao1 = "v1";

app.get('/', (req, res) => { res.json({ api: "meus-trends-v1" }) });

app.use(`/${versao1}/nlp`, require('./src/routes/NlpRoutes'));
app.use(`/${versao1}/indfut`, require('./src/routes/IndfutRoutes'));
app.use(`/${versao1}/twitter`, require('./src/routes/TwitterRoutes'));
app.use(`/${versao1}/dolfut`, require('./src/routes/DolfutRoutes'));
app.use(`/${versao1}/gtrends`, require('./src/routes/GoogleTrendsRoutes'));

// //////////////////////////////////////////// porta 
app.listen(port, () => {
    console.log(`On PORT ${port}!`)
});
