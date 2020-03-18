const Banner = require('../Controller/banner');

module.exports.createBanner = (req, res ,next) => {
	const body = req.body;
	const user = req.user;
	Banner.createBanner(user, body)
	.then((Data) => {
		res.json(Data)
	}).catch((err) => next(err))
}

module.exports.Banners = (req, res, next) => {
	const user = req.user;
	Banner.Banners(user)
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
