const express = require('express');
const bodyParser = require('body-parser');
require('./config/config');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use('/', require('./routes/api').router);

// error handling middleware
app.use((err, req, res, next) => {
    res.send({ error: err.message });
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando peticiones');
});