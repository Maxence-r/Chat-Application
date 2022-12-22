const express = require('express');
const router = express.Router();
const Conversation = require('../models/conversations');
const jwt = require('jsonwebtoken');
const antidouble = require('../middlewares/antidouble');

router.post('/', antidouble, (req, res) => {
	const token = req.cookies.token;
	if (!token) return req.logged = false, res.redirect('/');
	const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
	const userId = decodedToken.userId;
	const name = decodedToken.username;
	const avatar = decodedToken.avatar;
	const conversation = new Conversation({
		creator: {
			id: userId,
			name: name,
			avatar: avatar,
		},
		participant: {
			id: req.body.id,
			name: req.body.name,
			avatar: req.body.avatar,
		}, 
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