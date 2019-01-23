const express = require('express');
const router = express.Router();

router.get('/user', function(req, res) {
    res.json('Hello World');
})

router.post('/user', function(req, res) {
    let body = req.body;
    res.json({
        user: body
    });
})

router.put('/user/:id', function(req, res) {
    let id = req.params.id;
    res.json({
        id
    });
})

router.delete('/', function(req, res) {
    res.json('Hello World');
})

module.exports = {
    router
}