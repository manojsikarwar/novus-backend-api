const User 	= require('../../Controller/NovusOne-Controller/user_controller');


module.exports.signup = (req, res, next)=>{
	const body = req.body;

	User.signup(body)
	.then((Data)=>{
		res.json(Data);
	}).catch((err)=>res.json({'success':false,'message':'err'}));
}

module.exports.login = (req, res, next)=>{
	const body = req.body;
	
	User.login(body)
	.then((Data)=>{
		res.json(Data);
	}).catch((err)=>res.json({'success':false,'message':'err'}));
}

module.exports.superlogin = (req, res, next)=>{
	const email = req.body.email;
	const password = req.body.password 
	
	User.superlogin(email,password)
	.then((Data)=>{
		res.json(Data);
	}).catch((err)=>res.json({'success':false,'message':'err'}));
}

module.exports.user_profile = (req, res, next)=>{
	const user = req.user;

	User.user_profile(user)
	.then((Data)=>{
		res.json(Data);
	}).catch((err)=>res.json({'success':false,'message':'err'}));
}

module.exports.user_update_profile = (req, res, next)=>{
	const user = req.user;
	const body = req.body;

	User.user_update_profile(user,body)
	.then((Data)=>{
		res.json(Data);
	}).catch((err)=>res.json({'success':false,'message':'err'}));
}

module.exports.user_change_password = (req, res, next)=>{
	const user = req.user;
	const body = req.body;

	User.user_change_password(user,body)
	.then((Data)=>{
		res.json(Data);
	}).catch((err)=>res.json({'success':false,'message':'err'}));
}

module.exports.user_forget_password = (req, res, next)=>{
	const user = req.user;
	const body = req.body;

	User.user_forget_password(user,body)
	.then((Data)=>{
		res.json(Data);
	}).catch((err)=>res.json({'success':false,'message':'err'}));
}


module.exports.ValidateUser = (req, res, next)=>{
	const body = req.body;	
	
	User.ValidateUser(body)
	.then((Data)=>{
		res.json(Data);
	}).catch((err)=>res.json({'success':false,'message':'err'}));
}
