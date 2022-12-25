const avatarCheck = (req, res, next) => {
    if (!req.body.avatar) next();
    const avatar = req.body.avatar;
    const avatarRegex = new RegExp(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/);
    if (!avatarRegex.test(avatar)) {
        return res.status(400).json({
            error: 'The avatar url isn\'t valid'
        });
    }
    fetch(`${req.body.avatar}`, { method: 'HEAD' })
    .then(response => {
        if (response.ok) {
            next();
        } else {
            return res.status(400).json({ error: 'This avatar cannot be reached' });
        }
    })
    .catch(error => res.status(500).json({ error }));
};

module.exports = avatarCheck;