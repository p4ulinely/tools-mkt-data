const express = require('express')
const mongoose = require('mongoose')
const requireDir = require('require-dir')
require('dotenv-safe').config()

// iniciando app
const port = process.env.PORT || 8000
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
requireDir('./src/models')

// //////////////////////////////////////////// rotas 
app.use('/nlp', require('./src/routes/NlpRoutes'));
app.use('/indfut', require('./src/routes/IndfutRoutes'));
app.use('/twitter', require('./src/routes/TwitterRoutes'));

app.listen(port, () => {
    console.log(`On PORT ${port}!`)
})