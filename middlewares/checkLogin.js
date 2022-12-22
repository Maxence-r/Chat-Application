const jwt = require('jsonwebtoken');
const User = require('../models/users');

const checkLogin = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return req.logged = false, next();
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    User.findOne({ _id: userId })
        .then(user => {
            if (!user) {
                req.logged = false;
                next();
            }
            req.logged = true;
            next();
        })
        .catch(error => res.json({ error }));
    };


module.exports = checkLogin;