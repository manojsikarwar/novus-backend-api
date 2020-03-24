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