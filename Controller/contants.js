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
			// resolve(user.id)
			if (user.role_id == 1) {
				const status = '1';
				const Chkcontant = `SELECT * FROM bi_contant WHERE title = '${info.title}'`;
				client.query(Chkcontant, (err1, res1) => {
					if(err1){
						resolve(message.SOMETHINGWRONG);
					}else{
						const cat_value =  JSON.stringify(info.category)
						if (res1.rows == '') {	
						    const sql = `INSERT INTO bi_contant(title,contant,type,categories,date,author,higlight,resume,comment,updated_at,status,created_by,pdf) VALUES ('${info.title}','${info.content}','${info.type}','${cat_value}','${info.date}','${info.author}','${info.heighlight}','${info.resume}','${info.comment}','${myDate}','${status}','${user.id}','${info.pdf}')RETURNING contant_id`;
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
											status	      : status,
											created_by    : user.id,
											pdf			  : info.pdf
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
	                                       		arr2.push(catdata)
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
					const searchcat = `select * from bi_contant`;
					client.query(searchcat, (searchcaterr, searchcatress) => {
						if(searchcaterr){
							resolve(message.SOMETHINGWRONG);
						}else{
							if(searchcatress.rows == ''){
								resolve(message.DATANOTFOUND);
							}else {
								const successmessage = {
									'status': true,
									'data': searchcatress.rows
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
// module.exports.contants = (user, info) => {
// 	return new Promise((resolve, reject) => {
// 		try{
// 			const userId = user.id;
// 			if (user.role_id > 2 ) {
// 				resolve(message.PERMISSIONERROR);
// 			}else{
// 				const articlesArray = [];
// 				if (userId == 1) {

// 					if (info.cat_id != '' && info.subcat_id == '') {
// 						const sql = `SELECT * FROM bi_contant WHERE cat_id = '${info.cat_id}' AND is_status = '${1}'`;
// 						client.query(sql, (error, result) => {
// 							if(error){
// 								resolve(message.SOMETHINGWRONG);
// 							}else{
// 								if(result.rows != ''){
// 									for(let dat of result.rows)
// 									{
// 										const data = {
// 											contant_id	  : r,
// 											title  		  : info.title,
// 											contant  	  : cat_value,
// 											type  		  : info.type,
// 											categories    : info.categories,
// 											date  		  : info.date,
// 											author 		  : info.author,
// 											higlight 	  : info.heighlight,
// 											resume 		  : info.resume,
// 											comment 	  : info.comment,
// 											status	      : status,
// 											created_by    : user.id,
// 											pdf			  : info.pdf
// 										}
// 										articlesArray.push(data);
// 									}
// 									const response = {
// 										success : true,
// 										message : 'list of contant',
// 										data     : articlesArray
// 									}
// 									redisClient.hgetall('bi_contant', function (err, data) {
// 									    if(err){
// 									    	resolve(message.SOMETHINGWRONG);
// 									    }else{
									    	
// 											resolve(response)
// 									    }
// 									})
// 								}else{
// 									resolve(message.EMPTY)			
// 								}
// 							}
// 						})
// 					}else{
// 						const sql = `SELECT * FROM bi_contant WHERE cat_id = '${info.cat_id}' AND subcat_id = '${info.subcat_id}' AND is_status = '${1}'`;
// 						client.query(sql, (error, result) => {
// 							if(error){
// 								resolve(message.SOMETHINGWRONG);
// 							}else{
// 								if(result.rows != ''){
// 									for(let dat of result.rows)
// 									{
// 										const data = {
// 											id	     	     : dat.id,
// 									        title 			 : dat.title.trim(),
// 									        written_on		 : dat.written_on.trim(),
// 									        auther		 	 : dat.auther.trim(),
// 									        description		 : dat.description.trim(),
// 									        editor	 		 : dat.editor.trim(),
// 									        image	 		 : dat.image.trim(),
// 									        embed	 		 : dat.embed.trim(),
// 									        quotations	 	 : dat.quotations.trim(),
// 									        audio	 	     : dat.audio.trim(),
// 									        subcat_id		 : dat.subcat_id,
// 									        cat_id		 	 : dat.cat_id,
// 									        is_status		 : dat.is_status,
// 									        created_by		 : dat.created_by,
// 									        created_on		 : dat.created_on.trim(),
// 										}
// 										articlesArray.push(data);
// 									}
// 									const response = {
// 										success : true,
// 										message : 'list of contant',
// 										data     : articlesArray
// 									}
// 									redisClient.hgetall('bi_contant', function (err, data) {
// 									    if(err){
// 									    	resolve(message.SOMETHINGWRONG);
// 									    }else{
									    	
// 											resolve(response)
// 									    }
// 									})
// 								}else{
// 									resolve(message.EMPTY)			
// 								}
// 							}
// 						})
// 					}

// 				}else{

// 					if (info.cat_id != '' && info.subcat_id == '') {
// 						const sql = `SELECT * FROM bi_contant WHERE cat_id = '${info.cat_id}' AND is_status = '${1}' AND created_by = '${userId}'`;
// 						client.query(sql, (error, result) => {
// 							if(error){
// 								resolve(message.SOMETHINGWRONG);
// 							}else{
// 								if(result.rows != ''){
// 									for(let dat of result.rows)
// 									{
// 										const data = {
// 											id	     	     : dat.id,
// 									        title 			 : dat.title.trim(),
// 									        written_on		 : dat.written_on.trim(),
// 									        auther		 	 : dat.auther.trim(),
// 									        description		 : dat.description.trim(),
// 									        editor	 		 : dat.editor.trim(),
// 									        image	 		 : dat.image.trim(),
// 									        embed	 		 : dat.embed.trim(),
// 									        quotations	 	 : dat.quotations.trim(),
// 									        audio	 	     : dat.audio.trim(),
// 									        subcat_id		 : dat.subcat_id,
// 									        cat_id		 	 : dat.cat_id,
// 									        is_status		 : dat.is_status,
// 									        created_by		 : dat.created_by,
// 									        created_on		 : dat.created_on.trim(),
// 										}
// 										articlesArray.push(data);
// 									}
// 									const response = {
// 										success : true,
// 										message : 'list of contant',
// 										data     : articlesArray
// 									}
// 									redisClient.hgetall('bi_contant', function (err, data) {
// 									    if(err){
// 									    	resolve(message.SOMETHINGWRONG);
// 									    }else{
									    	
// 											resolve(response)
// 									    }
// 									})
// 								}else{
// 									resolve(message.EMPTY)			
// 								}
// 							}
// 						})
// 					}else{
// 						const sql = `SELECT * FROM bi_contant WHERE cat_id = '${info.cat_id}' AND subcat_id = '${info.subcat_id}' AND is_status = '${1}' AND created_by = '${userId}' `;
// 						client.query(sql, (error, result) => {
// 							if(error){
// 								resolve(message.SOMETHINGWRONG);
// 							}else{
// 								if(result.rows != ''){
// 									for(let dat of result.rows)
// 									{
// 										const data = {
// 											id	     	     : dat.id,
// 									        title 			 : dat.title.trim(),
// 									        written_on		 : dat.written_on.trim(),
// 									        auther		 	 : dat.auther.trim(),
// 									        description		 : dat.description.trim(),
// 									        editor	 		 : dat.editor.trim(),
// 									        image	 		 : dat.image.trim(),
// 									        embed	 		 : dat.embed.trim(),
// 									        quotations	 	 : dat.quotations.trim(),
// 									        audio	 	     : dat.audio.trim(),
// 									        subcat_id		 : dat.subcat_id,
// 									        cat_id		 	 : dat.cat_id,
// 									        is_status		 : dat.is_status,
// 									        created_by		 : dat.created_by,
// 									        created_on		 : dat.created_on.trim(),
// 										}
// 										articlesArray.push(data);
// 									}
// 									const response = {
// 										success : true,
// 										message : 'list of contant',
// 										data     : articlesArray
// 									}
// 									redisClient.hgetall('bi_contant', function (err, data) {
// 									    if(err){
// 									    	resolve(message.SOMETHINGWRONG);
// 									    }else{
									    	
// 											resolve(response)
// 									    }
// 									})
// 								}else{
// 									resolve(message.EMPTY)			
// 								}
// 							}
// 						})
// 					}
// 				}
// 			}
// 		}catch(error){
// 			resolve(error)
// 		}
// 	})
// }


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
			if (user.role_id > 2) {
				resolve(message.PERMISSIONERROR);
			}else{
				const sql  = `DELETE FROM bi_contant WHERE id = '${info.id}'RETURNING title`;
				client.query(sql, (error, result) =>{
					if (error) {
						resolve(message.SOMETHINGWRONG);
					}else{
						if(result) {
							const contant_title = result.rows[0].title.trim();
                            redisClient.hdel('bi_contant',contant_title,function(err,redisdata){
								if(err){
									resolve(message.SOMETHINGWRONG);
								}else{
									if(redisdata == 1){
										resolve(message.DELETEDSUCCESS);
									}else{
										resolve(message.NORDELETED);
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