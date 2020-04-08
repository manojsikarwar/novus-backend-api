const AdminController 	= require('../../Controller/NovusOne-Controller/admin_controller');


module.exports.adminlogin = (req, res, next)=>{
	const body = req.body;
	AdminController.adminlogin(body)
	.then((Data)=>{
		res.json(Data);
	}).catch((err)=>res.json({'success':false,'message':'err'}));
}

