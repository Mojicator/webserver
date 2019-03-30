const express = require('express');

const app = express();

app.use(require('./users').router);
app.use(require('./login').router);

module.exports = {
    app
}