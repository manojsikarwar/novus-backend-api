const Region = require('../../Controller/NovusBI-Controller/region_controller');

module.exports.region = (req, res, next) => {
	const user = req.user;
	const body = req.body;

	Region.region(user,body)
	.then((result) => {
		res.json(result)
	}).catch((err)=>res.json({'success':false,'message':'err'}));
}