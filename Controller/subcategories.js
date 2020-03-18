const client 	   = require("../db");
const message 	   = require("../Helpers/message");
const redis 	   = require('redis');
const redisClient  = redis.createClient(6379, 'localhost');


/*** Create SubCategories ***/
module.exports.createSubCategories = (user, info) => {
	return new Promise((resolve, reject) => {
		try{
			if (user.role_id == 1) {
				const ChkCategory = `SELECT * FROM bi_subcategories WHERE subcategory_name = '${info.subcategory_name}'`;
				client.query(ChkCategory, (err1, res1) => {
					if(err1){
						resolve(message.SOMETHINGWRONG);
					}else{
						if (res1.rows == '') {	
							    const sql = `INSERT INTO bi_subcategories(subcategory_name,cat_id,icon,is_status,created_by) VALUES ('${info.subcategory_name}','${info.cat_id}','${info.icon}','${1}','${user.id}')RETURNING subcat_id`;
								client.query(sql, (error, result) => {
									if(error){
										resolve(message.SOMETHINGWRONG);
									}else{
										if (result != '') {
											const redata = {
												subcat_id 	 	 : result.rows[0].subcat_id,
												subcategory_name : info.subcategory_name,
												cat_id 		     : info.cat_id,
												icon 		     : info.icon,
												is_status	     : 1,
												created_by       : user.id
											}
											redisClient.hmset('bi_subcategories', info.subcategory_name, JSON.stringify(redata), function (err, data) {
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


/*** SubCategories list ***/
module.exports.SubCategories = (user, catId) => {
	return new Promise((resolve, reject) => {
		try{
			const userId = user.id;
			if (user.role_id > 2 ) {
				resolve(message.PERMISSIONERROR);
			}else{
				const subcatArray = [];
				if (userId == 1) {
					const sql = `SELECT * FROM bi_subcategories WHERE cat_id = '${catId}' AND is_status = '${1}'`;
					client.query(sql, (error, result) => {
						if(error){
							resolve(message.SOMETHINGWRONG);
						}else{
							if(result.rows != ''){
								for(let dat of result.rows)
								{
									const data = {
										subcat_id		 : dat.subcat_id,
								        subcategory_name : dat.subcategory_name.trim(),
								        cat_id		     : dat.cat_id,
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
								//resolve(response)
							}else{
								resolve(message.EMPTY)			
							}
						}
					});
				}else{
					const sql = `SELECT * FROM bi_subcategories WHERE cat_id = '${catId}' AND is_status = '${1}' AND created_by = '${userId}'`;
					client.query(sql, (error, result) => {
						if(error){
							resolve(message.SOMETHINGWRONG);
						}else{
							if(result.rows != ''){
								for(let dat of result.rows)
								{
									const data = {
										subcat_id		 : dat.subcat_id,
								        subcategory_name : dat.subcategory_name.trim(),
								        cat_id		     : dat.cat_id,
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
								//resolve(response)
							}else{
								resolve(message.EMPTY)			
							}
						}
					});
				}
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
				const sql  = `UPDATE bi_subcategories SET subcategory_name = '${info.subcategory_name}', cat_id = '${info.cat_id}', icon = '${info.icon}' WHERE subcat_id = '${info.subcat_id}'RETURNING subcat_id`;
				client.query(sql, (error, result) =>{
					// console.log(result);
					if (error) {
						resolve(message.SOMETHINGWRONG);
					}else{
						if (result) {
							const resdata = {
								subcat_id 	  : result.rows[0].subcat_id,
								category_name : info.subcategory_name,
								subcat_id 	  : info.subcat_id,
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
			}
		}catch(error){
			resolve(error)
		}
	})
}


/***  Delete SubCategories ***/
module.exports.deleteSubCategories = (user, info) => {
	return new Promise((resolve, reject) => {
		try{
			if (user.role_id > 2) {
				resolve(message.PERMISSIONERROR);
			}else{
				const chksql  = `SELECT * FROM bi_subcategories WHERE subcat_id = '${info.subcat_id}'`;
				client.query(chksql, (chkerr, chkres) =>{
					if (chkerr) {
						resolve(message.SOMETHINGWRONG);
					}else{
						if (chkres.rows == '') {
							resolve(message.DATANOTFOUND)
						}else{
							const sql  = `DELETE FROM bi_subcategories WHERE subcat_id = '${info.subcat_id}'`;
							client.query(sql, (error, result) =>{
								if (error) {
									resolve(message.SOMETHINGWRONG);
								}else{
									if(result) {
										const subcategoryname = chkres.rows[0].subcategory_name.trim();
			                            redisClient.hdel('bi_subcategories',subcategoryname,function(err,redisdata){
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
										//resolve(message.DELETEDSUCCESS);
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
