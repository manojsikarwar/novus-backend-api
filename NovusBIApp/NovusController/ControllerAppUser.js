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

//============== create user =================
//post
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
//================= appuser login ==============
//post

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
						// console.log(user)
						if(getuserress.rows != ''){
							if(getuserress.rows[0].status == 0){
								var token = jwt.sign({
	                                id: getuserress.rows[0].user_id,
	                                username: getuserress.rows[0].user_name,
	                                status:getuserress.rows[0].status,
	                                role_id : getuserress.rows[0].role_id,
	                                application_id : getuserress.rows[0].application_id,
	                                country : getuserress.rows[0].country
	                            }, 'secret', {
		                                expiresIn: "12hr"
		                            });
								const userData = {
									'id': getuserress.rows[0].user_id,
									'username': getuserress.rows[0].user_name.trim(),
									'status':getuserress.rows[0].status,
									'role_id':getuserress.rows[0].role_id,
									'application_id': getuserress.rows[0].application_id,
									'country' : getuserress.rows[0].country
								}
								const successmessage = {
									'status':true,
									'username':getuserress.rows[0].username,
									'token':token,
									'data':userData
								}
								resolve(successmessage)
							}else{
								resolve(message.ACCOUNTNOTACTIVE)
							}
						}else{
							resolve(message.NOTALLOW);
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

//============= latestArtical ==================
//post

module.exports.articles_list = (user,info) => {
	return new Promise((resolve, reject) => {
	try{
		// console.log(info)
		const role_id = user.role_id;
		const arr2 = [];
		const arr3  = [];
		if(role_id == 1 || role_id == 2 || role_id == 4){
			if(info.cat_id != ''){
				const searchcat = `select * from bi_contant where status = 'active'`;
				client.query(searchcat, (searchcaterr, searchcatress) => {
					if(searchcaterr){
						resolve(message.SOMETHINGWRONG);
					}else{
						if(searchcatress.rows == ''){
							resolve(message.DATANOTFOUND);
						}else {
							for(let catdata of searchcatress.rows){
								const catId = catdata.categories;
								const arr1  = catId.split(',');
								for(let key of arr1){
									if(key == ''){
										resolve(message.DATANOTFOUND)
									}else{
                                       if(key == info.cat_id){
                                       		if(catdata.status != 'trace'){

                                       			arr2.push(catdata)

                                       		}else{
                                       			// arr2.push('already deleted')	
                                       		}
                                       }
									}
								}
							}
							const searchUser = `select * from signup where user_id = '${user.id}'`
							client.query(searchUser, (userError, userResult) => {
								if(userError){
									resolve(message.SOMETHINGWRONG)
								}else {
									if(userResult.rows != ''){
										const country_name = userResult.rows[0].country.trim();
										const searchcountry = `select * from countries where country_name = '${country_name}'`
										client.query(searchcountry, (countryError, countryResult) => {
											if(countryError){
												resolve(message.SOMETHINGWRONG)
											}else {
												const country_id = countryResult.rows[0].id;
												const searchRegion = `select * from region_country where country = '${country_id}'`;
												client.query(searchRegion, (regionError, regionResult) => {
												 	if(regionError){
												 		resolve(message.SOMETHINGWRONG)
												 	}else {
												 		for(let data of regionResult.rows){
															for(let catdata of arr2){
																const regnId = catdata.region.split(",");
																for(let key of regnId){
																// console.log(catdata)
																	if(key == ''){
																		resolve(message.DATANOTFOUND);
																	}else{
								                                       if(key == data.region_id){
								                                       	    // return true;
								                                       		if(catdata.status != 'trace'){
								                                       			arr3.push(catdata)
								                                       		}else{
								                                       			arr3.push('already deleted');
								                                       		}
								                                       }
																	}
																}
															}
														}
															const successmessage = {
																'status': true,
																'data':arr3
															}
															resolve(successmessage);
												 	}	
												})
											}
										})
									}else{
										resolve(message.USERNOTFOUND)
									}
								}
							})
						}
					}
				})
			}else {
				const arrtrace = [];
				const searchcat = `select * from bi_contant where status = 'active' ORDER BY contant_id DESC`;
				client.query(searchcat, (searchcaterr, searchcatress) => {
					if(searchcaterr){
						resolve(message.SOMETHINGWRONG);
					}else{
						if(searchcatress.rows == ''){
							const successmessage = {
										'status': true,
										'data': arrtrace
									}
									resolve(successmessage);
						}else {
							for(let checktrace of searchcatress.rows){
								if(checktrace.status != 'trace'){
									arrtrace.push(checktrace);
								}
							}
							const successmessage = {
								'status': true,
								'data': arrtrace
							}
							resolve(successmessage);
						}
					}
				})
			}
		}else{
			resolve(message.NOTPERMISSION)
		}
		}catch(error){
			resolve(error)
		}
	})
}