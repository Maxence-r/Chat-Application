const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/users');
const avatarCheck = require('../middlewares/avatarCheck');
const conversation = require('../models/conversations');
const message = require('../models/messages');
const jwt = require('jsonwebtoken');
const Conversation = require('../models/conversations');

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

router.delete('/', (req, res) => {
    const token = req.cookies.token;
	if (!token) return req.logged = false, res.redirect('/');
	const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
	const userId = decodedToken.userId;
    Conversation.deleteMany({
        $or: [{
            creator: userId
        }, {
            participant: userId
        }]
    })
    .then(() => {
        message.deleteMany({
            sender: userId
        })
        .then(() => {
            User.deleteOne({
                _id: userId
            })
            .then(() => res.status(200).json({
                message: 'Utilisateur supprimé !'
            }))
            
        })
    })
    .catch(error => res.status(400).json({
        error
    }));
});

module.exports = router;