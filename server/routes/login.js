const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.CLIENT_ID);

const router = express.Router();

router.post('/login', (req, res) => {

    let body = req.body;

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
                    message: 'Email or password is incorrect. Please, check it.'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Email or password is incorrect. Please, check it.'
                }
            });
        }

        let token = jwt.sign({
            user: userDB
        }, process.env.SEED, { expiresIn: process.env.EXPIRATION_TOKEN });

        res.json({
            ok: true,
            user: userDB,
            token
        });
    });

});

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //const userid = payload['sub'];

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

router.post('/google', async(req, res) => {
    let token = req.body.idtoken;

    let googleUser = '';

    try {
        googleUser = await verify(token);
    } catch (err) {
        return res.status(403).json({
            ok: false,
            err: {
                message: 'Token in not valid'
            }
        });
    }
    User.findOne({ 'contact.email': googleUser.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (userDB) {
            if (userDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe usar su autenticacion normal'
                    }
                });
            } else {
                let token = jwt.sign({
                    user: userDB
                }, process.env.SEED, { expiresIn: process.env.EXPIRATION_TOKEN });

                return res.json({
                    ok: true,
                    user: userDB,
                    token
                });
            }
        } else {
            //si el usuario no existe
            let new_user = new User({
                name: googleUser.name,
                img: googleUser.img,
                password: '=)',
                contact: {
                    email: googleUser.email,
                    google: true
                }
            });

            new_user.save((err, userDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    user: userDB
                }, process.env.SEED, { expiresIn: process.env.EXPIRATION_TOKEN });

                return res.json({
                    ok: true,
                    user: userDB,
                    token
                });
            });
        }
    });
});

module.exports = {
    router
}