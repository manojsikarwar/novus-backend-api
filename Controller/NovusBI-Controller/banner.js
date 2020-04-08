const client=require("../../db")
const message=require("../../Helpers/message")
const redis 	   = require('redis');
const redisClient  = redis.createClient(6379, 'localhost');

/*** Create Banner ***/
module.exports.createBanner = (user, info) => {
	return new Promise((resolve, reject) => {
		try{
			if (user.role_id == 1) {
				const ChkBanner = `SELECT * FROM bi_banner WHERE title = '${info.title}'`;
				client.query(ChkBanner, (err1, res1) => {
						console.log(res1.rows)
					if(err1){
						resolve(message.SOMETHINGWRONG);
					}else{
						if (res1.rows == '') {
						    const sql = `INSERT INTO bi_banner(title,description,banner_image,is_status,created_by) VALUES ('${info.title}','${info.description}','${info.banner_image}','${1}','${user.id}') RETURNING banner_id`;
							client.query(sql, (error, result) => {
								if(error){
									resolve(message.SOMETHINGWRONG);
								}else{
									if (result != '') {
										// resolve(message.CREATEDSUCCESS);
										const redata = {
											banner_id 	  : result.rows[0].banner_id,
											title 		  : info.title,
											description   : info.description,
											banner_image  : info.banner_image,
											is_status	  : 1,
											created_by    : user.id,
										}
										redisClient.hmset('bi_banner', info.title, JSON.stringify(redata), function (err, data) {
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


/*** Banner list ***/
module.exports.banner_list = (user) => {
	return new Promise((resolve, reject) => {
		try{
			const userId = user.id;
			// console.log(user)
			if (user.role_id == 2 || user.role_id == 3 || user.role_id == 4) {
				
				const banArray = [];
					const sql = `SELECT * FROM bi_banner WHERE is_status = '${1}'`;
					client.query(sql, (error, result) => {
						if(error){
							resolve(message.SOMETHINGWRONG);
						}else{
							if(result.rows != ''){
								for(let dat of result.rows)
								{
									const data = {
										banner_id	  : dat.banner_id,
								        title	      : dat.title.trim(),
								        description	  : dat.description.trim(),
								        banner_image  : dat.banner_image.trim(),
									}
									banArray.push(data);
								}
								const response = {
									'success' : true,
									'data'    : banArray
								}
								resolve(response)
							}else{
								const response = {
									'success' : true,
									'data'    : result.rows
								}
								resolve(response)		
							}
						}
					});
			}else{
				resolve(message.PERMISSIONERROR);
				// if (userId == 1) {
				// }
				// else{
				// 	const sql = `SELECT * FROM bi_banner WHERE is_status = '${1}' AND created_by = '${userId}'`;
				// 	client.query(sql, (error, result) => {
				// 		if(error){
				// 			resolve(message.SOMETHINGWRONG);
				// 		}else{
				// 			if(result.rows != ''){
				// 				for(let dat of result.rows)
				// 				{
				// 					const data = {
				// 						banner_id	  : dat.banner_id,
				// 				        title	      : dat.title.trim(),
				// 				        description	  : dat.description.trim(),
				// 				        banner_image  : dat.banner_image.trim(),
				// 					}
				// 					banArray.push(data);
				// 				}
				// 				const response = {
				// 					success : true,
				// 					message : 'list of banners',
				// 					data     : banArray
				// 				}
				// 				resolve(response)
				// 			}else{
				// 				const response = {
				// 					'success' : true,
				// 					'data'    : result.rows
				// 				}
				// 				resolve(response)				
				// 			}
				// 		}
				// 	});
				// }
			}
		}catch(error){
			resolve(error)
		}
	})
}


/*** Update Banner ***/
module.exports.updateBanner = (user, info) => {
	return new Promise((resolve, reject) => {
		try{
			if (user.role_id > 2) {
				resolve(message.PERMISSIONERROR);
			}else{
				const updatebanner = `select * from bi_banner where banner_id = '${info.banner_id}' `
				client.query(updatebanner, (bannererr, bannerresult) => {
					if(bannererr){
						resolve(message.SOMETHINGWRONG)
					}else{
						if(bannerresult.rows != ''){
							// resolve(bannerresult.rows)
							const sql  = `UPDATE bi_banner SET title = '${info.title}', description = '${info.description}', banner_image = '${info.banner_image}'  WHERE banner_id = '${info.banner_id}'`;
							client.query(sql, (error, result) =>{
								if (error) {
									resolve(message.SOMETHINGWRONG);
								}else{
									if (result) {
										// resolve(message.UPDATEDSUCCESS);
										const redata = {
											banner_id 	  : bannerresult.rows[0].banner_id,
											title 		  : info.title,
											description   : info.description,
											banner_image  : info.banner_image,
											is_status	  : 1,
											created_by    : user.id,
										}
										redisClient.hmset('bi_banner', info.title, JSON.stringify(redata), function (err, data) {
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
									}
								}
							})
						}else{
							resolve(message.DATANOTFOUND);
						}
					}
				})
			}
		}catch(error){
			resolve(error)
		}
	})
}

/***  Delete Banner ***/
module.exports.deleteBanner = (user, info) => {
	return new Promise((resolve, reject) => {
		try{
			if (user.role_id > 2) {
				resolve(message.PERMISSIONERROR);
			}else{
				const sql  = `DELETE FROM bi_banner WHERE banner_id = '${info.banner_id}'`;
				client.query(sql, (error, result) =>{
					if (error) {
						resolve(message.SOMETHINGWRONG);
					}else{
						if(result) {
							resolve(message.DELETEDSUCCESS);
						}else{		
							resolve(message.NORDELETED);
						}
					}
				})
			}
		}catch(error){
			resolve(error)
		}
	})
}

//========================= demo ================================

// module.exports.solution = (D) => {
// 	return new Promise((resolve, reject)=>{
// 		resolve(D)	
// 	})
// }