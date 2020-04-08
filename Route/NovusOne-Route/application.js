const Appli	= require('../../Controller/NovusOne-Controller/application_controller');


module.exports.application_management = (req, res, next)=>{
	const body = req.body;
	const user = req.user;

	Appli.application_management(body, user)
	.then((Data)=>{
		res.json(Data);
	}).catch((err)=>res.json({'success':false,'message':'err'}));
}

module.exports.application_list = (req, res, next)=>{
	const user = req.user;

	Appli.application_list(user)
	.then((Data)=>{
		res.json(Data);
	}).catch((err)=>res.json({'success':false,'message':'err'}));
}

module.exports.admin_delete_application = (req, res, next)=>{
	const body = req.body;
	const user = req.user;

	Appli.admin_delete_application(body, user)
	.then((Data)=>{
		res.json(Data);
	}).catch((err)=>res.json({'success':false,'message':'err'}));
}

module.exports.admin_update_app = (req, res, next)=>{
	const body = req.body;
	const user = req.user;

	Appli.admin_update_app(body, user)
	.then((Data)=>{
		res.json(Data);
	}).catch((err)=>res.json({'success':false,'message':'err'}));
}

module.exports.admin_check_user = (req, res, next)=>{
	const body = req.body;
	const user = req.user;

	Appli.admin_check_user(body, user)
	.then((Data)=>{
		res.json(Data);
	}).catch((err)=>res.json({'success':false,'message':'err'}));
}

module.exports.createUser = (req, res, next)=>{
	const body = req.body;
	const user = req.user;
	
	Appli.createUser(body, user)
	.then((Data)=>{
		res.json(Data);
	}).catch((err)=>res.json({'success':false,'message':'err'}));
}

module.exports.AppUserApprove = (req, res, next)=>{
	const body = req.body;
	const user = req.user;

	Appli.AppUserApprove(body, user)
	.then((Data)=>{
		res.json(Data);
	}).catch((err)=>res.json({'success':false,'message':'err'}));
}