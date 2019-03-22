const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('./config/config');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// api rest
app.use('/', require('./routes/api').router);

// error handling middleware
app.use((err, req, res, next) => {
    res.send({ error: err.message });
});

// connection mongoDB
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true }, (err, req) => {
    if (err) throw err;
    console.log('Base de datos online');
});

// web server
app.listen(process.env.PORT, () => {
    console.log('Escuchando peticiones');
});