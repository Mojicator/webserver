const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Admin = require('../models/admin');

const router = express.Router();

const saltRounds = 10;

router.get('/admin', function(req, res) {

    let since = Number(req.query.since) || 0;
    let limit = Number(req.query.limit) || 10;

    Admin.find({ state: true })
        .skip(since)
        .limit(limit)
        .exec((err, admins) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Admin.count({ state: true }, (err, actives) => {
                res.json({
                    ok: true,
                    total: actives,
                    admins
                });
            });


        });
});

router.post('/admin', function(req, res) {
    let body = req.body;

    let admin = new Admin({
        name: body.name,
        contact: {
            email: body.email,
            tel: body.tel,
            job: body.job
        },
        password: bcrypt.hashSync(body.password, saltRounds),
        role: body.role
    });

    admin.save((err, adminDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            admin: adminDB
        });
    });
});

router.put('/admin/:id', function(req, res) {
    let id = req.params.id;
    let validFields = ['name', 'img', 'role', 'tel', 'job', 'state'];
    let body = _.pick(req.body, validFields);

    Admin.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, adminDB) => {
        if (err) {
            return res.status(400).json({
                of: false,
                err
            });
        }

        res.json({
            ok: true,
            admin: adminDB
        });
    });
});

router.delete('/bye-bye-admin/:id', function(req, res) {
    let id = req.params.id;

    Admin.findByIdAndRemove(id, (err, adminDeleted) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!adminDeleted) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Admin no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            admin: adminDeleted
        });
    });
});

router.delete('/bye-admin/:id', function(req, res) {
    let id = req.params.id;

    Admin.findByIdAndUpdate(id, { state: false }, { new: true }, (err, adminOff) => {
        if (err) {
            return res, status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            admin: adminOff
        });
    });

});

module.exports = {
    router
}