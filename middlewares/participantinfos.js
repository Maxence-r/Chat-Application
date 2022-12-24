const User = require('../models/users');

const participantinfos = (req, res, next) => {
    if (!req.body.participantname) return res.status(400).json({ error: 'Informations are missing' });
    User.findOne({ pseudo: req.body.participantname })
    .then(user => {
        if (!user) {
            return res.status(400).json({ error: 'This participant doesn\'t exist' });
        }
        req.body.participant = user._id;
        req.body.participantavatar = user.avatar || 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg';
        next();
    })
    .catch(error => res.status(500).json({ error }));
};

module.exports = participantinfos;