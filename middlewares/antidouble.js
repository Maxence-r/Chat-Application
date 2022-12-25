const Conversation = require("../models/conversations");
const jwt = require("jsonwebtoken");

const antidouble = (req, res, next) => {
	const token = req.cookies.token;
	if (!token) return (req.logged = false), res.redirect("/");
	const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
	const userId = decodedToken.userId;
	Conversation.find({
			$and: [{
				creator: userId
			}, {
				participant: req.body.participant
			}],
		})
		.then((conversations) => {
			if (conversations != "") {
				res.status(400).json({
					error: "Conversation déjà existante !",
				});
			} else {
			next();
        }
		})
		.catch((error) => res.status(500).json({
			error
		}));
}

module.exports = antidouble;