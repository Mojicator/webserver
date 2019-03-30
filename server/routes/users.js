const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('../models/user');
const { checkToken, checkUser } = require('../middleware/authentication');

const router = express.Router();

const saltRounds = 10;

router.get('/user', [checkToken, checkUser], function(req, res) {

    let since = Number(req.query.since) || 0;
    let limit = Number(req.query.limit) || 10;

    User.find({ state: true })
        .skip(since)
        .limit(limit)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            User.countDocuments({ state: true }, (err, actives) => {
                res.json({
                    ok: true,
                    total: actives,
                    users
                });
            });


        });
});

router.post('/user', [checkToken, checkUser], function(req, res) {
    let body = req.body;

    let user = new User({
        name: body.name,
        contact: {
            email: body.email,
            tel: body.tel,
            job: body.job
        },
        password: bcrypt.hashSync(body.password, saltRounds),
        role: body.role
    });

    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: userDB
        });
    });
});

router.put('/user/:id', [checkToken, checkUser], function(req, res) {
    let id = req.params.id;
    let validFields = ['name', 'img', 'role', 'contact.tel', 'contact.job', 'state'];
    let body = _.pick(req.body, validFields);
    console.log('pasa!');
    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                of: false,
                err
            });
        }

        res.json({
            ok: true,
            user: userDB
        });
    });
});

router.delete('/bye-bye-user/:id', [checkToken, checkUser], function(req, res) {
    let id = req.params.id;

    User.findByIdAndRemove(id, (err, userDeleted) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!userDeleted) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'user no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            user: userDeleted
        });
    });
});

router.delete('/bye-user/:id', [checkToken, checkUser], function(req, res) {
    let id = req.params.id;

    User.findByIdAndUpdate(id, { state: false }, { new: true }, (err, userOff) => {
        if (err) {
            return res, status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: userOff
        });
    });

});

module.exports = {
    router
}