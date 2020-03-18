const Contants = require('../Controller/contants');

module.exports.createContant = (req, res ,next) => {
	const body = req.body;
	const user = req.user;
	Contants.createContant(user, body)
	.then((Data) => {
		res.json(Data)
	}).catch((err) => next(err))
}

module.exports.contants = (req, res, next) => {
	const user = req.user;
	const info = req.body;
	Contants.contants(user, info)
	.then((Data) => {
		res.json(Data)
	}).catch((err) => next(err))
}

module.exports.updateContant = (req, res, next) => {
	const user = req.user;
	const body = req.body;
	Contants.updateContant(user, body)
	.then((Data) => {
		res.json(Data)
	}).catch((err) => next(err)) 
}

module.exports.deleteContant = (req, res, next) => {
	const user = req.user;
	const body = req.body;
	Contants.deleteContant(user, body)
	.then((Data) => {
		res.json(Data)
	}).catch((err) => next(err)) 
}
