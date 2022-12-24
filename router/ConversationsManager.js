const express = require('express');
const router = express.Router();
const Conversation = require('../models/conversations');
const jwt = require('jsonwebtoken');
const antidouble = require('../middlewares/antidouble');
const participantinfos = require('../middlewares/participantinfos');

router.post('/', participantinfos, antidouble, (req, res) => {
	const token = req.cookies.token;
	if (!token) return req.logged = false, res.redirect('/');
	const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
	const userId = decodedToken.userId;
	const name = decodedToken.username;
	const avatar = decodedToken.avatar;
	const conversation = new Conversation({
		creator: userId,
        creatorname: name,
		creatoravatar: avatar || 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg',
		participant: req.body.participant,
        participantname: req.body.participantname, 
		participantavatar: req.body.participantavatar
	});
	conversation.save()
		.then(() => res.status(201).json({
			message: 'Conversation créée !'
		}))
		.catch(error => res.status(500).json({
			error
		}));
});

router.get('/', (req, res) => {
	const token = req.cookies.token;
	if (!token) return req.logged = false, res.redirect('/');
	const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
	const userId = decodedToken.userId;
	Conversation.find({
			$or: [{
				creator: userId
			}, {
				participant: userId
			}]
		}).sort([
			['_id', -1]
		])
		.then(conversations => res.json(conversations))
		.catch(error => res.status(400).json({
			error
		}));
});

module.exports = router;