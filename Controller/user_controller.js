const client 		= require('../db');
const bcrypt 		= require('bcrypt');
const jwt			= require('jsonwebtoken');
const moment 		= require('moment');
const date   		= new Date();
const myDate 		= moment(date).format('L');
const redis 		= require('redis');
const redisClient 	= redis.createClient(6379, 'localhost');
const message 		= require('../Helpers/message');
const cors          = require('cors');
const randomToken   = require('random-token');
const nodemailer 	= require('nodemailer');
const generator 	= require('generate-password');
const request = require('request');


// ======================= signup =========================== //
//post
/***
Function: For user singup by Admin
Params: 
		fullname
		email
		company
		address1
		address2
		country
		state
		city
		zipcode

Process: 
		select query from table signup  table
		insert data in signup table
		and email can't be duplicate
		send mail when user is create by admin

*/
var sendEmailToSignup = (email, company, fullname) => {
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
            subject: 'User create',
         
            html: '<div style="height: 35px; width: 100%; background-color: purple; text-align: center; color: white; padding-top: 15px; font-weight: bold;">NovusOne Team</div><br><br>Dear <b style="color:red">' + fullname + '</b> Administrator,<br><br>&nbsp;&nbsp;&nbsp;<p style="color:blue">You are created as user for '+company+' company.<br><br>Thank You <br>NovusOne team<br><br><br><div style="height: 45px; width: 100%; background-color: purple; text-align: center; color: white"></div>'
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log(info);
            }
        });
    });
}
module.exports.signup = (body) => {
    return new Promise((resolve, reject) => {
        try {
        	const role_id =  '4'; //user.role_id;
        	// if(role_id == 1){
				const password = body.password;

	        	bcrypt.hash(password,10,function(err,hash){
		    		const fullname = body.fullname;
					const email = body.email;
					const company = body.company;
					const address1 = body.address1;
					const address2 = body.address2;
					const country = body.country;
					const state = body.state;
					const city = body.city;
					const zipcode = body.zipcode;
					const rollid = '4';
					const created_by = ''; //user.id;
					const device_type = 'null';
					const device_token = 'null';
					const app_user = 'null';

		            if(fullname != '' && email != '' && password != '' && company != '' && address1 != '' && address2 != '' && country != '' && state != '' && city != '' && zipcode != '' ){
		                if(fullname && email != '' && password != '' && company != '' && address1 != '' && address2 != '' && country != '' && state != '' && city != '' && zipcode != '' ){
		                    const getemail = `select * from signup where email = '${email}'`;
		                    client.query(getemail, (emailerr, emailress) => {
		                        if (emailress.rows != '') {
		                            resolve(message.ALREADYUSE);
		                        } else {
		                            const sql = `insert into signup(fullname,email,password,company,address1,address2,country,state,city,zipcode,status,created_by,created_date,role_id,device_type,device_token,app_user) values('${fullname}','${email}','${hash}','${company}','${address1}','${address2}','${country}','${state}','${city}','${zipcode}','${1}','${created_by}','${myDate}','${rollid}','${device_type}','${device_token}','${app_user}')RETURNING user_id`;
		                            client.query(sql, (usererr, userress) => {
		                                if (usererr) {
		                                    resolve(message.SOMETHINGWRONG);
		                                } else {
	                                		let redata = {
				                        		user_id 	: userress.rows[0].user_id,
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
												status 		: '1',
												role_id 	: '4',
												created_date: myDate,
												created_by 	: 'NONE',
												device_type  :device_type,
												device_token : device_token,
												app_user	 : 	'null'
											}
		                                	redisClient.hmset('user', email, JSON.stringify(redata), function (err, data) {
											    if(err){
											    	resolve(message.SOMETHINGWRONG);
											    }else{
											    	if(data == 'OK'){
												    	resolve(message.REGISTRATION);
												    	sendEmailToSignup(email, company, fullname);
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

        	// }else{
        	// 	resolve(message.NOTPERMISSION)
        	// }
        } catch (error) {
	            resolve(message.ERROR); 
        }
    })
}

// ====================== userlogin ========================= //
//post
/***
Function: For user login for user
Params: 
		email
		password
		device_type
		device_token

Process: 
		first data select redis cache whend database is not connected
		and connected also run login
		select query from table signup table
		update singn table 
		redis database also
*/
module.exports.login = (body) => {
    return new Promise((resolve, reject) => {
    	try{
    			const email = body.email;
				const password = body.password;
				const device_type = body.device_type;
				const device_token = body.device_token;

	        if (email != '' && password != '') {
	            if(email && password){
		            if(client._connected == false){
		            	redisClient.hget('user', email, function (err, reply){
		            		const data = JSON.parse(reply)
		            		if(reply == null){
		                        resolve(message.INVALIDEMAIL);
		            		}else{
			            		bcrypt.compare(password, data.password.trim(), (err, isMatch) => {
			            			if (isMatch == true) {
			            				 var token = jwt.sign({
	                                            id: data.user_id,
	                                            email: data.email,
	                                            role_id : data.role_id,
	                                            company:data.company,
	                                            status:data.status
	                                        }, 'secret', {
	                                            expiresIn: "12hr"
	                                        });
	                                    const userdata = {
	                                    	"id": data.user_id,
	                                       "fullname":data.fullname ,
										    "email": data.email,
										    "company":data.company,
										    "address1": data.address1,
										    "address2": data.address2,
										    "country":data.country ,
										    "state": data.state,
										    "city": data.city,
										    "zipcode": data.zipcode,
										    "rollid":data.role_id
	                                    }
	                                    const tokenData = {
	                                        'success': true,
	                                        'message': "User Log in successfully",
	                                        'Status': 200,
	                                        'token': token,
	                                        'data': userdata
	                                    }
	                                    resolve(tokenData)
	        
			            			}else{
	                        			resolve(message.PASSWORD)
			            			}
			            		})
		            		}
		            	})
		            }else{
		                const login = `select * from signup where trim(email) = '${email}'`;
		                client.query(login, (err, result) => {
		                    if (result.rows == '') {
		                        resolve(message.INVALIDEMAIL)
		                    } else {
		                        if (result.rows[0].status == 0) {
		                            for (let key of result.rows) {
		                                const role_id = key.role_id;
	                                    if (key) {
	                                        bcrypt.compare(password, key.password.trim(), (err, isMatch) => {
	                                            if (isMatch == true) {
	                                                var token = jwt.sign({
	                                                    id: key.user_id,
	                                                    email: key.email,
	                                                    role_id : key.role_id,
	                                                    company:key.company,
	                                                    status:key.status
	                                                }, 'secret', {
	                                                    expiresIn: "12hr"
	                                                });
	                                                redisClient.hget('user', email, function (err, reply){
									            		const data = JSON.parse(reply)
									            		// resolve(data)
									            		if(reply == null){
									                        resolve(message.INVALIDEMAIL);
									            		}else{
										            		bcrypt.compare(password, key.password.trim(), (err, isMatch) => {
										            			if (isMatch == true) {
					                                                const userdata = {
					                                                	"id": key.user_id,
				                                                       "fullname":data.fullname ,
																	    "email": data.email,
																	    "company":data.company,
																	    "address1": data.address1,
																	    "address2": data.address2,
																	    "country":data.country ,
																	    "state": data.state,
																	    "city": data.city,
																	    "zipcode": data.zipcode,
																	    "rollid":data.role_id
					                                                }
					                                                const tokenData = {
					                                                    'success': true,
					                                                    'message': "User Log in successfully",
					                                                    'Status': 200,
					                                                    'token': token,
					                                                    'data': userdata
					                                                }
					                                                resolve(tokenData)
					                                                let redata = {
																	   	fullname:data.fullname,
																		company :data.company,
																		address1:data.address1,
																		address2:data.address2,
																		country :data.country,
																		state 	:data.state,
																		city 	:data.city,
																		zipcode :data.zipcode,
																		email   :data.email,
																		password:data.password,
																		status  :data.status,
																		role_id :data.role_id,
																		user_id :data.user_id,
																		created_date :data.created_date,
																		created_by :data.created_by,
																		device_type :device_type,
																		device_token :device_token

																	}
															   		const sql = `update signup set device_type='${device_type}',device_token ='${device_token}' where user_id ='${data.user_id}'`;
																	client.query(sql,(err,result)=>{
																		if(err){
																			resolve(message.ALREADYEMAIL);
																		}else{

										                                	redisClient.hmset('user', email, JSON.stringify(redata), function (err, data) {
																			    if(err){
																			    	resolve(message.SOMETHINGWRONG);
																			    }else{
																			    	if(data == 'OK'){
																				    	resolve(message.PROFILEUPDATE)
																			    	}else{
																				    	resolve(message.NOTUPDATE)
																			    	}
																			    }
																			})
																		}
																	})
										            			}else{
		                                                			resolve(message.PASSWORD)
										            			}
										            		})
									            		}
									            	})
	                                            } else {
	                                                resolve(message.PASSWORD)
	                                            }
	                                        });
	                                    } else {
	                  
	                                        resolve(message.ACCOUNT)
	                                    }
		                            }
		                        } else {
		                        	if(result.rows[0].status == 2){
		                        		resolve({'success':false,'message':'User requested disapprove'});
		                        	}else{
		                        		resolve({'success':false,'message':'Your requested not approve'});
		                        	}
		                        }
		                    }
		                })
		            }
	            } else {
	                resolve(message.PARAMETES)
	            }
	        } else {
	            resolve(message.FILEDS)
	        }
    	}catch(error){
	        resolve(message.ERROR)
    	}
    })
}

// ====================== userlogin ========================= //
//post
/***
Function: For superlogin for admin 
Params: 
		email
		password


Process: 
		first data select redis cache whend database is not connected
		and connected also run login
		select query from table supertbl table
		and genreted token
		redis database also
*/
module.exports.superlogin = (email, password) => {
    return new Promise((resolve, reject) => {
    	try{
	        if (email != '' && password != '') {
	            if(email && password){
	            	
	                const superlogin = `select * from supertbl where trim(email) = '${email}'`;
	                client.query(superlogin, (supererr, superresult) => {
	                    if (superresult.rows != '') {
	                        if (superresult.rows[0].status == 0 && superresult.rows[0].role_id == 1) {
	                            for (let key of superresult.rows) {
                                    if (key) {
                                        bcrypt.compare(password, key.password.trim(), (err, isMatch) => {
                                            if (isMatch == true) {
                                                var token = jwt.sign({
                                                    id: key.super_id,
                                                    email: key.email,
                                                    role_id : key.role_id
                                                }, 'secret', {
                                                    expiresIn: "12hr"
                                                });
                                                redisClient.hget('super', email, function (err, reply){
								            		const data = JSON.parse(reply)
								            		// resolve(data)
								            		if(reply == null){
								                        resolve(message.INVALIDEMAIL);
								            		}else{
									            		bcrypt.compare(password, key.password.trim(), (err, isMatch) => {
									            			if (isMatch == true) {
				                                                const superdata = {
				                                                	"id":key.super_id,
			                                                       "fullname":data.fullname ,
																    "email": data.email,
																    "zipcode": data.zipcode,
																    "role_id":data.role_id,
																    "status":data.status,
																    "created_date":data.created_date
				                                                }
				                                                const tokenData = {
				                                                    'success': true,
				                                                    'message': "Superadmin Log in successfully",
				                                                    'Status': 200,
				                                                    'token': token,
				                                                    'data': superdata
				                                                }
				                                                resolve(tokenData)
									            			}else{
	                                                			resolve(message.PASSWORD)
									            			}
									            		})
								            		}
								            	})
                                            } else {
                                                resolve(message.PASSWORD)
                                            }
                                        });
                                    } else {
                  
                                        resolve(message.ACCOUNT)
                                    }
	                            }
	                        } else {
	                            resolve(message.USERCREATE);
	                        }
	                    } else {
	                        //resolve(message.INVALIDEMAIL)

	                        /**** Login with Admin ****/
	                        const checkAdmin = `select * from signup where trim(email) = '${email}' and role_id = '${2}' and status = '${0}'`;
		                    client.query(checkAdmin, (adminerr, adminresult) => {
		                        if (adminresult.rows != '') {
		                            bcrypt.compare(password, adminresult.rows[0].password.trim(), (err, isMatch) => {
		                                if (isMatch == true) {
		                                    var token = jwt.sign({
		                                        id: adminresult.rows[0].user_id,
		                                        email: adminresult.rows[0].email,
		                                        role_id: adminresult.rows[0].role_id
		                                    }, 'secret', {
		                                        expiresIn: "12hr"
		                                    });
		                                    redisClient.hget('user', email, function(err, reply) {
		                                        const data = JSON.parse(reply)
		                                        if (reply == null) {
		                                            resolve(message.INVALIDEMAIL);
		                                        } else {
		                                            bcrypt.compare(password, adminresult.rows[0].password.trim(), (err, isMatch) => {
		                                                if (isMatch == true) {
		                                                    const appuser = `select * from application_management where application_id = '${adminresult.rows[0]. access_application_id}' and status = '${0}'`;                                                    
		                                                    client.query(appuser, (apperr, appress) => {
		                                                        if (apperr) {
		                                                            resolve(message.SOMETHINGWRONG);
		                                                        } else {
		                                                            if (appress.rows == '') {
		                                                                resolve(message.DATANOTFOUND);
		                                                            } else {
		                                                                appdata = {
		                                                                    'app_id': appress.rows[0].application_id,
		                                                                    'app_name': appress.rows[0].application_name.trim(),
		                                                                    'app_icon': appress.rows[0].icon.trim(),
		                                                                    'selected_countries': appress.rows[0].selected_countries.trim(),
		                                                                    'status': appress.rows[0].status,
		                                                                     'users_id':appress.rows[0].selected_user, //todo changes
		                                                                    'created_date': appress.rows[0].created_date,
		                                                                    'application_id': '',
		                                                                }

		                                                                redisClient.hget('application', appress.rows[0].application_name, function(err1, redress1) {
		                                                                    if (err1) {
		                                                                        resolve(message.SOMETHINGWRONG);
		                                                                    } else {
		                                                                        const Admindata = {
		                                                                            "id": adminresult.rows[0].user_id,
		                                                                            "fullname": adminresult.rows[0].fullname.trim(),
		                                                                            "email": adminresult.rows[0].email.trim(),
		                                                                            "zipcode": adminresult.rows[0].zipcode.trim(),
		                                                                            "role_id": adminresult.rows[0].role_id,
		                                                                            "status": adminresult.rows[0].status,
		                                                                            "created_date": adminresult.rows[0].created_date.trim(),
		                                                                            'application_id': appdata.app_id,
		                                                                            'application_data': appdata
		                                                                        }
		                                                                        const tokenData = {
		                                                                            'success': true,
		                                                                            'message': "Admin Log in successfully",
		                                                                            'Status': 200,
		                                                                            'token': token,
		                                                                            'data': Admindata
		                                                                        }
		                                                                        resolve(tokenData)
		                                                                    }
		                                                                })
		                                                            }
		                                                        }
		                                                    })


		                                                } else {
		                                                    resolve(message.PASSWORD)
		                                                }
		                                            })
		                                        }
		                                    })
		                                } else {
		                                    resolve(message.PASSWORD)
		                                }
		                            });
		                        } else {
		                            resolve(message.INVALIDEMAIL)

		                        }
		                    })

	                        /*** End admin ***/

	                    }
	                })
	            } else {
	                resolve(message.PARAMETES)
	            }
	        } else {
	            resolve(message.FILEDS)
	        }
    	}catch(error){
	        resolve(message.ERROR)
    	}
    })
}


// =====================  user_profile  ======================= //
//get
/***
Function: For User Profile for user 
Params: 
		no params

Process: 
		select query from table signup table
		and show profile of user
		redis database also
*/
module.exports.user_profile = (user) => {
	return new Promise((resolve,reject)=>{
		const role_id = user.role_id;
		const id = user.id;
		const email = user.email;
	   if(role_id == 4){
		   	const sql = `select * from signup where user_id = '${id}' `;
			client.query(sql,(err,ress)=>{
				if(err){
					resolve(message.SOMETHINGWRONG)
				}else{
					if(ress.rows != ''){
						const data = [];
						for(let key of ress.rows){
							var userprofile = {
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
							};
							data.push(userprofile)
						}
						redisClient.hget('user', email, function (err, reply){
		            		const data1 = JSON.parse(reply)
		            		if(err){
								resolve(message.SOMETHINGWRONG)		
		            		}else{
								const Data = {
									"success":true,
									"data":data
								}
								resolve(Data)

		            		}
		            	})
					}else{
						resolve(message.USERPROFILE)
					}
				}
		 	})
	   	}else{
		   	resolve(message.NOTPERMISSION)
	   	}
	})
}


// ===================== user_update_profile =================== //
//Put
/***
Function: For User Update Profile by admin 
Params: 
		fullname
		company
		address1
		address2
		country
		state
		city
		zipcode

Process: 
		select query from table signup table
		and match data
		and update data after match
		redis database also
*/
module.exports.user_update_profile = (user,body) => {
	return new Promise((resolve,reject)=>{
		try{
		    const user_id	= user.id;
		    const role_id 	= user.role_id;
		    const email 	= user.email;
		    const fullname 	= body.fullname;
			const company 	= body.company;
			const address1 	= body.address1;
			const address2 	= body.address2;
			const country 	= body.country;
			const state 	= body.state;
			const city 		= body.city;
			const zipcode 	= body.zipcode;
		    if(fullname != '' && company != '' && address1 != '' && address2 != '' && country != '' && state != '' && city != '' && zipcode != '' ){
			    if(role_id == 4){
			    	const match = `select * from signup where user_id = '${user_id}' and email = '${email}'`;
			    	client.query(match, (matcherr, matchress) => {
			    		if(matcherr){
			    			const errMessage = {
								"success":false,
								'message':'Something went wrong1'
							}
							resolve(errMessage)
			    		}else{
			    			if(matchress.rows == ''){
								resolve(message.DATANOTFOUND);
			    			}else{
								let redata = {
								   	fullname:fullname,
									company :company,
									address1:address1,
									address2:address2,
									country :country,
									state 	:state,
									city 	:city,
									zipcode :zipcode,
									email:matchress.rows[0].email,
									password:matchress.rows[0].password,
									status  :matchress.rows[0].status,
									role_id :matchress.rows[0].role_id,
									user_id :matchress.rows[0].user_id,
									created_date  :matchress.rows[0].created_date,
									created_by :matchress.rows[0].created_by

								}
								// resolve(redata)
						   		const sql = `update signup set 
						   					fullname='${fullname}',
											company ='${company}',
											address1='${address1}',
											address2='${address2}',
											country ='${country}',
											state 	='${state}',
											city 	='${city}',
											zipcode ='${zipcode}' where user_id ='${user_id}' `;
								client.query(sql,(err,result)=>{
									if(err){
										resolve(message.ALREADYEMAIL);
									}else{

	                                	redisClient.hmset('user', email, JSON.stringify(redata), function (err, data) {
										    if(err){
										    	resolve(message.SOMETHINGWRONG);
										    }else{
										    	if(data == 'OK'){
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
			resolve(error)
		}
	})
}

// ======================  user_change_password  ================ //
//Post
/***
Function: For user Change password for user
Params: 
		oldpassword
		newpassword

Process: 
		 search data from signup by token (select query)
		 then match and update new password (update query)
		 redis database also  
*/
module.exports.user_change_password = (user,body) => {
	return new Promise((resolve,reject)=>{
	    const id  		  = user.id;
	    const role_id 	  = user.role_id;
	    const oldpassword = body.oldpassword;
	    const newpassword = body.newpassword;
	   if(oldpassword != '' && newpassword != ''){
		    if(role_id == 4){
			    bcrypt.hash(newpassword,10,function(err,hash){
			    	const checkuser = `select * from signup where user_id = '${id}'`;
			    	client.query(checkuser,(checkusererr,checkuserress)=>{
			    		const cpass = checkuserress.rows[0].password; 
			    		if(checkusererr){
			    			resolve(message.SOMETHINGWRONG);
			    		}else{
			    			if(checkuserress.rows == ''){
			    				resolve(message.DATANOTFOUND);
			    			}else{
				    			if(bcrypt.compareSync(oldpassword, cpass.trim())){
								 	const changepass = `update signup set password = '${hash}' where user_id ='${id}' `;
									client.query(changepass,(changepasserr,changepassress)=>{
										if(changepasserr){
											resolve(message.SOMETHINGWRONG);
										}else{
											const email = checkuserress.rows[0].email;
											let redata = {
											   	fullname:checkuserress.rows[0].fullname,
												company :checkuserress.rows[0].company,
												address1:checkuserress.rows[0].address1,
												address2:checkuserress.rows[0].address2,
												country :checkuserress.rows[0].country,
												state 	:checkuserress.rows[0].state,
												city 	:checkuserress.rows[0].city,
												zipcode :checkuserress.rows[0].zipcode,
												email:email,
												password:hash,
												status  :checkuserress.rows[0].status,
												role_id :checkuserress.rows[0].role_id,
												user_id :checkuserress.rows[0].user_id,
												created_date  :checkuserress.rows[0].created_date,
												created_by :checkuserress.rows[0].created_by

											}
											redisClient.hmset('user', email, JSON.stringify(redata), function (err, data) {
											    if(err){
											    	resolve(message.SOMETHINGWRONG);
											    }else{
											    	if(data == 'OK'){
														resolve(message.CHANGEPASSWORD);
											    	}else{
												    	resolve({'success':false,'message':'Password not change'});
											    	}
											    }
											})
										}
									})
							  	}else{
									resolve(message.CORRECTPASSWORD);
							  	}
			    			}
			    		}
			    	})
				})
			}else{
				resolve(message.NOTPERMISSION);
			}
		}else{
			resolve(message.FILEDS);
		}
	})
}

// =====================  user_forget_password  ======================= //
//post
/***
Function: For User Forget Password by user
Params: 
		email

Process: 
		 search data from signup by email (select query)
		 then match and update new password (update query)
		 and send a password in your mail box for your email 
		 redis database also  
*/
var sendEmailToCustomer = (email, password, first_name) => {
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

            html: '<div style="height: 35px; width: 100%; background-color: purple; text-align: center; color: white; padding-top: 15px; font-weight: bold;">NovusOne</div><br><br>Hello <b style="color:red">'+first_name+'</b>,<br><br>&nbsp;&nbsp;&nbsp;You recently requested to reset your password for your <b style="color:red;">'+email+'</b> account <br><br>Password : ' + password +'<br><br><div style="height: 45px; width: 100%; background-color: purple; text-align: center; color: white"></div>'
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            }
            console.log(info);
        });
    });
}

module.exports.user_forget_password = (email) => {
    return new Promise((resolve, reject) => {
        try {
            if (email != '') {
                if(email){
                    var pass = randomToken(16);
                    const matchemail = `select * from signup where email = '${email}'`;
                    client.query(matchemail, (matchemailerr, matchress) => {
                        if (matchemailerr) {
                            const errMessage = {
                                "success": false,
                                'message': 'Something went wrong'
                            }
                            resolve(errMessage)
                        } else {
                            if(matchress.rows == ''){
                                const errMessage = {
                                    'success':false,
                                    'message':'Invalid email ID'
                                }
                                resolve(errMessage)
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
		                                var first_name = matchress.rows[0].fullname; 
		                                const updatedata = `update signup set password = '${hash}' where email = '${email}' `;
		                                client.query(updatedata, (updatedataerr, result1) => {
		                                    if (updatedataerr) {
		                                        resolve(message.SOMETHINGWRONG);
		                                    } else {
		                                    		let redata = {
													   	fullname:fullname,
														company :company,
														address1:address1,
														address2:address2,
														country :country,
														state 	:state,
														city 	:city,
														zipcode :zipcode,
														email:matchress.rows[0].email,
														password:matchress.rows[0].password,
														status  :matchress.rows[0].status,
														role_id :matchress.rows[0].role_id,
														user_id :matchress.rows[0].user_id,
														created_date  :matchress.rows[0].created_date,
														created_by :matchress.rows[0].created_by

													}
													redisClient.hmset('user', email, JSON.stringify(redata), function (err, data) {
												    if(err){
												    	resolve(message.SOMETHINGWRONG);
												    }else{
												    	if(data == 'OK'){
					                                        resolve(message.MAIL_SEND);
												    	}else{
													    	resolve(message.UNREGISTRATION);
												    	}
												    }
												})
		                                    }
		                                })
		                                sendEmailTosuper(email, password, first_name);
	                            	})
                            	})
                            }
                        }
                    })
                } else {
                    const errMessage = {
                        'success':false,
                        'message':'Give correct parameters'
                    }
                    resolve(errMessage)
                }
            } else {
                const errMessage = {
                    "success": false,
                    "message": "Please fill your email"
                }
                resolve(errMessage)
            }
        } catch (error) {
            resolve(error)
        }
    })
}



module.exports.ValidateUser = (body) => {
    return new Promise((resolve, reject) => {
       try {    		
    		const URL = 'http://137.117.80.211/node/express/myapp/api/login';
			var options = {
			url: URL,
			method: 'POST',
			form: {
					"UserName": body.UserName,
				  }
			};

			request(options, (error, response, body)=>{
				if (error) {
					resolve(message.SOMETHINGWRONG);
				}else{
					const result = JSON.parse(body)
					resolve(result);
				}
			});

		 } catch (error) {
            const errMessage = {
                'status': false,
                'message': error
            }
            resolve(errMessage);
        }

    })
}