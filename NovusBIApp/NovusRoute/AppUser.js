const AppUser = require('../NovusController/ControllerAppUser');


module.exports.NovusUser = (req, res, next) => {
	const body = req.body;

	AppUser.NovusUser(body).then((data)=>{
		res.json(data);
	})
}

module.exports.appuser_login = (req, res, next) => {
	const body = req.body;
	
	AppUser.appuser_login(body).then((data)=>{
		res.json(data);
	})
}

module.exports.articles_list = (req, res, next) => {
	const info = req.body;
	const user = req.user;
	
	AppUser.articles_list(user,info).then((data)=>{
		res.json(data);
	})
}