const News = require('../../Controller/NovusBI-Controller/news');

module.exports.createNews = (req, res ,next) => {
	const body = req.body;
	const user = req.user;
	News.createNews(user, body)
	.then((Data) => {
		res.json(Data)
	}).catch((err) => next(err))
}

module.exports.getNews = (req, res, next) => {
	const user = req.user;
	const subcatId = req.body.subcat_id;
	News.getNews(user, subcatId)
	.then((Data) => {
		res.json(Data)
	}).catch((err) => next(err))
}

// module.exports.updateSubCategories = (req, res, next) => {
// 	const user = req.user;
// 	const body = req.body;
// 	Subcategories.updateSubCategories(user, body)
// 	.then((Data) => {
// 		res.json(Data)
// 	}).catch((err) => next(err)) 
// }

module.exports.deleteNews = (req, res, next) => {
	const user = req.user;
	const body = req.body;
	News.deleteNews(user, body)
	.then((Data) => {
		res.json(Data)
	}).catch((err) => next(err)) 
}
