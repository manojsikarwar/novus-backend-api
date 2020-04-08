const Super = require('../../Controller/NovusOne-Controller/superadmin_controller');


module.exports.user_list = (req, res, next)=>{
	const body = req.body;
	const user = req.user;

	Super.user_list(body, user)
	.then((Data)=>{
		res.json(Data);
	}).catch((err)=>res.json({'success':false,'message':'err'}));
}

module.exports.user_approve = (req, res, next)=>{
	const body = req.body;
	const user = req.user;

	Super.user_approve(body, user)
	.then((Data)=>{
		res.json(Data);
	}).catch((err)=>res.json({'success':false,'message':'err'}));
}

module.exports.user_disapprove = (req, res, next)=>{
	const body = req.body;
	const user = req.user;

	Super.user_disapprove(body, user)
	.then((Data)=>{
		res.json(Data);
	}).catch((err)=>res.json({'success':false,'message':'err'}));
}

module.exports.super_update_profile = (req, res, next)=>{
	const user = req.user;
	const body = req.body;

	Super.super_update_profile(user,body)
	.then((Data)=>{
		res.json(Data);
	}).catch((err)=>res.json({'success':false,'message':'err'}));
}

module.exports.super_forget_password = (req, res, next)=>{
	const email = req.body.email;

	Super.super_forget_password(email)
	.then((Data)=>{
		res.json(Data);
	}).catch((err)=>res.json({'success':false,'message':'err'}));
}

module.exports.sendResetPasswordLink = (req, res, next)=>{
	const email = req.body.email;

	Super.sendResetPasswordLink(email)
	.then((Data)=>{
		res.json(Data);
	}).catch((err)=>res.json({'success':false,'message':'err'}));
}

module.exports.resetpassword = (req, res, next)=>{
	const reset_token = req.params.token;
	const password = req.body.new_password;

	Super.resetpassword(reset_token, password)
	.then((Data)=>{
		res.json(Data);
	}).catch((err)=>res.json({'success':false,'message':'err'}));
}

module.exports.admin_update_userProfile = (req, res, next)=>{
	const body = req.body;
	const user = req.user;

	Super.admin_update_userProfile(body, user)
	.then((Data)=>{
		res.json(Data);
	}).catch((err)=>res.json({'success':false,'message':'err'}));
}

module.exports.admin_delete_user = (req, res, next)=>{
	const body = req.body;
	const user = req.user;

	Super.admin_delete_user(body, user)
	.then((Data)=>{
		res.json(Data);
	}).catch((err)=>res.json({'success':false,'message':'err'}));
}

module.exports.admin_search_user = (req, res, next)=>{
	const body = req.body;
	const user = req.user;

	Super.admin_search_user(body, user)
	.then((Data)=>{
		res.json(Data);
	}).catch((err)=>res.json({'success':false,'message':'err'}));
}

module.exports.send_notification = (req, res, next)=>{
	const body = req.body;
	const user = req.user;

	Super.send_notification(body, user)
	.then((Data)=>{
		res.json(Data);
	}).catch((err)=>res.json({'success':false,'message':'err'}));
}

module.exports.createAdmin = (req, res, next)=>{
	const body = req.body;
	const user = req.user;
	console.log(body)
	console.log(user)
	Super.createAdmin(body, user)
	.then((Data)=>{
		res.json(Data);
	}).catch((err)=>res.json({'success':false,'message':'err'}));
}

module.exports.adminlist = (req, res, next)=>{
         console.log(req.body)
	const body = req.body;
	const user = req.user;

	Super.adminlist(body, user)
	.then((Data)=>{
		res.json(Data);
	}).catch((err)=>res.json({'success':false,'message':'err'}));
}

module.exports.adminApproveAndDisapprove = (req, res, next)=>{
	const body = req.body;
	const user = req.user;

	Super.adminApproveAndDisapprove(body, user)
	.then((Data)=>{
		res.json(Data);
	}).catch((err)=>res.json({'success':false,'message':'err'}));
}

module.exports.deleteAdmin = (req, res, next)=>{
	const body = req.body;
	const user = req.user;

	Super.deleteAdmin(body, user)
	.then((Data)=>{
		res.json(Data);
	}).catch((err)=>res.json({'success':false,'message':'err'}));
}