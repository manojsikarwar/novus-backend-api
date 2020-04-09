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

			const checkuser = `select * from novus_app_user where username = '${username}' `;
			client.query(checkuser, (checkusererr, checkuserress) => {
				if(checkusererr){
					resolve(message.SOMETHINGWRONG);
				}else{
					if(checkuserress.rows != ''){
						resolve(message.ALREADYEXISTS)
					}else{
						const insertuser = `insert into novus_app_user(username,status,role_id) values('${username}','${status}','${4}') RETURNING userID`
						client.query(insertuser, (insertusererr, insertuserress) => {
							if(insertusererr){
								resolve(message.SOMETHINGWRONG);
							}else{
								const userID = insertuserress.rows[0].userid
								let redata = {
	                        		userID 		: userID,
									username 	: username,
									status 		: status,
									role_id 	: 4
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
									    			
									    			const sqlApp = `insert into app_user(application_id,user_name,user_id,status,role_id) values('${appData.application_id}','${appData.user_name}','${userID}','${0}','${role_id}')RETURNING app_id`;
													client.query(sqlApp, (err1, res1) => {
														if (err1) {
															resolve(message.SOMETHINGWRONG);
														}else{
															const AppRedis = {
																application_id : appData.application_id,
																user_name	   : appData.user_name,
																user_id		   : userID,
																app_id    	   : res1.rows[0].app_id,
																status 		   : 0,
																role_id 	   : role_id
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
			const ApplicationId = body.ApplicationId;
			if(username != ''){
				const getuser = `select * from app_user where user_name = '${username}' and application_id = '${ApplicationId}' `
				client.query(getuser, (getusererr, getuserress) => {
					if(getusererr){
						resolve(message.SOMETHINGWRONG)
					}else{
						if(getuserress.rows != ''){
							if(getuserress.rows[0].status == 0){
								var token = jwt.sign({
	                                id: getuserress.rows[0].user_id,
	                                username: getuserress.rows[0].user_name,
	                                status:getuserress.rows[0].status,
	                                role_id : getuserress.rows[0].role_id,
	                                application_id : getuserress.rows[0].application_id,
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
								resolve(message.ACCOUNTNOTACTIVE)
							}
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