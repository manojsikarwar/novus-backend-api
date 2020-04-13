const Region = require('../../Controller/NovusBI-Controller/region_controller');

module.exports.region = (req, res, next) => {
	// const user = req.user;
	const body = req.body;

	Region.region(body)
	.then((result) => {
		res.json(result)
	}).catch((err)=>res.json({'success':false,'message':'err'}));
}

module.exports.regionList = (req, res, next) => {

	Region.regionList()
	.then((result) => {
		res.json(result)
	}).catch((err)=>res.json({'success':false,'message':'err'}));
}

module.exports.deleteRegion = (req, res, next) => {
	const info = req.body;

	Region.deleteRegion(info)
	.then((result) => {
		res.json(result)
	}).catch((err)=>res.json({'success':false,'message':'err'}));
}

module.exports.updateRegion = (req, res, next) => {
	const info = req.body;

	Region.updateRegion(info)
	.then((result) => {
		res.json(result)
	}).catch((err)=>res.json({'success':false,'message':'err'}));
}