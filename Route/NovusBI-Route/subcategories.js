const Subcategories = require('../../Controller/NovusBI-Controller/subcategories');

// module.exports.createSubCategories = (req, res ,next) => {
// 	const body = req.body;
// 	const user = req.user;
// 	// console.log(body)
// 	Subcategories.createSubCategories(user, body)
// 	.then((Data) => {
// 		res.json(Data)
// 	}).catch((err) => next(err))
// }

module.exports.SubCategories = (req, res, next) => {
	const user = req.user;
	const catId = req.body.cat_id;
	Subcategories.SubCategories(user, catId)
	.then((Data) => {
		res.json(Data)
	}).catch((err) => next(err))
}

module.exports.updateSubCategories = (req, res, next) => {
	const user = req.user;
	const body = req.body;
	Subcategories.updateSubCategories(user, body)
	.then((Data) => {
		res.json(Data)
	}).catch((err) => next(err)) 
}

// module.exports.deleteSubCategories = (req, res, next) => {
// 	const user = req.user;
// 	const body = req.body;
// 	Subcategories.deleteSubCategories(user, body)
// 	.then((Data) => {
// 		res.json(Data)
// 	}).catch((err) => next(err)) 
// }
