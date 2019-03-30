const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

router.post('/login', (req, res) => {

    let body = req.body;
    //console.log({ contact: { email: body.email } });
    User.findOne({ "contact.email": body.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Email) or password is incorrect. Please, check it.'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Email or (password) is incorrect. Please, check it.'
                }
            });
        }

        token = jwt.sign({
            user: userDB
        }, process.env.SEED, { expiresIn: process.env.EXPIRATION_TOKEN });

        res.json({
            ok: true,
            user: userDB,
            token
        });
    });

});

module.exports = {
    router
}