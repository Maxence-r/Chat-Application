const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/users');
const avatarCheck = require('../middlewares/avatarCheck');

router.get('/', (req, res) => {
    res.render('../views/signup.ejs');
});

router.post('/', avatarCheck, (req, res, next) => {
    if ((req.body.pseudo.length > 40) || (req.body.password.length < 2)) return res.status(400).json({
        error: 'Mots passe trop court pseudo trop long ou informations non suffisantes!'
    });
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                pseudo: req.body.pseudo,
                email: req.body.email,
                password: hash,
                avatar: req.body.avatar || 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg'
            });
            user.save()
                .then(() => res.status(201).json({
                    message: 'Utilisateur créé !'
                }))
                .catch(error => res.status(500).json({
                    error: error
                }));
        });
});


module.exports = router;