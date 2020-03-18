const client	   = require("../db");
const message	   = require("../Helpers/message");
const redis 	   = require('redis');
const redisClient  = redis.createClient(6379, 'localhost');

/*** Create Categories ***/
module.exports.createCategories = (user, info) => {
	return new Promise((resolve, reject) => {
		try{
			if (user.role_id== 1) {
				const ChkCategory = `SELECT * FROM bi_categories WHERE category_name = '${info.category_name}'`;
				client.query(ChkCategory, (err1, res1) => {
					if(err1){
						resolve(message.SOMETHINGWRONG+"01");
					}else{
						if (res1.rows == '') {
								const sql = `INSERT INTO bi_categories(category_name,icon,is_status,created_by) VALUES ('${info.category_name}','${info.icon}','${1}','${user.id}')RETURNING cat_id`;
								client.query(sql, (error, result) => {
									if(error){
										resolve(message.SOMETHINGWRONG);
									}else{
										if (result != '') {
											const redata = {
												cat_id 	 	  : result.rows[0].cat_id,
												category_name : info.category_name,
												icon 		  : info.icon,
												is_status	  : 1,
												created_by    : user.id
											}
											redisClient.hmset('bi_categories', info.category_name, JSON.stringify(redata), function (err, data) {
											    if(err){
											    	resolve(message.SOMETHINGWRONG);
											    }else{
											    	if(data == 'OK'){
												    	resolve(message.CREATED);
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
							resolve(message.ALREADYEMAIL);
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


/*** Categories list ***/
module.exports.Categories = (user) => {
	return new Promise((resolve, reject) => {
		try{
			const userId = user.id;
			if (user.role > 2 ) {
				resolve(message.PERMISSIONERROR);
			}else{
				const catArray = [];
				if (userId == 1) {
					const sql = `SELECT * FROM bi_categories WHERE is_status = '${1}'`;
					client.query(sql, (error, result) => {
						if(error){
							resolve(message.SOMETHINGWRONG);
						}else{
							if(result.rows != ''){
								for(let dat of result.rows)
								{
									const data = {
										cat_id		    : dat.cat_id,
								        category_name	: dat.category_name.trim(),
								        icon	        : dat.icon.trim(),
									}
									catArray.push(data);
								}
								const response = {
									success : true,
									message : 'list of categories',
									data     : catArray
								}
								redisClient.hgetall('bi_categories', function (err, data) {
								    if(err){
								    	resolve(message.SOMETHINGWRONG);
								    }else{
								    	
										resolve(response)
								    }
								})	
								// resolve(response)
							}else{
								resolve(message.EMPTY)			
							}
						}
					});
				}else{
					const sql = `SELECT * FROM bi_categories WHERE is_status = '${1}' AND created_by = '${userId}'`;
					client.query(sql, (error, result) => {
						if(error){
							resolve(message.SOMETHINGWRONG);
						}else{
							if(result.rows != ''){
								for(let dat of result.rows)
								{
									const data = {
										cat_id		    : dat.cat_id,
								        category_name	: dat.category_name.trim(),
										icon	        : dat.icon.trim(),
									}
									catArray.push(data);
								}
								const response = {
									success : true,
									message : 'list of categories',
									data     : catArray
								}
								redisClient.hgetall('bi_categories', function (err, data) {
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


/*** Update Categories ***/
module.exports.updateCategories = (user, info) => {
	return new Promise((resolve, reject) => {
		try{
			if (user.role > 2) {
				resolve(message.PERMISSIONERROR);
			}else{		
				const match = `SELECT * FROM bi_categories WHERE category_name = '${info.category_name}'`;
		    	client.query(match, (matcherr, matchress) => {
		    		if(matcherr){
						resolve(message.SOMETHINGWRONG);
		    		}else{
		    			if(matchress.rows != ''){
							resolve(message.DATANOTFOUND)
		    			}else{
		    				const sql  = `UPDATE bi_categories SET category_name = '${info.category_name}', icon = '${info.icon}'  WHERE cat_id = '${info.cat_id}'RETURNING cat_id`;
							client.query(sql, (error, result) =>{
								if (error) {
									resolve(message.SOMETHINGWRONG);
								}else{
									if (result) {
										const resdata = {
											cat_id 	 	  : result.rows[0].cat_id,
											category_name : info.category_name,
											icon 		  : info.icon,
											is_status	  : 1,
											created_by    : user.id
										}
										redisClient.hmset('bi_categories', info.category_name, JSON.stringify(resdata), function (err, data) {
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

/***  Delete Categories ***/
module.exports.deleteCategories = (user, info) => {
	return new Promise((resolve, reject) => {
		try{
			if (user.role > 2) {
				resolve(message.PERMISSIONERROR);
			}else{
				const chksql  = `SELECT * FROM bi_categories WHERE cat_id = '${info.cat_id}'`;
				client.query(chksql, (chkerror, chkresult) =>{
					if (chkerror) {
						resolve(message.SOMETHINGWRONG);
					}else{
						if (chkresult.rows == '') {
							resolve(message.DATANOTFOUND);
						}else{
							const sql  = `DELETE FROM bi_categories WHERE cat_id = '${info.cat_id}'`;
							client.query(sql, (error, result) =>{
								if (error) {
									resolve(message.SOMETHINGWRONG);
								}else{
									if(result) {
									   const categoryname = chkresult.rows[0].category_name.trim();
			                           redisClient.hdel('bi_categories',categoryname,function(err,redisdata){
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
									}else{		
										resolve(message.NOTDELETED);
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