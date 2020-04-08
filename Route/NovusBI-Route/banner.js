const Banner = require('../../Controller/NovusBI-Controller/banner');

module.exports.createBanner = (req, res ,next) => {
	const body = req.body;
	const user = req.user;
	Banner.createBanner(user, body)
	.then((Data) => {
		res.json(Data)
	}).catch((err) => next(err))
}

module.exports.banner_list = (req, res, next) => {
	const user = req.user;
	Banner.banner_list(user)
	.then((Data) => {
		res.json(Data)
	}).catch((err) => next(err))
}

module.exports.updateBanner = (req, res, next) => {
	const user = req.user;
	const body = req.body;
	Banner.updateBanner(user, body)
	.then((Data) => {
		res.json(Data)
	}).catch((err) => next(err)) 
}

module.exports.deleteBanner = (req, res, next) => {
	const user = req.user;
	const body = req.body;
	Banner.deleteBanner(user, body)
	.then((Data) => {
		res.json(Data)
	}).catch((err) => next(err)) 
}
