const express = require('express');
const router = express.Router();
const User = require('../models/users');
const jwt = require('jsonwebtoken');
const app = require('../app');

router.get('/', (req, res) => {
    const token = req.cookies.token;
    if (!token) return req.logged = false, res.redirect('/');
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    User.findOne({
            _id: userId
        })
        .then(user => {
            if (!user) {
                req.logged = false;
            }
            res.json({
                pseudo: user.pseudo,
                id: user._id,
                email: user.email,
                avatar: user.avatar
            });
        })
        .catch(error => res.json({
            error
        }));
});

/* Inutile car ajout par pseudo prochainement */
router.get('/users', (req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(error => res.json({
            error
        }));
});


module.exports = router;