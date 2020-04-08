const List	= require('../../Controller/NovusOne-Controller/list_controller');


module.exports.country_list = (req, res, next)=>{
	// const user = req.user;

	List.country_list()
	.then((Data)=>{
		res.json(Data);
	}).catch((err)=>res.json({'success':false,'message':'err'}));
}

module.exports.state_list = (req, res, next)=>{
	const body = req.body;

	List.state_list(body)
	.then((Data)=>{
		res.json(Data);
	}).catch((err)=>res.json({'success':false,'message':'err'}));
}

module.exports.city_list = (req, res, next)=>{
	const body = req.body;

	List.city_list(body)
	.then((Data)=>{
		res.json(Data);
	}).catch((err)=>res.json({'success':false,'message':'err'}));
}
