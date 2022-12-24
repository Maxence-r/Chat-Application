const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Message = require('../models/messages');
const antiSpam = require('../middlewares/antispam');

router.post('/', (req, res) => {
    Message.find({
            convId: req.body.convId
        }).sort([
            ['_id', +1]
        ])
        .then(messages => res.status(200).json(messages))
        .catch(error => res.status(400).json({
            error
        }));
});

router.post('/post', antiSpam, (req, res) => {
    const token = req.cookies.token;
    if (!token) return req.logged = false, res.redirect('/');
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    const message = new Message({
        convId: req.body.convId,
        sender: userId,
        text: req.body.text
    });
    message.save()
        .then(() => res.status(201).json({
            message: `Message envoyé ! convId: ${req.body.convId}`
        }))
        .catch(error => res.status(500).json({
            error: error
        }));
    global.io.emit(`${req.body.convId}`, {
        message: {
            convId: req.body.convId,
            sender: userId,
            text: req.body.text
        },
    });
});

module.exports = router;