const client 		= require('../db');
const bcrypt 		= require('bcrypt');
const jwt			= require('jsonwebtoken');
const moment 		= require('moment');
const date   		= new Date();
const myDate 		= moment(date).format('L');
const redis 		= require('redis');
const redisClient 	= redis.createClient(6379, 'localhost');
const message 		= require('../Helpers/message');
const serverKey		= require('../Helpers/serverKey');
const generator 	= require('generate-password');
const FCM 			= require('fcm-node');
const KEY 			= serverKey.KEY;

// ======================= Notification function ======================== //

var notificationMessage = (device_type, device_token) => {
		const KEY 	= serverKey.KEY;
	    var fcm 	= new FCM(KEY);
	 
	    var message1 = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
	        to: device_token, 
	        collapse_key: 'your_collapse_key',
	        
	        notification: {
	            title: 'Congratulation ', 
	            body: 'Body of your push notification' 
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


// ======================= application_management ======================== //
//post
/***
Function: For Application Manangement for Admin
Params: 
		applicationName
		icon
		selectedCountries
		selectedUser

Process: 
		select query from table application_management  table
		insert data in application_management table

*/
module.exports.application_management = (body, user) =>{
	return new Promise((resolve, reject)=>{
		try{
			const role_id = user.role_id;
			const applicationName = body.applicationName;
			const icon = body.icon;
			const selectedCountries = body.selectedCountries;
			const selectedUser = body.selectedUser;

			if(role_id == 1){
				if(applicationName != '' && icon != '' ){
					if(applicationName && icon ){
						const finddata = `select * from application_management where application_name = '${applicationName}'`;
						client.query(finddata, (finderr, findress) => {
							if(finderr){
								resolve(message.SOMETHINGWRONG);
							}else{
								if(findress.rows != ''){
									resolve(message.APPLICATION)
								}else{
									const applic = `insert into application_management(application_name,icon,selected_countries,selected_user,status,created_date) values('${applicationName}','${icon}','${selectedCountries}','${selectedUser}','${0}','${myDate}')`;
									client.query(applic, (applicerr,applicress)=>{
										if(applicerr){
											resolve(message.SOMETHINGWRONG);
										}else{
											const resdata = {
												applicationName:applicationName,
												icon:icon,
												selectedCountries:selectedCountries,
												selectedUser:selectedUser
											}
											redisClient.hmset('application', applicationName, JSON.stringify(resdata),function(err,redisdata){
												if(err){
													resolve(message.SOMETHINGWRONG);
												}else{
													if(redisdata == 'OK'){
														resolve(message.SUCCESSAPPLICATION);
													}else{
														resolve({'success':false,'message':'Not insert'});
													}
												}
											})
										}
									})
								}
							}``
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
		}catch(error){
			resolve({'status':false,'message':error});
		}
	})
}

// ====================== application_list =============================== //
//get
/***
Function: For Application List for Admin
Params: 
		No params

Process: 
		showing list from application_management table
		
*/
module.exports.application_list = (user) =>{
	return new Promise((resolve, reject)=>{
		try{
			const role_id = user.role_id;
			const Array = [];
			if(role_id == 1){
				const applist = `select * from application_management`;
				client.query(applist, (applisterr, applistress) => {
					if(applisterr){
						resolve(message.SOMETHINGWRONG);
					}else{
						if(applistress.rows != ''){
							for(let key of applistress.rows){
								Array.push(key);
							}
							const successMessage = {
								'success':true,
								'data':Array
							}
							redisClient.hgetall('app', function (err, data) {
							    if(err){
							    	resolve(message.SOMETHINGWRONG);
							    }else{
							    	
									resolve(successMessage)
							    }
							})
						}else{
							resolve(message.DATANOTFOUND)
						}
					}
				});
			}else{	
				resolve(message.NOTPERMISSION);
			}
		}catch(error){
			resolve({'status':false,'message':error});
		}
	})
}


// ======================  admin_delete_application  ===================== //
//delete
/***
Function: For Dlete Application for Admin
Params: 
		app_id

Process: 
		delete application from application_management table
		
*/
module.exports.admin_delete_application = (body, user) => {
    return new Promise((resolve, reject) => {
        try {
        	const role_id = user.role_id;
        	const app_id = body.app_id;
            if (role_id == 1) {
                if (app_id != '') {
                    if(app_id){
                        const search = `select * from application_management where application_id = '${app_id}'`;
                        client.query(search, (searcherr, searchress) => {
                            if(searcherr){
                                resolve(message.SOMETHINGWRONG);
                            }else{
                                if (searchress.rows == '') {
                                    resolve(message.DATANOTFOUND)
                                } else {
                                    const del = `delete from application_management where application_id = '${app_id}' `
                                    client.query(del, (delerr, delress) => {
                                        if (delerr) {
                                            resolve(message.SOMETHINGWRONG)
                                        } else {
                                           const applicationName = searchress.rows[0].application_name;
                                           redisClient.hdel('application',applicationName,function(err,redisdata){
                                           	console.log(redisdata)
												if(err){
													resolve(message.SOMETHINGWRONG);
												}else{
													if(redisdata == 1){
														resolve(message.APP)
													}else{
														resolve({'success':false,'message':'App not deleted'})
													}
												}
											})
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


// ===================== suepr_update_app =================== //
//Put
/***
Function: For update Application for Admin
Params: 
		applicationName
		icon
		selectedCountries
		selectedUser

Process: 
		select query from table application_management  table
		update data in application_management table
		redis database

*/
module.exports.admin_update_app = (body, user) => {
	return new Promise((resolve,reject)=>{
		try{
			const app_id = body.app_id;
		    const applicationName = body.applicationName;
		    const icon 	= body.icon;
			const selectedCountries = body.selectedCountries;
			const selectedUser 	= body.selectedUser;
		    const role_id = user.role_id;
			
		    if(applicationName != '' && icon != '' ){
			    if(role_id == 1){
			    	const match = `select * from application_management where application_id = '${app_id}'`;
			    	client.query(match, (matcherr, matchress) => {
			    		if(matcherr){
							resolve(message.SOMETHINGWRONG);
			    		}else{
			    			if(matchress.rows == ''){
								resolve(message.DATANOTFOUND)
			    			}else{
								const resdata = {
									applicationName:applicationName,
									icon:icon,
									selectedCountries:selectedCountries,
									selectedUser:selectedUser,
									status : matchress.rows[0].status,
									created_date:matchress.rows[0].created_date
								}
						   		const sql = `update application_management set 
						   					application_name='${applicationName}',
											icon ='${icon}',
											selected_countries='${selectedCountries}',
											selected_user='${selectedUser}' where application_id ='${app_id}' `;
								client.query(sql,(err,result)=>{
									if(err){
										resolve(message.ALREADYEMAIL)
									}else{

	                                	redisClient.hmset('application', applicationName, JSON.stringify(resdata), function (err, data) {
										    if(err){
										    	resolve(message.SOMETHINGWRONG);
										    }else{
										    	if(data == 'OK'){
											    	resolve(message.APPUPDATE);
										    	}else{
											    	resolve(message.APPNOTUPDATE);
										    	}
										    }
										})
									}
								})
			    			}
			    		}
			    	})
			    }else{
			    	resolve(message.NOTPERMISSION);
			    }
			}else{
		    	resolve(message.FILEDS);
			}
			
		}catch(error){
			resolve(error);
		}
	})
}

// ===================== admin_check_user =================== //
//post

module.exports.admin_check_user = (body, user) => {
	return new Promise((resolve,reject)=>{
		try{
		    const role_id = user.role_id;
			const token = body.token
			
		    if(token != ''){
			    // if(role_id == 1){
			    	resolve(user)
			    // 	const match = `select * from signup where user_id = '${user_id}'`;
			    // 	client.query(match, (matcherr, matchress) => {
			    // 		if(matcherr){
							// resolve(message.SOMETHINGWRONG);
			    // 		}else{
			    // 			// resolve(matchress.rows)
			    // 			if(matchress.rows == ''){
							// 	resolve({'success':false,'message': "Data not found"});
			    // 			}else{
			    // 				resolve(token)
							// 	// const user = matchress.rows[0].selected_user;
							// 	// const check = user.includes(user_id);

							// 	// if(check === true){

							// 	// 	resolve('check')
							// 	// }
							// 	// if(check === false){
							// 	// 	resolve('not')
							// 	// }
			    // 			}
			    // 		}
			    // 	})
			    // }else{
			    // 	resolve(message.NOTPERMISSION)
			    // }
			}else{
		    	resolve(message.FILEDS)
			}
			
		}catch(error){
			console.log(error)
		}
	})
}



module.exports.createUser = (body, user) => {
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
					const rollid 	  = '4';
					const created_by  = user.id;
					const device_type = 'null';
					const device_token= 'null';
					const app_user    = body.create_user;

					const appUser =  JSON.stringify(app_user);

		            if(fullname != '' && email != '' && password != '' && company != '' && address1 != '' && address2 != '' && country != '' && state != '' && city != '' && zipcode != '' ){
		                if(fullname && email != '' && password != '' && company != '' && address1 != '' && address2 != '' && country != '' && state != '' && city != '' && zipcode != '' ){
		                    const getemail = `select * from signup where email = '${email}'`;
		                    client.query(getemail, (emailerr, emaildataress) => {
		                        if (emaildataress.rows != '') {
		                            resolve(message.ALREADYUSE);
		                        } else {
		                        	// resolve('insert')
		                            const sql = `insert into signup(fullname,email,password,company,address1,address2,country,state,city,zipcode,status,created_by,created_date,role_id,device_type,device_token,app_user) values('${fullname}','${email}','${hash}','${company}','${address1}','${address2}','${country}','${state}','${city}','${zipcode}','${1}','${created_by}','${myDate}','${rollid}','${device_type}','${device_token}','${appUser}')RETURNING user_id`;
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
												role_id 	: '4',
												created_date: myDate,
												created_by 	: 'NONE',
												device_type  :device_type,
												device_token : device_token,
												app_user	 : appUser
											}


		                                	redisClient.hmset('user', email, JSON.stringify(redata), function (err, data) {
											    if(err){
											    	resolve(message.SOMETHINGWRONG);
											    }else{
											    	if(data == 'OK'){
												    	// resolve(message.REGISTRATION);
												    	// sendEmailToSignup(email, company, fullname);
											    		for(let appData of app_user){
											    			// const sqlAppmatch = `select * from app_user where status = '${0}'`
											    			const sqlApp = `insert into app_user(application_id,user_name,user_id,status) values('${appData.application_id}','${appData.user_name}','${userId}','${0}')RETURNING app_id`;
											
															client.query(sqlApp, (err1, res1) => {
																if (err1) {
																	resolve(message.SOMETHINGWRONG);
																}else{
																	const AppRedis = {
																		application_id : appData.application_id,
																		user_name	   : appData.user_name,
																		user_id		   : userId,
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



module.exports.AppUserApprove = (body, user) => {
	return new Promise((resolve,reject)=>{
		const role_id = user.role_id;
		const id = body.user_id;
		const userArray = body.create_user;
	    if(role_id == 1){
			for(let au of userArray){
    			const finduser = `select * from app_user where application_id = '${au.application_id}' and user_name = '${au.user_name}' `;
				client.query(finduser,(finderr,findress)=>{
					if(finderr){
						resolve(message.SOMETHINGWRONG)
					}else{
						const user_name = findress.rows[0].user_name;
						if(findress.rows != ''){
							const approveuser = `update app_user set status = '${0}' where  application_id = '${au.application_id}' and user_name = '${au.user_name}' `;
							client.query(approveuser, (approveerr,approveress)=>{
								if(approveerr){
									resolve(message.SOMETHINGWRONG)
								}else{
								let redata = {
		                        		app_id 			: findress.rows[0].app_id,
										application_id 	: findress.rows[0].application_id,
										user_name 		: findress.rows[0].user_name,
										user_id 		: findress.rows[0].user_id,
										status 			: findress.rows[0].status,
									}
									redisClient.hmset('app_user', user_name, JSON.stringify(redata), function (err, data) {
									    if(err){
									    	resolve(message.SOMETHINGWRONG)
									    }else{
									    	if(data == 'OK'){
									    		resolve(message.ACTIVEACCOUNT)
									    	}else{
									    		resolve(message.NOTACTIVEACCOUNT)
									    	}
									    }
									})
								}
							})						
						}else{
							resolve(message.DATANOTFOUND)
						}
					}
			 	})	
    		}
			    	
	   	}else{
		   	resolve(message.NOTPERMISSION)
	   	}
	})
}