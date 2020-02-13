const client 		= require('../db');
const bcrypt 		= require('bcrypt');
const jwt			= require('jsonwebtoken');
const moment 		= require('moment');
const date   		= new Date();
const myDate 		= moment(date).format('L');
var redis 			= require('redis');
var redisClient 	= redis.createClient(6379, 'localhost');
const message 		= require('../Helpers/message');
const serverKey 	= require('../Helpers/serverKey');	
var randomToken     = require('random-token');
const nodemailer 	= require('nodemailer');
const generator 	= require('generate-password');
const FCM 			= require('fcm-node');
const KEY 			= serverKey.KEY;

// ======================= Notification function ======================== //

var notificationMessage = (device_type, device_token, title, type_message) => {
	const KEY 	= serverKey.KEY;
    var fcm 	= new FCM(KEY);
 
    var message1 = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: device_token, 
        collapse_key: 'your_collapse_key',
        
        notification: {
            title: title, 
            body: type_message 
        },
        
        data: {  //you can send only notification or only data(or include both)
            my_key: 'my value',
            my_another_key: 'my another value'
        }
    };
    fcm.send(message1, function(err, response){
        if (err) {
            console.log(err);
        } else {
            console.log(message.NOTIFICATION);
        }
    });

}

// =================== End Notification Function ========================== //

//====================== user_list ==========================
//post
/***
Function: For User List for Admin
Params: 
		email
		status

Process: 
		select query from signup  table
		redis database

*/
module.exports.user_list = (body,user) => {
	return new Promise((resolve, reject)=>{
		try{
			const email = body.email;
			const role_id = user.role_id;
			const status = body.status;
			const UserArray = [];
			if(role_id == 1 ){
				const listuser = `select * from signup where role_id = '${4}'`;
				client.query(listuser,(listerr, listress)=>{
					if(listerr){
						resolve(message.SOMETHINGWRONG);
					}else{
						if(listress.rows == ''){
							resolve(message.DATANOTFOUND);
						}else{
							for(let key of listress.rows){
								var created_user = JSON.parse(key.app_user);
								var userlist;
								if (created_user) {
									userlist = {
										'fullname':key.fullname.trim(),
										'email':key.email.trim(),
										'company':key.company.trim(),
										'address1':key.address1.trim(),
										'address2':key.address2.trim(),
										'country':key.country.trim(),
										'state':key.state.trim(),
										'city':key.city.trim(),
										'zipcode':key.zipcode.trim(),
										'user_id':key.user_id,
										'role_id':key.role_id,
										'status':key.status,
										'app_user': created_user //JSON.parse(key.app_user)
									}	
								}else{
									userlist = {
										'fullname':key.fullname.trim(),
										'email':key.email.trim(),
										'company':key.company.trim(),
										'address1':key.address1.trim(),
										'address2':key.address2.trim(),
										'country':key.country.trim(),
										'state':key.state.trim(),
										'city':key.city.trim(),
										'zipcode':key.zipcode.trim(),
										'user_id':key.user_id,
										'role_id':key.role_id,
										'status':key.status,
										'app_user': [] //JSON.parse(key.app_user)
									}
								}

								
								UserArray.push(userlist);
							}
							redisClient.HGETALL('user',function(err,redress){
								if(err){
									resolve(message.SOMETHINGWRONG);
								}else{
									const successmessage = {
										'success':true,
										'data':UserArray
									}
									resolve(successmessage);
								}
							})
						}
					}
				})
			}else if(role_id == 2 ){

				const listuser = `select * from signup where role_id = '${4}' and created_by = '${user.id}'`;
				client.query(listuser,(listerr, listress)=>{
					if(listerr){
						resolve(message.SOMETHINGWRONG);
					}else{
						if(listress.rows == ''){
							resolve(message.DATANOTFOUND);
						}else{
							for(let key of listress.rows){
								var created_user = JSON.parse(key.app_user);
								var userlist;
								if (created_user) {
									userlist = {
										'fullname':key.fullname.trim(),
										'email':key.email.trim(),
										'company':key.company.trim(),
										'address1':key.address1.trim(),
										'address2':key.address2.trim(),
										'country':key.country.trim(),
										'state':key.state.trim(),
										'city':key.city.trim(),
										'zipcode':key.zipcode.trim(),
										'user_id':key.user_id,
										'role_id':key.role_id,
										'status':key.status,
										'app_user': created_user //JSON.parse(key.app_user)
									}	
								}else{
									userlist = {
										'fullname':key.fullname.trim(),
										'email':key.email.trim(),
										'company':key.company.trim(),
										'address1':key.address1.trim(),
										'address2':key.address2.trim(),
										'country':key.country.trim(),
										'state':key.state.trim(),
										'city':key.city.trim(),
										'zipcode':key.zipcode.trim(),
										'user_id':key.user_id,
										'role_id':key.role_id,
										'status':key.status,
										'app_user': [] //JSON.parse(key.app_user)
									}
								}

								
								UserArray.push(userlist);
							}
							redisClient.HGETALL('user',function(err,redress){
								if(err){
									resolve(message.SOMETHINGWRONG);
								}else{
									const successmessage = {
										'success':true,
										'data':UserArray
									}
									resolve(successmessage);
								}
							})
						}
					}
				})
			}else{
				resolve(message.NOTPERMISSION);
			}


		}catch(error){
			resolve(error)
		}

	})
}


//=====================  user_approve  =======================
//get
/***
Function: For User Approve for Admin
Params: 
		user_id
		status

Process: 
		select query from signup  table
		update data of signup table
		redis database

*/
module.exports.user_approve = (body, user) => {
	return new Promise((resolve,reject)=>{
		const role_id = user.role_id;
		const id = body.user_id;
		const status = body.status;

	    if(role_id == 1){
	    	if(id != '' && status != ''){
	    		if(id && status){
				   	const finduser = `select * from signup where user_id = '${id}' `;
					client.query(finduser,(finderr,findress)=>{
						if(finderr){
							resolve(message.SOMETHINGWRONG)
						}else{
							const email = findress.rows[0].email;
							if(findress.rows != ''){
								const approveuser = `update signup set status = '${status}' where user_id = '${id}' `;
								client.query(approveuser, (approveerr,approveress)=>{
									if(approveerr){
										resolve(message.SOMETHINGWRONG)
									}else{
									let redata = {
			                        		user_id 	: findress.rows[0].user_id,
											fullname 	: findress.rows[0].fullname,
											email 		: findress.rows[0].email,
											password 	: findress.rows[0].password,
											company 	: findress.rows[0].company,
											address1 	: findress.rows[0].address1,
											address2 	: findress.rows[0].address2,
											country 	: findress.rows[0].country,
											state 		: findress.rows[0].state,
											city 		: findress.rows[0].city,
											zipcode 	: findress.rows[0].zipcode,
											status 		: status,
											role_id 	: '4',
											created_date: myDate,
											created_by 	: 'NONE'
										}
										redisClient.hmset('user', email, JSON.stringify(redata), function (err, data) {
										    if(err){
										    	resolve(message.SOMETHINGWRONG)
										    }else{
										    	if(data == 'OK'){
										    		resolve(message.ACTIVEACCOUNT);
										    	}else{
										    		resolve(message.NOTACTIVEACCOUNT);
										    	}
										    }
										})
									}
								})						
							}else{
								resolve(message.DATANOTFOUND);
							}
						}
				 	})
	    		}else{
	    			resolve(message.PARAMETES);
	    		}
	    	}else{
	    		resolve(message.FILEDS);
	    	}
	   	}else{
		   	resolve(message.NOTPERMISSION);
	   	}
	})
}

//=====================  user_disapprove  =======================
//post

module.exports.user_disapprove = (body, user) => {
	return new Promise((resolve,reject)=>{
		const role_id = user.role_id;
		const id = body.user_id;

	   if(role_id == 1){
		   	const finduser = `select * from signup where user_id = '${id}' `;
			client.query(finduser,(finderr,findress)=>{
				if(finderr){
					resolve(message.SOMETHINGWRONG)
				}else{
					const email = findress.rows[0].email;
					if(findress.rows != ''){
						const disapproveuser = `update signup set status = '${2}' where user_id = '${id}' `;
						client.query(disapproveuser, (disapproveerr,disapproveress)=>{
							if(disapproveerr){
								resolve(message.SOMETHINGWRONG)
							}else{
							let redata = {
	                        		user_id 	: findress.rows[0].user_id,
									fullname 	: findress.rows[0].fullname,
									email 		: findress.rows[0].email,
									password 	: findress.rows[0].password,
									company 	: findress.rows[0].company,
									address1 	: findress.rows[0].address1,
									address2 	: findress.rows[0].address2,
									country 	: findress.rows[0].country,
									state 		: findress.rows[0].state,
									city 		: findress.rows[0].city,
									zipcode 	: findress.rows[0].zipcode,
									status 		: '2',
									role_id 	: '4',
									created_date: myDate,
									created_by 	: 'NONE'
								}
								redisClient.hmset('user', email, JSON.stringify(redata), function (err, data) {
								    if(err){
								    	resolve(message.SOMETHINGWRONG);
								    }else{
								    	if(data == 'OK'){
								    		resolve(message.DISAPPROVEUSER);
								    	}else{
								    		resolve(message.NOTDISAPPROVEUSER);
								    	}
								    }
								});
							}
						});						
					}else{
						resolve(message.DATANOTFOUND);
					}
				}
		 	});
	   	}else{
		   	resolve(message.NOTPERMISSION);
	   	}
	});
}


//=====================  super_forget_password  =======================
//post
/***
Function: For Admin forget password for Admin
Params: 
		email

Process: 
		select query from supertbl  table
		update data of supertbl table
		send mail
		redis database

*/
var sendEmailTosuper = (email, password, first_name) => {
    nodemailer.createTestAccount((err, account) => {
        let transporter = nodemailer.createTransport({
            host: 'smtp.googlemail.com', // Gmail Host
            port: 465, // Port
            secure: true, // this is true as port is 465
            auth: {
                user: 'pinkpanther.emaster@gmail.com', //Gmail username
                pass: 'Pink@123#' // Gmail password
            }
        });

        let mailOptions = {
            from: '"NovusOne" <test@engineermaster.in>',
            to: email,
            subject: 'Your password Request',

            html: '<div style="height: 35px; width: 100%; background-color: purple; text-align: center; color: white; padding-top: 15px; font-weight: bold;">NovusOne</div><br><br>Hello <b style="color:red">'+first_name+'</b>,<br><br>&nbsp;&nbsp;&nbsp;You recently requested to reset your password for your <b style="color:red;">'+email+'</b> account <br><br>Password : ' + password +'<br><br>Thank You <br>NovusOne team<br><br><br><div style="height: 45px; width: 100%; background-color: purple; text-align: center; color: white"></div>'
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            }
            resolve(info);
        });
    });
}

module.exports.super_forget_password = (email) => {
    return new Promise((resolve, reject) => {
        try {
            if (email != '') {
                if(email){
                    const matchemail = `select * from supertbl where email = '${email}'`;
                    client.query(matchemail, (matchemailerr, result) => {
                        if (matchemailerr) {
                            resolve(message.SOMETHINGWRONG);
                        } else {
                            if(result.rows == ''){
                                resolve(message.INVALIDEMAIL);
                            } else {
                            	var password = generator.generate({
                                        length: 10,
                                        numbers: true
                                });
                                bcrypt.genSalt(10, function(err, salt) {
                                        if (err) {
                                            resolve(message.PASSWORDNOTGEN);
                                        }
	                                bcrypt.hash(password, salt, function(err, hash) {
		                                var first_name = result.rows[0].fullname; 
		                                const updatedata = `update supertbl set password = '${hash}' where email = '${email}' `;
		                                client.query(updatedata, (updatedataerr, result1) => {
		                                    if (updatedataerr) {
		                                        resolve(message.SOMETHINGWRONG);
		                                    } else {
		                                    		let redata = {
													   	fullname:result.rows[0].fullname,
													   	email: result.rows[0].email,
														password:result.rows[0].hash,
														status  :result.rows[0].status,
														role_id :result.rows[0].role_id,
														super_id :result.rows[0].super_id,
														created_date  :result.rows[0].created_date

													}
													redisClient.hmset('super', email, JSON.stringify(redata), function (err, data) {
												    if(err){
												    	resolve(message.SOMETHINGWRONG);
												    }else{
												    	if(data == 'OK'){
					                                        resolve(message.MAIL_SEND);
												    	}else{
													    	resolve(message.UNREGISTRATION);
												    	}
												    }
												});
		                                    }
		                                });
		                                sendEmailTosuper(email, password, first_name);
	                            	})
                            	});
                            }
                        }
                    });
                } else {
                    resolve(message.PARAMETES);
                }
            } else {
                resolve(message.FILEDS);
            }
        } catch (error) {
            resolve('error');
        }
    });
}


module.exports.sendResetPasswordLink = (email) => {
    return new Promise((resolve, reject) => {
        try {
            if (email != '') {
                if(email){
                    const matchemail = `select * from supertbl where email = '${email}'`;
                    client.query(matchemail, (matchemailerr, result) => {
                        if (matchemailerr) {
                            resolve(message.SOMETHINGWRONG);
                        } else {
                            if(result.rows == ''){
                                resolve(message.INVALIDEMAIL);
                            } else {
                            	var reset_token = generator.generate({
                                        length: 10,
                                        numbers: true
                                });
                            	console.log(reset_token);

                                bcrypt.genSalt(10, function(err, salt) {
                                        if (err) {
                                            resolve(message.PASSWORDNOTGEN);
                                        }
	                                
		                                var first_name = result.rows[0].fullname; 
		                                const updatedata = `update supertbl set reset_token = '${reset_token}',reset_token_status = '${1}' where email = '${email}' `;
		                                client.query(updatedata, (updatedataerr, result1) => {
		                                    if (updatedataerr) {
		                                        resolve(message.SOMETHINGWRONG);
		                                    } else {
		                                    	//console.log(result.rows[0]);
		                                    		let redata = {
													   	fullname  	: result.rows[0].fullname,
													   	email     	: result.rows[0].email,
														password  	: result.rows[0].password,
														reset_token : result.rows[0].reset_token,
														status    	: result.rows[0].status,
														reset_token_status  : result.rows[0].reset_token_status,
														role_id   	: result.rows[0].role_id,
														super_id   	: result.rows[0].super_id,
														created_date: result.rows[0].created_date

													}

													console.log(redata);

													redisClient.hmset('super', email, JSON.stringify(redata), function (err, data) {
												    if(err){
												    	resolve(message.SOMETHINGWRONG);
												    }else{
												    	if(data == 'OK'){
					                                        resolve(message.MAIL_SEND);
												    	}else{
													    	resolve(message.UNREGISTRATION);
												    	}
												    }
												});
		                                    }
		                                });
		                               sendResetPasswordEmail(email,reset_token, first_name);
	                            	
                            	});
                            }
                        }
                    });
                } else {
                    resolve(message.PARAMETES);
                }
            } else {
                resolve(message.FILEDS);
            }
        } catch (error) {
            resolve('error');
        }
    });
}


module.exports.resetpassword = (reset_token, password) => {
    const chk_token	= reset_token.split(":");
    const token = chk_token[1]; 
 
    return new Promise((resolve, reject) => {
        try {
            if (token != '') {
                if(token){

                    const matchToken = `select * from supertbl where reset_token = '${token}'`;
                    client.query(matchToken, (matchtokenerr, result) => {
                        if (matchtokenerr) {
                            resolve(message.SOMETHINGWRONG);
                        } else {
                            if(result.rows == ''){
                                resolve(message.INVALIDRESETTOKEN);
                            } else {
                     
                                bcrypt.genSalt(10, function(err, salt) {
                                        if (err) {
                                            resolve(message.PASSWORDNOTGEN);
                                        }
	                                bcrypt.hash(password, salt, function(err, hash) {
		                                var first_name = result.rows[0].fullname; 
		                                const updatedata = `update supertbl set password = '${hash}',reset_token = '',reset_token_status = '${0}' where reset_token = '${token}' `;
		                                client.query(updatedata, (updatedataerr, result1) => {
		                                    if (updatedataerr) {
		                                        resolve(message.SOMETHINGWRONG);
		                                    } else {
		                                    		let redata = {
													   	fullname:result.rows[0].fullname,
													   	email: result.rows[0].email,
														password:result.rows[0].hash,
														reset_token:result.rows[0].reset_token,
														status  :result.rows[0].status,
														reset_token_status:result.rows[0].reset_token_status,
														role_id :result.rows[0].role_id,
														super_id :result.rows[0].super_id,
														created_date  :result.rows[0].created_date

													}
													redisClient.hmset('super', result.rows[0].email, JSON.stringify(redata), function (err, data) {
												    if(err){
												    	resolve(message.SOMETHINGWRONG);
												    }else{
												    	if(data == 'OK'){
					                                        resolve(message.RESETPASSWORDSUCCESS);
												    	}else{
													    	resolve(message.UNREGISTRATION);
												    	}
												    }
												});
		                                    }
		                                });
		                                //sendEmailTosuper(email, password, first_name);
	                            	})
                            	});
                            }
                        }
                    });
                } else {
                    resolve(message.RESETTOKEN);
                }
            } else {
                resolve(message.RESETTOKEN);
            }
        } catch (error) {
            resolve('error');
        }
    });
}


//===================== suepr_update_userProfile ===================
//Put
/***
Function: For Admin forget password for Admin
Params: 
		user_id
		fullname 
		address1
		address2
		country
		state 
		city 
		zipcode

Process: 
		select query from signup  table
		update data of signup table
		redis database

*/
module.exports.admin_update_userProfile = (body, user) => {
	return new Promise((resolve,reject)=>{
		try{
		    const user_id	= body.user_id;
		    const role_id 	= user.role_id;
		    const fullname 	= body.fullname;
			const company 	= body.company;
			const address1 	= body.address1;
			const address2 	= body.address2;
			const country 	= body.country;
			const state 	= body.state;
			const city 		= body.city;
			const zipcode 	= body.zipcode;
			const app_user    = body.create_user;

			var appUser;
			if (app_user.length > 0) {
				appUser =  JSON.stringify(app_user);
			}else{
				appUser = 'null';
			}
			
		    if(fullname != '' && company != '' && address1 != '' && address2 != '' && country != '' && state != '' && city != '' && zipcode != '' ){
			    if(role_id < 3){
			    	const match = `select * from signup where user_id = '${user_id}'`;
			    	client.query(match, (matcherr, matchress) => {
			    		if(matcherr){
			    			const errMessage = {
								"success":false,
								'message':'Something went wrong1'
							}
							resolve(errMessage)
			    		}else{
			    			if(matchress.rows == ''){
								const errMessage = {
									"success":false,
									'message':'User not found'
								}
								resolve(errMessage)
			    			}else{
			    				const email = matchress.rows[0].email;
								let redata = {
								   	fullname:fullname,
									company :company,
									address1:address1,
									address2:address2,
									country :country,
									state 	:state,
									city 	:city,
									zipcode :zipcode,
									email:email,
									app_user: appUser,
									password:matchress.rows[0].password,
									status  :matchress.rows[0].status,
									role_id :matchress.rows[0].role_id,
									user_id :matchress.rows[0].user_id,
									created_date  :matchress.rows[0].created_date,
									created_by :matchress.rows[0].created_by

								}
						   		const sql = `update signup set 
						   					fullname='${fullname}',
											company ='${company}',
											address1='${address1}',
											address2='${address2}',
											country ='${country}',
											state 	='${state}',
											city 	='${city}',
											zipcode ='${zipcode}',
											app_user='${appUser}' where user_id ='${user_id}' `;
								client.query(sql,(err,result)=>{
									// console.log(sql)
									if(err){
										const Data = {
											"success":false,
											'message':'This Email Already exist'
										}
										resolve(Data)
									}else{

	                                	redisClient.hmset('user', email, JSON.stringify(redata), function (err, data) {
										    if(err){
										    	const errmessage ={
										    		'status':false,
										    		'message':'something went wrong'
										    	}
										    	resolve(errmessage)
										    }else{
										    	if(data == 'OK'){
												
													//start
										    		for(let appData of app_user){
										    			const del = `delete from app_user where application_id = '${appData.application_id}' and user_id = '${body.user_id}'`;
														client.query(del, (delerr, delress) => {
														    if (delerr) {
														        resolve(message.SOMETHINGWRONG)
														    } else {
														    	const rUdata = {
														    		application_id : appData.application_id,
																   	user_name : appData.user_name,
																	user_id   : user_id
																}
																redisClient.hdel('app_user',rUdata,function(err1,redisdata1){
																	if(err1){
																		// resolve(message.SOMETHINGWRONG);
																	}else{
																		if(redisdata1 == 0){
																			//resolve(message.APP);
																		}
																	}	
																});	
															}	

														});		
										    		}

										    		for(let appData of app_user){
												    			
										    			const sqlApp = `insert into app_user(application_id,user_name,user_id,status) values('${appData.application_id}','${appData.user_name}','${user_id}','${0}')RETURNING app_id`;
										
														client.query(sqlApp, (err1, res1) => {
															if (err1) {
																resolve(message.SOMETHINGWRONG);
															}else{
																const AppRedis = {
																	application_id : appData.application_id,
																	user_name	   : appData.user_name,
																	user_id		   : user_id,
																	app_id    	   : res1.rows[0].app_id,
																	status 			: 0
																}

																redisClient.hmset('app_user', appData.user_name, JSON.stringify(AppRedis), function (err1, data1) {
																    if(err1){
																    	resolve(message.SOMETHINGWRONG);
																    }else{
																    	if(data1 == 'OK'){
																	    	resolve(message.REGISTRATION);
																    	}else{
																	    	resolve(message.SOMETHINGWRONG);
																    	}
																    }
																})
															}
														})
										    		}
										    		// end

											    	resolve(message.PROFILEUPDATE)
										    	}else{
											    	resolve(message.NOTUPDATE)
										    	}
										    }
										})
									}
								})
			    			}
			    		}
			    	})
			    }else{
			    	resolve(message.NOTPERMISSION)
			    }
			}else{
		    	resolve(message.FILEDS)
			}
			
		}catch(error){
			console.log(error)
		}
	})
}
//================= admin delete user ================= //
//delete
/***
Function: For Admin delete user for Admin
Params: 
		user_id

Process: 
		select query from signup  table
		delete data of signup table
		redis database also

*/
module.exports.admin_delete_user = (body, user) => {
    return new Promise((resolve, reject) => {
        try {
        	const role_id = user.role_id;
        	const user_id = body.user_id;
            if (role_id < 3) {
                if (user_id != '') {
                    if(user_id){
                        const search = `select * from signup where user_id = '${user_id}'`;
                        client.query(search, (searcherr, searchress) => {
                            if(searcherr){
                                resolve(message.SOMETHINGWRONG);
                            }else{
                                if (searchress.rows == '') {
                                    resolve(message.DATANOTFOUND)
                                } else {
                                    
                                	const companyid = searchress.rows[0].company_id;
                                    const del = `delete from signup where user_id = '${user_id}' `
                                    client.query(del, (delerr, delress) => {
                                        if (delerr) {
                                            resolve(message.SOMETHINGWRONG)
                                        } else {
                                      		const AppAcsess = JSON.parse(searchress.rows[0].app_user);
		                                	for(let app_data of AppAcsess){

		                                		const companyid = searchress.rows[0].company_id;
			                                    const del1 = `delete from app_user where user_id = '${user_id}' and application_id = '${app_data.application_id}' `
			                                    client.query(del1, (delerr1, delress1) => {
			                                        if (delerr1) {
			                                            resolve(message.SOMETHINGWRONG)
			                                        } else {
			                                           resolve(message.USERDELETE)
			                                        }
			                                    })
		                                	}     

                                    
                                        }
                                    })
                                }
                            }
                        })
                    } else {
                        const errMessage = {
                            'success': false,
                            'message': 'Give correct parameters'
                        }
                        resolve(errMessage)
                    }
                } else {
                    const errMessage = {
                        'success': false,
                        'message': 'company_id compulsary'
                    }
                    resolve(errMessage)
                }
            } else {
                resolve(message.NOTPERMISSION)
            }
        } catch (error) {
            const errMessage = {
                'status': false,
                'message': error
            }
            resolve(errMessage);
        }
    })
}
// ================== admin_search_user ================= //
//post
/***
Function: For Admin Search User for Admin
Params: 
		user_name

Process: 
		select query from signup  table by name
		redis database also

*/
module.exports.admin_search_user = (body,user) => {
	return new Promise((resolve, reject)=>{
		try{
			const role_id = user.role_id;
			const user_name = body.user_name;
			const Array = [];
			if(role_id == 1){
					const listuser = `select * from signup where fullname like '%${user_name}%'`;
					client.query(listuser,(listerr, listress)=>{
						if(listerr){
							resolve(message.SOMETHINGWRONG);
						}else{
							if(listress.rows == ''){
								const errMessage = {
									'success':true,
									'data':listress.rows
								}
								resolve(errMessage);
							}else{
								for(let key of listress.rows){
									const userlist = {
										'fullname':key.fullname.trim(),
										'email':key.email.trim(),
										'company':key.company.trim(),
										'address1':key.address1.trim(),
										'address2':key.address2.trim(),
										'country':key.country.trim(),
										'state':key.state.trim(),
										'city':key.city.trim(),
										'zipcode':key.zipcode.trim(),
										'user_id':key.user_id,
										'role_id':key.role_id,
										'status':key.status
									}
									Array.push(userlist);
								}
								redisClient.HGETALL('user',function(err,redress){
									if(err){
										resolve(message.SOMETHINGWRONG);
									}else{
										const successmessage = {
											'success':true,
											'data':Array
										}
										resolve(successmessage);
									}
								})
							}
						}
					})
			}else{
				resolve(message.NOTPERMISSION);
			}

		}catch(error){
			resolve('error')
		}

	})
}

// =============== send_notification ======================//
//post
/***
Function: For Admin Search User for Admin
Params: 
		selected_user
		title
		type_message

Process: 
		select query from signup  table
		and notification sedn user and without user
		redis database also

*/
module.exports.send_notification = (body, user) => {
	return new Promise((resolve, reject) => {
		try{
		    const role_id = user.role_id;
			const selected_user = body.selected_user;
			const title = body.title;
			const type_message = body.type_message
			const application_id = body.application_id;
			const Array = [];
		    if(role_id == 1){
		        let user_data = selected_user.split(',');
		    	if(application_id != ""){
		    		const matchapp = `select selected_user from application_management where application_id = '${application_id}'`;
			    	client.query(matchapp, (matchapperr, matchappress) => {
                   		
			    		if(matchapperr){
							resolve(message.SOMETHINGWRONG);
			    		}else{
			    			if(matchappress.rows == ''){
								resolve({'success':true,'data': matchappress.rows});
			    			}else{
			    				for(let key of matchappress.rows){
			    					 let user_data1 = key.selected_user.split(',');
		                         	for(let userlis1 of user_data1){
								    	const match = `select device_type,device_token from signup where user_id = '${userlis1}'`;
								    	client.query(match, (matcherr, matchress) => {
								    		console.log(match)
								    		if(matcherr){
												resolve(message.SOMETHINGWRONG);
								    		}else{
								    			if(matchress.rows == ''){
													resolve({'success':true,'data': matchress.rows});
								    			}else{
								    				for(let key of matchress.rows){
								    					resolve(key)
						                         		notificationMessage(key.device_type, key.device_token, title, type_message);
						                         		resolve(message.NOTIFICATION)
								    				}
												
								    			}
								    		}
								    	})
						    		}
			    				}
							
			    			}
			    		}
			    	})
		    	}
		    	if(user_data != ''){
		    		for(let userlis of user_data){
		    			// resolve('userlis');
				    	const match = `select device_type,device_token from signup where user_id = '${userlis}'`;
				    	client.query(match, (matcherr, matchress) => {
				    		if(matcherr){
								resolve(message.SOMETHINGWRONG);
				    		}else{
				    			if(matchress.rows == ''){
									resolve({'success':true,'data': matchress.rows});
				    			}else{
				    				for(let key of matchress.rows){
				    					resolve(key)
		                         		notificationMessage(key.device_type, key.device_token, title, type_message);
		                         		resolve(message.NOTIFICATION)
				    				}
								
				    			}
				    		}
				    	})
		    		}
		    	}
		    }else{
		    	resolve(message.NOTPERMISSION)
		    }
			
		}catch(error){
			console.log(error)
		}
	})
}


var sendResetPasswordEmail = (email, reset_token, first_name) => {
    nodemailer.createTestAccount((err, account) => {
        let transporter = nodemailer.createTransport({
            host: 'smtp.googlemail.com', // Gmail Host
            port: 465, // Port
            secure: true, // this is true as port is 465
            auth: {
                user: 'pinkpanther.emaster@gmail.com', //Gmail username
                pass: 'Pink@123#' // Gmail password
            }
        });

        let mailOptions = {
            from: '"NovusOne" <test@engineermaster.in>',
            to: email,
            subject: 'Reset your password',

            html: '<div style="height: 35px; width: 100%; background-color: purple; text-align: center; color: white; padding-top: 15px; font-weight: bold;">NovusOne</div><br><br>Hello <b style="color:red">'+first_name+'</b>,<br><br>&nbsp;&nbsp;&nbsp;You recently requested to reset your password for your <b style="color:red;">'+email+'</b> account <br><br>Click on link :  <a href="http://13.90.215.196:3000/api/resetpassword/token:"'+reset_token+'><button > Reset Password </button></a><br><br>Thank You <br>NovusOne team<br><br><br><div style="height: 45px; width: 100%; background-color: purple; text-align: center; color: white"></div>'
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            }
            resolve(info);
        });
    });
}



module.exports.createAdmin = (body, user) => {
    return new Promise((resolve, reject) => {
        try {
        	const role_id =  user.role_id;
        	if(role_id == 1){
				const password = body.password;

	        	bcrypt.hash(password,10,function(err,hash){
		    		const fullname    = body.fullname;
					const email 	  = body.email;
					const company 	  = body.company;
					const address1    = body.address1;
					const address2    = body.address2;
					const country     = body.country;
					const state 	  = body.state;
					const city 		  = body.city;
					const zipcode     = body.zipcode;
					const rollid 	  = '2';
					const created_by  = user.id;
					const device_type = 'null';
					const device_token= 'null';
					const app_user    = 'null';
					const access_application_id = body.access_application_id;

		            if(fullname != '' && email != '' && password != '' && company != '' && address1 != '' && address2 != '' && country != '' && state != '' && city != '' && zipcode != '' ){
		                if(fullname && email != '' && password != '' && company != '' && address1 != '' && address2 != '' && country != '' && state != '' && city != '' && zipcode != '' ){
		                    const getemail = `select * from signup where email = '${email}' and access_application_id = '${access_application_id}' and role_id = '${2}'  `;
		                    client.query(getemail, (emailerr, emaildataress) => {
		                        if (emaildataress.rows != '') {
		                            resolve(message.ALREADYUSE);
		                        } else {
		                        	// resolve('insert')   /todo change ->1
		                            const sql = `insert into signup(fullname,email,password,company,address1,address2,country,state,city,zipcode,status,created_by,created_date,role_id,device_type,device_token,app_user,access_application_id) values('${fullname}','${email}','${hash}','${company}','${address1}','${address2}','${country}','${state}','${city}','${zipcode}','${0}','${created_by}','${myDate}','${rollid}','${device_type}','${device_token}','${app_user}','${access_application_id}')RETURNING user_id`;
		                            client.query(sql, (usererr, userress) => {
		                                if (usererr) {
		                                    resolve(message.SOMETHINGWRONG);
		                                } else {

		                                	const userId = userress.rows[0].user_id;

	                                		let redata = {
				                        		user_id 	: userId,
												fullname 	: body.fullname,
												email 		: body.email,
												password 	: body.password,
												company 	: body.company,
												address1 	: body.address1,
												address2 	: body.address2,
												country 	: body.country,
												state 		: body.state,
												city 		: body.city,
												zipcode 	: body.zipcode,
												status 		: '0',
												role_id 	: '2',
												created_date: myDate,
												created_by 	: 'NONE',
												device_type  :device_type,
												device_token : device_token,
												app_user	 : app_user,
												access_application_id : access_application_id
											}
												
											redisClient.hmset('user', email, JSON.stringify(redata), function (err, data) {
											    if(err){
											    	resolve(message.SOMETHINGWRONG);
											    }else{
											    	if(data == 'OK'){
												    	resolve(message.CREATED);
												    	// sendEmailToSignup(email, company, fullname);
											    	}else{
												    	resolve(message.SOMETHINGWRONG);
											    	}
											    }
											})

		                                }
		                            })
		                        }
		                    });
		                }else{
		                    resolve(message.PARAMETES);
		                }
		            } else {
		                resolve(message.FILEDS);
		            }
	        	})   

        	}else{
        		resolve(message.NOTPERMISSION)
        	}
        } catch (error) {
	            resolve(message.ERROR); 
        }
    })
}


module.exports.adminlist = (body, user) => {
	return new Promise((resolve, reject)=>{
		try{
			const application_id = body.application_id;
			const role_id = user.role_id;
			const status = body.status;
			const UserArray = [];
			if(role_id == 1){
				const listuser = `select * from signup where access_application_id = '${application_id}'`;
				// const listuser = `select * from signup where role_id = '${2}' and status = '${0}' and access_application_id = '${application_id}'`; todo =>chegess
				client.query(listuser,(listerr, listress)=>{
					if(listerr){
						resolve(message.SOMETHINGWRONG);
					}else{
						if(listress.rows == ''){
							resolve(message.DATANOTFOUND);
						}else{
							for(let key of listress.rows){
								var created_user = JSON.parse(key.app_user);
								var userlist;
								if (created_user) {
									userlist = {
										'fullname':key.fullname.trim(),
										'email':key.email.trim(),
										'company':key.company.trim(),
										'address1':key.address1.trim(),
										'address2':key.address2.trim(),
										'country':key.country.trim(),
										'state':key.state.trim(),
										'city':key.city.trim(),
										'zipcode':key.zipcode.trim(),
										'user_id':key.user_id,
										'role_id':key.role_id,
										'status':key.status,
									}	
								}else{
									userlist = {
										'fullname':key.fullname.trim(),
										'email':key.email.trim(),
										'company':key.company.trim(),
										'address1':key.address1.trim(),
										'address2':key.address2.trim(),
										'country':key.country.trim(),
										'state':key.state.trim(),
										'city':key.city.trim(),
										'zipcode':key.zipcode.trim(),
										'user_id':key.user_id,
										'role_id':key.role_id,
										'status':key.status,
									}
								}

								
								UserArray.push(userlist);
							}
							redisClient.HGETALL('user',function(err,redress){
								if(err){
									resolve(message.SOMETHINGWRONG);
								}else{
									const successmessage = {
										'success':true,
										'data':UserArray
									}
									resolve(successmessage);
								}
							})
						}
					}
					})
			}else{
				resolve(message.NOTPERMISSION);
			}

		}catch(error){
			resolve(error)
		}

	})
}



module.exports.deleteAdmin = (body, user) => {
    return new Promise((resolve, reject) => {
        try {
        	const role_id = user.role_id;
        	const admin_id = body.admin_id;
            if (role_id == 1) {
                if (admin_id != '') {
                        const Check = `select * from signup where user_id = '${admin_id}' and role_id = '${2}'`;
                        client.query(Check, (chkerr, chkress) => {
                            if(chkerr){
                                resolve(message.SOMETHINGWRONG);
                            }else{
                                if (chkress.rows == '') {
                                    resolve(message.DATANOTFOUND)
                                } else {
                                    //const companyid = chkress.rows[0].company_id;
                                    const del = `delete from signup where user_id = '${admin_id}' and role_id = '${2}' `
                                    client.query(del, (delerr, delress) => {
                                        if (delerr) {
                                            resolve(message.SOMETHINGWRONG)
                                        } else {
                                        	const rUdata = {
									    		user_id : admin_id,
											}
                                        	redisClient.hdel('signup',rUdata,function(err1,redisdata1){
												if(err1){
													// resolve(message.SOMETHINGWRONG);
												}else{
													if(redisdata1 == 0){
														resolve(message.ADMINDELETE)
													}
												}	
											});
                                           // resolve(message.USERDELETE)
                                        }
                                    })
                                }
                            }
                        })
                    
                } else {
                    const errMessage = {
                        'success': false,
                        'message': 'admin_id compulsary'
                    }
                    resolve(errMessage)
                }
            } else {
                resolve(message.NOTPERMISSION)
            }
        } catch (error) {
            const errMessage = {
                'status': false,
                'message': error
            }
            resolve(errMessage);
        }
    })
}




module.exports.adminApproveAndDisapprove = (body, user) => {
    return new Promise((resolve, reject) => {
        try {
        	const role_id 	   = user.role_id;
        	const admin_id 	   = body.admin_id;
        	const admin_status = body.status;
        	const application_id = body.application_id;
            if (role_id == 1) {
                if (admin_id != '') {
                        const Check = `select * from signup where user_id = '${admin_id}' and access_application_id = '${application_id}' and role_id = '${2}'`;
                        client.query(Check, (chkerr, chkress) => {
                            if(chkerr){
                                resolve(message.SOMETHINGWRONG);
                            }else{
       
       							const updatedata = `update signup set status = '${admin_status}' where user_id = '${admin_id}' and access_application_id = '${application_id}' `;
	                                client.query(updatedata, (updatedataerr, result1) => {
	                                    if (updatedataerr) {
	                                        resolve(message.SOMETHINGWRONG);
	                                    } else {
                                    		let redata = {

												fullname:chkress.rows[0].fullname.trim(),
												company :chkress.rows[0].company.trim(),
												address1:chkress.rows[0].address1.trim(),
												address2:chkress.rows[0].address2.trim(),
												country :chkress.rows[0].country.trim(),
												state 	:chkress.rows[0].state.trim(),
												city 	:chkress.rows[0].city.trim(),
												zipcode :chkress.rows[0].zipcode.trim(),
												email:chkress.rows[0].email.trim(),
												app_user: chkress.rows[0].appUser,
												password:chkress.rows[0].password.trim(),
												status  :admin_status,
												role_id :chkress.rows[0].role_id,
												user_id :chkress.rows[0].user_id,
												created_date  :chkress.rows[0].created_date.trim(),
												created_by :chkress.rows[0].created_by.trim()

											}
											redisClient.hmset('user', chkress.rows[0].email.trim(), JSON.stringify(redata), function (err, data) {
										    if(err){
										    	resolve(message.SOMETHINGWRONG);
										    }else{
										    	if(data == 'OK'){
			                                        if (admin_status == 0) {
			                                        	resolve(message.ADMINAPPROVE);
			                                        }else{
			                                        	resolve(message.ADMINDISAPPROVE);
			                                        }
										    	}else{
											    	resolve(message.SOMETHINGWRONG);
										    	}
										    }
										});
                                    }
                                });

                            }
                        })
                    
                } else {
                    const errMessage = {
                        'success': false,
                        'message': 'admin_id compulsary'
                    }
                    resolve(errMessage)
                }
            } else {
                resolve(message.NOTPERMISSION)
            }
        } catch (error) {
            const errMessage = {
                'status': false,
                'message': error
            }
            resolve(errMessage);
        }
    })
}