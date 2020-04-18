const client 	   = require("../../db");
const message 	   = require("../../Helpers/message");
const redis 	   = require('redis');
const redisClient  = redis.createClient(6379, 'localhost');


/*** Create SubCategories ***/
// module.exports.createSubCategories = (user, info) => {
// 	return new Promise((resolve, reject) => {
// 		try{
// 			const subcategory_name = info.subcategory_name;
// 			const parant_id = info.cat_id;
// 			if (user.role_id == 1 || user.role_id == 2 || user.role_id == 4) {
// 				const max = `select max(subcategory_id) from bi_categories `
// 				client.query(max, (maxerr, maxress)=>{
// 					if(maxerr){
// 						resolve('error in max')
// 					}else{
// 						if(maxress.rows == ''){
// 							resolve('blank max')
// 						}else{
// 							var subcategory_id = maxress.rows[0].max

// 							// resolve(maxress.rows[0].max)
// 							const ChkCategory = `SELECT * FROM bi_categories WHERE subcategory_name = '${info.subcategory_name}' AND parant_id = '${parant_id}' `
// 							client.query(ChkCategory, (err1, res1) => {
// 								if(err1){
// 									resolve(message.SOMETHINGWRONG);
// 								}else{
// 									if (res1.rows == '') {	
// 										   const sql = `INSERT INTO bi_categories(category_name,icon,is_status,created_by,subcategory_name,parant_id,subcategory_id) VALUES ('${'none'}','${info.icon}','${1}','${user.id}','${subcategory_name}','${parant_id}','${subcategory_id+1}')RETURNING subcategory_id`;
// 											client.query(sql, (error, result) => {
// 												if(error){
// 													resolve(message.SOMETHINGWRONG);
// 												}else{
// 													if (result != '') {
// 														const redata = {
// 															cat_id 	 	  : result.rows[0].subcategory_id,
// 															category_name : 'none',
// 															icon 		  : info.icon,
// 															is_status	  : 1,
// 															created_by    : user.id,
// 															subcategory_name:subcategory_name,
// 															parant_id 	  : parant_id,
// 															subcategory_id: subcategory_id+1
// 														}
// 														redisClient.hmset('bi_categories', parant_id, JSON.stringify(redata), function (err, data) {
// 														    if(err){
// 														    	resolve(message.SOMETHINGWRONG);
// 														    }else{
// 														    	if(data == 'OK'){
// 															    	resolve(message.CREATED);
// 														    	}else{
// 															    	resolve(message.SOMETHINGWRONG);
// 														    	}
// 														    }
// 														})
// 													}else{
// 														resolve(message.NOTCREATED);
// 													}
// 												}
// 											})
// 									}else{
// 										resolve(message.ALREADYEXISTS);
// 									}
// 								}	
// 							});	
// 						}
// 					}
// 				})
// 			}else{
// 				resolve(message.PERMISSIONERROR);
// 			}			
// 		}catch(error){
// 			resolve(error);
// 		}
// 	})
// }


/*** SubCategories list ***/
module.exports.SubCategories = (user, catId) => {
	return new Promise((resolve, reject) => {
		try{
			// console.log(user)
			const role_id = user.role_id;
			const subcatArray = [];
			if (role_id == 1 || role_id == 2 || role_id == 4) {
				if(catId != '' ){

				}else{
					resolve(message.FILEDS)
				}
				const searchsub = `select * from bi_categories where cat_id = '${catId}' `
				client.query(searchsub, (searcherr, searchress) => {
					if(searcherr){
						resolve(message.SOMETHINGWRONG)
					}else{
						if(searchress.rows != ''){
							if(searchress.rows[0].parant_id == 0){
								const sql = `SELECT * FROM bi_categories WHERE parant_id = '${catId}' AND is_status = '${1}'`;
								client.query(sql, (error, result) => {
									if(error){
										resolve(message.SOMETHINGWRONG);
									}else{
										if(result.rows != ''){
											for(let dat of result.rows)
											{
												const data = {
													subcat_id		 : dat.cat_id,
											        subcategory_name : dat.category_name.trim(),
											        cat_id		     : dat.parant_id,
											        icon			 : dat.icon.trim()
												}
												subcatArray.push(data);
											}
											const response = {
												success : true,
												message : 'list of subcategories',
												data     : subcatArray
											}
											redisClient.hgetall('bi_subcategories', function (err, data) {
											    if(err){
											    	resolve(message.SOMETHINGWRONG);
											    }else{
											    	
													resolve(response)
											    }
											})
										}else{
											const errmessage = {
												'success':true,
												'data': result.rows
											}
											resolve(errmessage)
										}
									}
								});

							}else{
								const errmessage = {
									'success':true,
									"message":'this is not category'
								}
								resolve(errmessage)
							}
						}else{
							resolve(message.DATANOTFOUND)
						}
					}
				})
			}else{
				const errmessage = {
					'success':false,
					'message':'You have not permission'
				}
				resolve(errmessage)
			}
			
		}catch(error){
			resolve(error)
		}
	})
}


/*** Update SubCategories ***/
module.exports.updateSubCategories = (user, info) => {
	return new Promise((resolve, reject) => {
		try{
			if (user.role_id > 2) {
				resolve(message.PERMISSIONERROR);
			}else{
			const findsubcat = `select * from bi_categories where cat_id = '${info.subcat_id}' `;
			client.query(findsubcat, (finderr, findress) => {
				if(finderr){
					resolve(message.SOMETHINGWRONG)
				}else{
					if(findress.rows == ''){
						resolve(message.DATANOTFOUND)
					}else{
						const parant_id = findress.rows[0].parant_id;
						if(parant_id != 0){
							const sql  = `UPDATE bi_categories SET category_name = '${info.subcategory_name}',icon = '${info.icon}' WHERE cat_id = '${info.subcat_id}'RETURNING cat_id`;
							client.query(sql, (error, result) =>{
								if (error) {
									resolve(message.SOMETHINGWRONG);
								}else{
									if (result) {
										const resdata = {
											subcat_id 	  : result.rows[0].cat_id,
											category_name : info.subcategory_name,
											icon 		  : info.icon,
											is_status	  : 1,
											created_by    : user.id
										}
										redisClient.hmset('bi_subcategories', info.subcategory_name, JSON.stringify(resdata), function (err, data) {
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
										//resolve(message.UPDATEDSUCCESS);
									}
								}
							})
						}else{
							const errmessage = {
								'success':false,
								'message':'this is not a subcategories'
							}
							resolve(errmessage)
						}
					}
				}
			})		
				
			}
		}catch(error){
			resolve(error)
		}
	})
}


/***  Delete SubCategories ***/
// module.exports.deleteSubCategories = (user, info) => {
// 	return new Promise((resolve, reject) => {
// 		try{
// 			if (user.role_id > 2) {
// 				resolve(message.PERMISSIONERROR);
// 			}else{
// 				const chksql  = `SELECT * FROM bi_subcategories WHERE subcat_id = '${info.subcat_id}'`;
// 				client.query(chksql, (chkerr, chkres) =>{
// 					if (chkerr) {
// 						resolve(message.SOMETHINGWRONG);
// 					}else{
// 						if (chkres.rows == '') {
// 							resolve(message.DATANOTFOUND)
// 						}else{
// 							const sql  = `DELETE FROM bi_subcategories WHERE subcat_id = '${info.subcat_id}'`;
// 							client.query(sql, (error, result) =>{
// 								if (error) {
// 									resolve(message.SOMETHINGWRONG);
// 								}else{
// 									if(result) {
// 										const subcategoryname = chkres.rows[0].subcategory_name.trim();
// 			                            redisClient.hdel('bi_subcategories',subcategoryname,function(err,redisdata){
// 											if(err){
// 												resolve(message.SOMETHINGWRONG);
// 											}else{
// 												if(redisdata == 1){
// 													resolve(message.DELETEDSUCCESS);
// 												}else{
// 													resolve(message.NORDELETED);
// 												}
// 											}
// 										})
// 										//resolve(message.DELETEDSUCCESS);
// 									}else{		
// 										resolve(message.NORDELETED);
// 									}
// 								}
// 							})
// 						}
// 					}
// 				})	
// 			}
// 		}catch(error){
// 			resolve(error)
// 		}
// 	})
// }
