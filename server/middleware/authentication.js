const jwt = require('jsonwebtoken');

let checkToken = (req, res, next) => {
    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.user = decoded.user;
        next();

    });
};

let checkUser = (req, res, next) => {
    let type = req.get('Type');
    let user = req.user;

    switch (type) {
        case 'read':
            next();
            break;
        case 'write':
            if (user.role === 'USER_ROLE') {
                res.json({
                    ok: false,
                    err: {
                        message: 'Insufficient permissions'
                    }
                });
            } else {
                next();
            }
            break;
        case 'delete':
            if (user.role === 'USER_ROLE' || user.role === 'ADMIN_ROLE') {
                res.json({
                    ok: false,
                    err: {
                        message: 'Insufficient permissions'
                    }
                });
            } else {
                next();
            }
            break;
        default:
            res.json({
                ok: false,
                err: {
                    message: 'Hands up cowboy!'
                }
            });
            break;
    }
}

module.exports = {
    checkToken,
    checkUser
}