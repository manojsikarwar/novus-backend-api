const Comments = require('../../Controller/NovusBI-Controller/comments');

module.exports.createComment = (req, res ,next) => {
	const body = req.body;
	const user = req.user;
	Comments.createComment(user, body)
	.then((Data) => {
		res.json(Data)
	}).catch((err) => next(err))
}

module.exports.comments = (req, res, next) => {
	const user = req.user;
	const contantId = req.body.contant_id;
	Comments.comments(user, contantId)
	.then((Data) => {
		res.json(Data)
	}).catch((err) => next(err))
}

module.exports.updateComment = (req, res, next) => {
	const user = req.user;
	const body = req.body;
	Comments.updateComment(user, body)
	.then((Data) => {
		res.json(Data)
	}).catch((err) => next(err)) 
}

module.exports.deleteComment = (req, res, next) => {
	const user = req.user;
	const body = req.body;
	Comments.deleteComment(user, body)
	.then((Data) => {
		res.json(Data)
	}).catch((err) => next(err)) 
}
