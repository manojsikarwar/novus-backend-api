const Categories = require('../../Controller/NovusBI-Controller/category');

module.exports.createCategories = (req, res ,next) => {
	const body = req.body;
	const user = req.user;
	Categories.createCategories(user, body)
	.then((Data) => {
		res.json(Data)
	}).catch((err) => next(err))
}

module.exports.Categories = (req, res, next) => {
	const user = req.user;
	Categories.Categories(user)
	.then((Data) => {
		res.json(Data)
	}).catch((err) => next(err))
}

module.exports.Categories_list = (req, res, next) => {
	const user = req.user;
	Categories.Categories_list(user)
	.then((Data) => {
		res.json(Data)
	}).catch((err) => next(err))
}

module.exports.updateCategories = (req, res, next) => {
	const user = req.user;
	const body = req.body;
	Categories.updateCategories(user, body)
	.then((Data) => {
		res.json(Data)
	}).catch((err) => next(err)) 
}

module.exports.deleteCategories = (req, res, next) => {
	const user = req.user;
	const body = req.body;
	Categories.deleteCategories(user, body)
	.then((Data) => {
		res.json(Data)
	}).catch((err) => next(err)) 
}
