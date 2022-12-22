const Message = require('../models/messages');
const jwt = require('jsonwebtoken');
const antiSpam = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return req.logged = false, res.redirect('/');
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    Message
        .find({
            sender: userId
        }).sort([
            ['_id', -1]
        ]).limit(1)
        .then(messages => {
            if (messages.length > 0) {
                const lastMessage = messages[messages.length - 1];
                const now = new Date();
                const lastMessageDate = new Date(lastMessage.createdAt);
                const diff = now - lastMessageDate;
                if (diff < 200) {
                    return res.status(500).json({
                        error: 'Vous avez envoyé un message trop récemment !'
                    });
                }
            }
            next();
        })
        .catch(error => res.status(500).json({
            error
        }));
};
module.exports = antiSpam;