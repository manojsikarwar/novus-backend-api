const client 		= require("../db");
const message 		= require("../Helpers/message");
const redis 	    = require('redis');
const moment 		= require('moment');
const date   		= new Date();
const myDate 		= moment(date).format('L');
const redisClient   = redis.createClient(6379, 'localhost');

/*** Create Contant ***/
module.exports.createContant = (user, info) => {
	return new Promise((resolve, reject) => {
		try{
			if (user.role_id == 1) {
				const contantdat = JSON.stringify(info.content);
				if(info.content == "" || info.title == "" || info.category == ""){
					const Chkcontant = `SELECT * FROM bi_contant WHERE title = '${info.title}'`;
				
					client.query(Chkcontant, (err1, res1) => {
						if(err1){
							resolve(message.SOMETHINGWRONG);
						}else{
							const cat_value =  info.category
							if (res1.rows == '') {	
							    const sql = `INSERT INTO bi_contant(title,contant,type,categories,date,author,higlight,resume,comment,updated_at,status,created_by,pdf,categories_name) VALUES ('${info.title}','${contantdat}','${info.type}','${cat_value}','${info.date}','${info.author}','${info.heighlight}','${info.resume}','${info.comment}','${myDate}','${'draft'}','${user.id}','${info.pdf}','${info.categories_name}')RETURNING contant_id`;
							    client.query(sql, (error, result) => {
							    	// resolve(sql)
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
												categories_name: info.categories_name
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
							    const sql = `INSERT INTO bi_contant(title,contant,type,categories,date,author,higlight,resume,comment,updated_at,status,created_by,pdf,categories_name) VALUES ('${info.title}','${contantdat}','${info.type}','${cat_value}','${info.date}','${info.author}','${info.heighlight}','${info.resume}','${info.comment}','${myDate}','${'pendding'}','${user.id}','${info.pdf}','${info.categories_name}')RETURNING contant_id`;
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
												status	      : 'pendding',
												created_by    : user.id,
												pdf			  : info.pdf,
												categories_name: info.categories_name
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
			if(role_id == 1){
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
	                                       			arr2.push('already deleted')
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
					const arrtrace = [];
					const searchcat = `select * from bi_contant`;
					client.query(searchcat, (searchcaterr, searchcatress) => {
						if(searchcaterr){
							resolve(message.SOMETHINGWRONG);
						}else{
							if(searchcatress.rows == ''){
								resolve(message.DATANOTFOUND);
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

				const checksql = `SELECT * FROM bi_contant WHERE id = '${info.id}'`;
				client.query(checksql, (err, res) =>{
					if (err) {
						resolve(message.SOMETHINGWRONG);
					}else{
						if (res.rows[0] != '') {
							const today = new Date();
							const written_on_date = (today.getMonth()+1) +'/'+today.getDate()+'/'+today.getFullYear();

							const sql  = `UPDATE bi_contant SET 
									title  		= '${info.title}',
									written_on  = '${written_on_date}',
									auther  	= '${info.auther}',
									description = '${info.description}',
									editor  	= '${info.editor}',
									image  		= '${info.image}', 
									embed 		= '${info.embed}',
									quotations  = '${info.quotations}',
									subcat_id   = '${info.subcat_id}',
									audio       = '${info.audio}' WHERE id = '${info.id}'`;

							client.query(sql, (error, result) =>{
								if (error) {
									resolve(message.SOMETHINGWRONG);
								}else{
									if (result) {
										const resdata = {
											id	  		  : res.rows[0].id,
											title 		  : info.title,
											written_on    : written_on_date,
											auther 		  : info.auther,
											description   : info.description,
											editor        : info.editor,
											image         : info.image,
											embed    	  : info.embed,
											quotations    : info.quotations,
											subcat_id     : info.subcat_id,
											cat_id        : info.cat_id,
											audio         : info.audio

										}
										redisClient.hmset('bi_contant', res.rows[0].title, JSON.stringify(resdata), function (err, data) {
										    if(err){
										    	resolve(message.SOMETHINGWRONG);
										    }else{
										    	if(data == 'OK'){
											    	resolve(message.UPDATEDSUCCESS);
										    	}else{
											    	resolve(message.NOTUPDATED);
										    	}
										    }
										})		
									}else{
										resolve(message.NOTUPDATED);
									}
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
									resolve(message.ALREADYDEL)
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
										resolve(message.UPDATEDSUCCESS);
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
							const successmessage = {
								'status':true,
								'data':tracearry
							}
							resolve(successmessage)
						}
					}
				})
			}
		}catch(error){
			resolve(error)
		}
	})
}