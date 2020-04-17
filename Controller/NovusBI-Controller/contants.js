const client 		= require("../../db");
const message 		= require("../../Helpers/message");
const redis 	    = require('redis');
const moment 		= require('moment');
const date   		= new Date();
const myDate 		= moment(date).format('l');
const redisClient   = redis.createClient(6379, 'localhost');

/*** Create Contant ***/
module.exports.createContant = (user, info) => {
	return new Promise((resolve, reject) => {
		try{
			if (user.role_id == 1) {
				const contantdat1 = info.content;
				const contantdat = JSON.stringify(info.content);
				if(contantdat1[0].name == "" || info.category == ""){
					const Chkcontant = `SELECT * FROM bi_contant WHERE title = '${info.title}'`;
					client.query(Chkcontant, (err1, res1) => {
						if(err1){
							resolve(message.SOMETHINGWRONG);
						}else{
							const cat_value =  info.category
							if (res1.rows == '') {	
							    const sql = `INSERT INTO bi_contant(title,contant,type,categories,date,author,higlight,resume,comment,updated_at,status,created_by,pdf,categories_name,thumbnail,created_at,region) VALUES ('${info.title}','${contantdat}','${info.type}','${cat_value}','${info.date}','${info.author}','${info.heighlight}','${info.resume}','${info.comment}','${myDate}','${'draft'}','${user.id}','${info.pdf}','${info.categories_name}','${info.thumbnail}','${myDate}','${info.region}')RETURNING contant_id`;
							    client.query(sql, (error, result) => {
									if(error){
										resolve(message.SOMETHINGWRONG);
									}else{
										if (result != '') {
											const redata = {
												contant_id	  : result.rows[0].contant_id,
												title  		  : info.title,
												contant  	  : cat_value,
												type  		  : info.type,
												categories    : info.categories,
												date  		  : info.date,
												author 		  : info.author,
												higlight 	  : info.heighlight,
												resume 		  : info.resume,
												comment 	  : info.comment,
												status	      : 'draft',
												created_by    : user.id,
												pdf			  : info.pdf,
												categories_name: info.categories_name,
												thumbnail 	  : info.thumbnail,
												created_at 	  : myDate,
												region		  : info.region,
											}
											redisClient.hmset('bi_contant', info.title, JSON.stringify(redata), function (err, data) {
											    if(err){
											    	resolve(message.SOMETHINGWRONG);
											    }else{
											    	if(data == 'OK'){
												    	resolve(message.CREATEDSUCCESS);
											    	}else{
												    	resolve(message.SOMETHINGWRONG);
											    	}
											    }
											})
										}else{
											resolve(message.NOTCREATED);
										}
									}
								})
							}else{
								resolve(message.ALREADYEXISTS);
							}
						}	
					});
				}else {
					const Chkcontant = `SELECT * FROM bi_contant WHERE title = '${info.title}'`;
				
					client.query(Chkcontant, (err1, res1) => {
						if(err1){
							resolve(message.SOMETHINGWRONG);
						}else{
							const cat_value =  info.category
							if (res1.rows == '') {	
								// resolve(info)
							    const sql = `INSERT INTO bi_contant(title,contant,type,categories,date,author,higlight,resume,comment,updated_at,status,created_by,pdf,categories_name,thumbnail,created_at,region) VALUES ('${info.title}','${contantdat}','${info.type}','${cat_value}','${info.date}','${info.author}','${info.heighlight}','${info.resume}','${info.comment}','${myDate}','${'pending'}','${user.id}','${info.pdf}','${info.categories_name}','${info.thumbnail}','${myDate}','${info.region}')RETURNING contant_id`;
							    client.query(sql, (error, result) => {
									if(error){
										console.log(sql)
										resolve(message.SOMETHINGWRONG);
									}else{
										if (result != '') {
											const redata = {
												contant_id	  : result.rows[0].contant_id,
												title  		  : info.title,
												contant  	  : cat_value,
												type  		  : info.type,
												categories    : info.categories,
												date  		  : info.date,
												author 		  : info.author,
												higlight 	  : info.heighlight,
												resume 		  : info.resume,
												comment 	  : info.comment,
												status	      : 'pending',
												created_by    : user.id,
												pdf			  : info.pdf,
												categories_name: info.categories_name,
												thumbnail 	  : info.thumbnail,
												created_at 	  : myDate,
												region 		  : info.region,
											}
											redisClient.hmset('bi_contant', info.title, JSON.stringify(redata), function (err, data) {
											    if(err){
											    	resolve(message.SOMETHINGWRONG);
											    }else{
											    	if(data == 'OK'){
												    	resolve(message.CREATEDSUCCESS);
											    	}else{
												    	resolve(message.SOMETHINGWRONG);
											    	}
											    }
											})
										}else{
											resolve(message.NOTCREATED);
										}
									}
								})
							}else{
								resolve(message.ALREADYEXISTS);
							}
						}	
					});
				}

			}else{
				resolve(message.PERMISSIONERROR);
			}			
		}catch(error){
			resolve(error);
		}
	})
}


/*** Contant list ***/
module.exports.contants = (user, info) => {
	return new Promise((resolve, reject) => {
		try{
			const role_id = user.role_id;
			const arr2 = [];
			const arr3  = [];
			if(role_id == 1 || role_id == 2 || role_id == 4){
				if(info.cat_id != ''){
					const searchcat = `select * from bi_contant`;
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
									const successmessage = {
													'status': true,
													'data':arr2
												}
									// resolve(successmessage);
								}
		//===========================================================================================
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
									                                       		if(catdata.status != 'trace'){
									                                       			arr3.push(catdata)
									                                       		}else{
									                                       			arr3.push('already deleted');
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
															}
													 	}	
													})
												}
											})
										}else{
											resolve(message.USERNOTFOUND)
										}
									}
								})
//============================================================================================
							}
						}
					})
				}else {
					const arrtrace = [];
					const searchcat = `select * from bi_contant ORDER BY contant_id DESC`;
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

/*** Update Contant ***/
module.exports.updateContant = (user, info) => {
	return new Promise((resolve, reject) => {
		try{
			if (user.role_id > 2) {
				resolve(message.PERMISSIONERROR);
			}else{	
				const contantdat = JSON.stringify(info.content);
				const cat_value =  info.category
				const checksql = `SELECT * FROM bi_contant WHERE contant_id = '${info.contant_id}'`;
				client.query(checksql, (err, res) =>{
					if (err) {
						resolve(message.SOMETHINGWRONG);
					}else{
						if (res.rows != '') {
							const today = new Date();
							const sql  = `delete from bi_contant where contant_id = '${res.rows[0].contant_id}'`;
							client.query(sql, (error, result) =>{
								if (error) {
									resolve('something went wrong 1');
								}else{
									const updatecontantdata = `INSERT INTO bi_contant(contant_id,title,contant,type,categories,date,author,higlight,resume,comment,updated_at,status,created_by,pdf,categories_name,thumbnail,created_at,region) VALUES ('${info.contant_id}','${info.title}','${contantdat}','${info.type}','${cat_value}','${info.date}','${info.author}','${info.heighlight}','${info.resume}','${info.comment}','${myDate}','${'pending'}','${user.id}','${info.pdf}','${info.categories_name}','${info.thumbnail}','${myDate}','${info.region}')RETURNING contant_id`;
									// console.log(updatecontantdata)
							    client.query(updatecontantdata, (updateerror, updateresult) => {
									if(updateerror){
										resolve('something went wrong 2');
									}else{
										if (result != '') {
											const redata = {
												contant_id	  : info.contant_id,
												title  		  : info.title,
												contant  	  : cat_value,
												type  		  : info.type,
												categories    : info.categories,
												date  		  : info.date,
												author 		  : info.author,
												higlight 	  : info.heighlight,
												resume 		  : info.resume,
												comment 	  : info.comment,
												status	      : 'pending',
												created_by    : user.id,
												pdf			  : info.pdf,
												categories_name: info.categories_name,
												thumbnail 	  : info.thumbnail,
												region 		  : info.region,
											}
											redisClient.hmset('bi_contant', info.title, JSON.stringify(redata), function (err, data) {
											    if(err){
											    	resolve(message.SOMETHINGWRONG);
											    }else{
											    	if(data == 'OK'){
												    	resolve(message.UPDATEDSUCCESS);
											    	}else{
												    	resolve(message.SOMETHINGWRONG);
											    	}
											    }
											})
										}else{
											resolve(message.NOTCREATED);
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
		}catch(error){
			resolve(error)
		}
	})
}


/***  Delete Contant ***/
module.exports.deleteContant = (user, info) => {
	return new Promise((resolve, reject) => {
		try{
			const contant_id = info.contant_id
			if (user.role_id > 2) {
				resolve(message.PERMISSIONERROR);
			}else{
				if(contant_id != ''){
					const deldata = `select * from bi_contant where contant_id = '${contant_id}'`;
					client.query(deldata, (deldataerr, deldataress) =>{
						if(deldataerr){
							resolve(message.SOMETHINGWRONG);
						}else{
							if(deldataress.rows != ''){
								if(deldataress.rows[0].status == 'trace'){
									const deltetrace = `delete from bi_contant where contant_id = '${contant_id}'`
									client.query(deltetrace, (traceerr, traceress)=>{
										if(traceerr){
											resolve(message.SOMETHINGWRONG);
										}else{
											resolve(message.DELETEDSUCCESS);
										}
									})
								}else{
									const sql  = `update bi_contant set status = '${'trace'}' where contant_id = '${contant_id}'`;
									client.query(sql, (error, result) =>{
										if (error) {
											resolve(message.SOMETHINGWRONG);
										}else{
											const contant_title = deldataress.rows[0].title.trim();
				                            redisClient.hdel('bi_contant',contant_title,function(err,redisdata){
												if(err){
													resolve(message.SOMETHINGWRONG);
												}else{
													if(redisdata == 1){
														const redata = {
															contant_id	  : deldataress.rows[0].contant_id,
															title  		  : deldataress.rows[0].title,
															contant  	  : deldataress.rows[0].contant,
															type  		  : deldataress.rows[0].type,
															categories    : deldataress.rows[0].categories,
															date  		  : deldataress.rows[0].date,
															author 		  : deldataress.rows[0].author,
															higlight 	  : deldataress.rows[0].heighlight,
															resume 		  : deldataress.rows[0].resume,
															comment 	  : deldataress.rows[0].comment,
															status	      : 'trace',
															deleted_by    : user.id,
															pdf			  : deldataress.rows[0].pdf
														}
														redisClient.hmset('bi_contant', info.title, JSON.stringify(redata), function (err, data) {
														    if(err){
														    	resolve(message.SOMETHINGWRONG);
														    }else{
														    	if(data == 'OK'){
																	resolve(message.DELETEDSUCCESS);
														    	}else{
															    	resolve(message.SOMETHINGWRONG);
														    	}
														    }
														})
													}else{
														resolve(message.NORDELETED);
													}
												}
											})
										}
									})
									
								}
							}else{
								resolve(message.DATANOTFOUND);
							}
						}
					})
				}else {
					resolve(message.FILEDS);
				}
			}
		}catch(error){
			resolve(error)
		}
	})
}

/***  Active Content  **/
module.exports.active_content = (user, body) => {
	return new Promise((resolve, reject) => {
		try{
			const role_id 	= user.role_id;
			const contant_id = body.contant_id;

			if(role_id == 1){
				if(contant_id != ""){
					const searchcontent = `select * from bi_contant where contant_id = '${contant_id}' `
					client.query(searchcontent, (contenterr, contentress) => {
						if(contenterr){
							resolve(message.SOMETHINGWRONG);
						}else {
							if(contentress.rows == ''){
								resolve(message.DATANOTFOUND);
							}else {
								// resolve(contentress.rows)
								const contantupdate = `update bi_contant set status = '${'active'}' where contant_id = '${contant_id}' `
								client.query(contantupdate, (contanterr, contantress) => {
									if(contanterr){
										resolve(message.SOMETHINGWRONG)
									}else{
										// resolve(message.UPDATEDSUCCESS);
										const redata = {
											contant_id	  : contentress.rows[0].contant_id,
											title  		  : contentress.rows[0].title,
											contant  	  : contentress.rows[0].contant,
											type  		  : contentress.rows[0].type,
											categories    : contentress.rows[0].categories,
											date  		  : contentress.rows[0].date,
											author 		  : contentress.rows[0].author,
											higlight 	  : contentress.rows[0].heighlight,
											resume 		  : contentress.rows[0].resume,
											comment 	  : contentress.rows[0].comment,
											status	      : 'trace',
											deleted_by    : user.id,
											pdf			  : contentress.rows[0].pdf
										}
										redisClient.hmset('bi_contant', info.title, JSON.stringify(redata), function (err, data) {
										    if(err){
										    	resolve(message.SOMETHINGWRONG);
										    }else{
										    	if(data == 'OK'){
													resolve(message.DELETEDSUCCESS);
										    	}else{
											    	resolve(message.SOMETHINGWRONG);
										    	}
										    }
										})
									}
								})
							}
						}
					})   
				}else{
					resolve(message.FILEDS);
				}
			}else {
				resolve(message.NOTPERMISSION);
			}
		}catch(error){
			resolve(error)
		}
	})
}

/** Trash contant list ***/
module.exports.tracecontant_list = (user, body) =>{
	return new Promise((resolve, reject)=>{
		try{
			const role_id = user.role_id;
			const tracearry = [];

			if(role_id == 1){
				const searchtrace = `select * from bi_contant where status = '${'trace'}'`;
				client.query(searchtrace, (searcherr, searchress) =>{
					if(searcherr){
						resolve(message.SOMETHINGWRONG);
					}else{
						if(searchress.rows == ''){
							resolve(message.DATANOTFOUND);
						}else{
							for(let keydata of searchress.rows){
								tracearry.push(keydata);
							}
							redisClient.hgetall('bi_contant', function (err, data) {
							    if(err){
							    	resolve(message.SOMETHINGWRONG);
							    }else{
									const successmessage = {
										'status':true,
										'data':tracearry
									}
									resolve(successmessage)
							    }
							})
						}
					}
				})
			}
		}catch(error){
			resolve(error)
		}
	})
}

/** latestArtical ***/
module.exports.latestArtical = (user) => {
	return new Promise((resolve, reject) => {
		try{
			if (user.role_id == 1 || user.role_id == 2 ||user.role_id == 4 ) {
				// console.log(user)
				const arrtrace = [];

				const searchcat = `select * from bi_contant ORDER BY contant_id DESC limit 10`;
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
							redisClient.hgetall('bi_contant', function (err, data) {
							    if(err){
							    	resolve(message.SOMETHINGWRONG);
							    }else{
							    	// JSON.parse(data.title3)
									// resolve(data)
									const successmessage = {
										'status': true,
										'data': arrtrace
									}
									resolve(successmessage);
							    }
							})
						}
					}
				})
			}else{
				resolve(message.PERMISSIONERROR);
			}
		}catch(error){
			console.log(error)
		}
	})
}

//================ content show region wise =========================

module.exports.contentRegion = (user,body) => {
	return new Promise((resolve, reject) => {
		try{
			const arr2 = [];
			if (user.role_id == 1 || user.role_id == 2 ||user.role_id == 4 ) {
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
									 			// resolve(regionResult.rows)
									 		if(body.region_id != ''){
												const searchcat = `select * from bi_contant`;
												client.query(searchcat, (searchcaterr, searchcatress) => {
													if(searchcaterr){
														resolve(message.SOMETHINGWRONG);
													}else{
														if(searchcatress.rows == ''){
															resolve(message.DATANOTFOUND);
														}else {
															for(let data of regionResult.rows){
																for(let catdata of searchcatress.rows){
																	const regnId = catdata.region;
																	const arr1  = regnId.split(',');
																	for(let key of arr1){
																		if(key == ''){
																			resolve(message.DATANOTFOUND)
																		}else{
									                                       if(key == data.country){
									                                       		if(catdata.status != 'trace'){
									                                       			arr2.push(catdata)
									                                       		}else{
									                                       			arr2.push('already deleted')
									                                       		}
									                                       }
																		}
																	}
																}
																const successmessage = {
																	'status': true,
																	'data':arr2
																}
																resolve(successmessage)
															}
														}
													}
												})
											}else {
												resolve(message.FILEDS)
											}
									 	}	
									})
								}
							})
						}else{
							resolve(message.USERNOTFOUND)
						}
					}
				})
			}else{
				resolve(message.PERMISSIONERROR);
			}
		}catch(error){
			resolve(error)
		}
	})
}

 //  redisClient.hdel('bi_categories',categoryname,function(err,redisdata){
	// 	if(err){
	// 		resolve(message.SOMETHINGWRONG);
	// 	}else{
	// 		if(redisdata == 1){
	// 			resolve(message.DELETEDSUCCESS);
	// 		}else{
	// 			resolve(message.NORDELETED);
	// 		}
	// 	}
	// })