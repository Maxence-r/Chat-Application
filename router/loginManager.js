const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/users');
const jwt = require('jsonwebtoken');

router.post('/', (req, res) => {
    console.log(req.body);
    User.findOne({
        $or: [{
            pseudo: req.body.email
        }, {
            email: req.body.email
        }]
    })
        .then(user => {
            if (!user) {
                console.log('User not found');
                return res.status(401).json({
                    error: 'Utilisateur non trouvé !'
                });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(400).json({
                            error: 'Mot de passe incorrect !'
                        });
                    }
                    const token = jwt.sign({
                            userId: user._id,
                            username: user.pseudo,
                            avatar: user.avatar || null
                        },
                        'RANDOM_TOKEN_SECRET', {
                            expiresIn: '24h'
                        }
                    )
                    res.cookie('token', token).status(200).json({
                        message: 'Connexion réussie !'
                    });
                })
                .catch(error => res.status(500).json({
                    error
                }));
        })
        .catch(error => res.status(500).json({
            error
        }));
});


router.get('/logout', (req, res) => {
    res.clearCookie('token').redirect('/');
});



module.exports = router;