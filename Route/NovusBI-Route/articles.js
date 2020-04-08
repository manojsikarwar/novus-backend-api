const Articles = require('../../Controller/NovusBI-Controller/articles');

module.exports.createArticle = (req, res ,next) => {
	const body = req.body;
	const user = req.user;
	Articles.createArticle(user, body)
	.then((Data) => {
		res.json(Data)
	}).catch((err) => next(err))
}

module.exports.Articles = (req, res, next) => {
	const user = req.user;
	const subcatId = req.body.subcat_id;
	Articles.Articles(user, subcatId)
	.then((Data) => {
		res.json(Data)
	}).catch((err) => next(err))
}

module.exports.updateArticles = (req, res, next) => {
	const user = req.user;
	const body = req.body;
	Articles.updateArticles(user, body)
	.then((Data) => {
		res.json(Data)
	}).catch((err) => next(err)) 
}

module.exports.deleteArticle = (req, res, next) => {
	const user = req.user;
	const body = req.body;
	Articles.deleteArticle(user, body)
	.then((Data) => {
		res.json(Data)
	}).catch((err) => next(err)) 
}


