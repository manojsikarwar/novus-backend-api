const client	   = require("../../db");
const message	   = require("../../Helpers/message");
const redis 	   = require('redis');
const redisClient  = redis.createClient(6379, 'localhost');

/*** Create Categories ***/
module.exports.createCategories = (user, info) => {
	return new Promise((resolve, reject) => {
		try{
			if (user.role_id== 1) {
				const parant_id = info.parent_id;
				const ChkCategory = `SELECT * FROM bi_categories WHERE category_name = '${info.category_name}'`;
				client.query(ChkCategory, (err1, res1) => {
					if(err1){
						resolve(message.SOMETHINGWRONG);
					}else{
						if (res1.rows == '') {
							const sql = `INSERT INTO bi_categories(category_name,icon,is_status,created_by,parant_id) VALUES ('${info.category_name}','${info.icon}','${1}','${user.id}','${parant_id}')RETURNING cat_id`;
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
											created_by    : user.id,
											parant_id 	  : parant_id
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


/*** Categories list ***/
module.exports.Categories = (user) => {
	return new Promise((resolve, reject) => {
		try{
			const role_id = user.role_id;
			if (user.role > 2 ) {
				resolve(message.PERMISSIONERROR);
			}else{
				const catArray = [];
				if (role_id == 1 || role_id == 4 ) {
					const sql = `SELECT * FROM bi_categories where is_status = '${1}' and parant_id = '${0}' ORDER BY cat_id DESC`;
					client.query(sql, (error, result) => {
						if(error){
							resolve(message.SOMETHINGWRONG);
						}else{
							// resolve(result.rows)
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
					const errmessage = {
						'status': false,
						'message': 'You have not permission'
					}
					resolve(errmessage);
				}
			}
		}catch(error){
			resolve(error)
		}
	})
}

/** Categories and sub categories list ***/
module.exports.Categories_list = (user) => {
	return new Promise((resolve, reject) => {
		try{
			const role_id = user.role_id;
			// if (user.role > 2 ) {
			// 	resolve(message.PERMISSIONERROR);
			// }else{
				const catArray = [];
				if (role_id != '') {
					const list = `SELECT * FROM bi_categories where is_status = '${1}' ORDER BY cat_id DESC`;
					client.query(list, (listerr, listress) => {
						if(listerr){
							resolve(message.SOMETHINGWRONG);
						}else{
							if(listress.rows != ''){
								for(let dat of listress.rows)
								{
									const data = {
										id 			: dat.cat_id,
								        name		: dat.category_name.trim(),
								        parent_id 	: dat.parant_id,
								        icon	    : dat.icon.trim(),
								        cat_id 		: dat.cat_id
									}
									catArray.push(data);
								}
								const response = {
									success : true,
									message : 'list of categories and subcategories',
									data     : catArray
								}
								redisClient.hgetall('bi_categories', function (err, data) {
								    if(err){
								    	resolve(message.SOMETHINGWRONG);
								    }else{
								    	
										resolve(response)
								    }
								})	
							}else{
								resolve(message.EMPTY)			
							}
						}
					});
				}else{
					const errmessage = {
						'status': false,
						'message': 'You have not permission'
					}
					resolve(errmessage);
				}
			// }
		}catch(error){
			resolve(error)
		}
	})
}

/*** Update Categories ***/
module.exports.updateCategories = (user, info) => {
	return new Promise((resolve, reject) => {
		try{
			if (user.role_id == 1 || user.role_id == 2 ) {
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
			}else{	
				resolve(message.PERMISSIONERROR);	
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
			if(info.id != ''){
				if(user.role_id == 1 || user.role_id == 2 || user.role_id == 4 ){
					if(info.id){
						const chksql  = `SELECT * FROM bi_categories WHERE cat_id = '${info.id}'`;
						client.query(chksql, (chkerror, chkresult) =>{
							if (chkerror) {
								resolve(message.SOMETHINGWRONG);
							}else{
								if (chkresult.rows == '') {
									resolve(message.DATANOTFOUND);
								}else{
									// resolve(chkresult.rows)
									const sql  = `DELETE FROM bi_categories WHERE cat_id = '${info.id}'	`;
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
						                            const sql  = `DELETE FROM bi_categories WHERE parant_id = '${info.id}'	`;
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
																		// if(redisdata == 1){
																		// 	// resolve(message.DELETEDSUCCESS);
																		// }else{
																		// 	resolve(message.NORDELETED);
																		// }
																	}
																})
															}else{		
																resolve(message.NOTDELETED);
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
					}else{
						resolve(message.PARAMETES)
					}
				}else{
					resolve(message.PERMISSIONERROR)
				}
			}else{
				resolve(message.FILEDS)
			}
		}catch(error){
			resolve(error)
		}
	})
}