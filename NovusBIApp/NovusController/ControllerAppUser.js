const client 		= require('../../db');
const bcrypt 		= require('bcrypt');
const jwt			= require('jsonwebtoken');
const moment 		= require('moment');
const date   		= new Date();
const myDate 		= moment(date).format('L');
const redis 		= require('redis');
const redisClient 	= redis.createClient(6379, 'localhost');
const message 		= require('../../Helpers/message');
const serverKey		= require('../../Helpers/serverKey');
const generator 	= require('generate-password');
const FCM 			= require('fcm-node');
const KEY 			= serverKey.KEY;


module.exports.NovusUser = (body) => {
	return new Promise((resolve, reject) => {
		try{
			const username = body.username;
			const status  = 1;
			const app_user = body.create_user;

			// const appUser =  JSON.stringify(app_user);

			const checkuser = `select * from novus_app_user where username = '${username}' `;
			client.query(checkuser, (checkusererr, checkuserress) => {
				// resolve(checkuser)
				if(checkusererr){
					resolve(message.SOMETHINGWRONG);
				}else{
					if(checkuserress.rows != ''){
						resolve(message.ALREADYEXISTS)
					}else{
						const insertuser = `insert into novus_app_user(username,status) values('${username}','${status}') RETURNING userID`
						client.query(insertuser, (insertusererr, insertuserress) => {
							if(insertusererr){
								resolve(message.SOMETHINGWRONG);
							}else{
								// resolve(message.CREATED);
								const userID = insertuserress.rows[0].userid
								// resolve(userID)
								let redata = {
	                        		userID 		: userID,
									username 	: username,
									status 		: status
								}

								if (app_user.length > 0) {
									redisClient.hmset('NovusUserApp', username, JSON.stringify(redata), function (err, data) {
									    if(err){
									    	resolve(message.SOMETHINGWRONG);
									    }else{
									    	if(data == 'OK'){
										    	// resolve(message.REGISTRATION);
										    	// sendEmailToSignup(email, company, fullname);
									    		for(let appData of app_user){
									    			
									    			const sqlApp = `insert into app_user(application_id,user_name,user_id,status) values('${appData.application_id}','${appData.user_name}','${userID}','${0}')RETURNING app_id`;
													// resolve(sqlApp)
													client.query(sqlApp, (err1, res1) => {
														if (err1) {
															resolve(message.SOMETHINGWRONG);
														}else{
															const AppRedis = {
																application_id : appData.application_id,
																user_name	   : appData.user_name,
																user_id		   : userID,
																app_id    	   : res1.rows[0].app_id,
																status 			: 0
															}
															//console.log(AppRedis)

															redisClient.hmset('app_user', appData.user_name, JSON.stringify(AppRedis), function (err1, data1) {
															    if(err1){
															    	resolve(message.SOMETHINGWRONG);
															    }else{
															    	if(data1 == 'OK'){
																    	resolve(message.REGISTRATION);
																    	//sendEmailToSignup(email, company, fullname);
															    	}else{
																    	resolve(message.SOMETHINGWRONG);
															    	}
															    }
															})
														}
													})
									    		}
									    	}else{
										    	resolve(message.SOMETHINGWRONG);
									    	}
									    }
									})
								}else{												
									redisClient.hmset('user', email, JSON.stringify(redata), function (err, data) {
									    if(err){
									    	resolve(message.SOMETHINGWRONG);
									    }else{
									    	if(data == 'OK'){
										    	resolve(message.REGISTRATION);
										    	// sendEmailToSignup(email, company, fullname);
									    	}else{
										    	resolve(message.SOMETHINGWRONG);
									    	}
									    }
									})

								}
							}
						})
					}
				}
			})
		}catch(error){
			resolve(error);
		}
	})
}

module.exports.appuser_login = (body) => {
	return new Promise((resolve,reject) => {
		try{
			const username = body.username;
			if(username != ''){
				const getuser = `select * from novus_app_user where username = '${username}' `
				client.query(getuser, (getusererr, getuserress) => {
					if(getusererr){
						resolve(message.SOMETHINGWRONG)
					}else{
						// resolve(getuserress.rows)?
						if(getuserress.rows != ''){
							var token = jwt.sign({
                                id: getuserress.rows[0].userid,
                                username: getuserress.rows[0].username,
                                status:getuserress.rows[0].status,
                                role_id : getuserress.rows[0].role_id
                            }, 'secret', {
	                                expiresIn: "12hr"
	                            });
							const successmessage = {
								'status':true,
								'username':getuserress.rows[0].username,
								'token':token
							}
							resolve(successmessage)
						}else{
							resolve(message.DATANOTFOUND);
						}
					}
				})
			}else{
				resolve(message.FILEDS);
			}
		}catch(error){
			resolve(error)
		}
	})
}