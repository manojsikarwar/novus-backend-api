const client=require("../db")
const message=require("../Helpers/message")


/*** Create Banner ***/
module.exports.createBanner = (user, info) => {
	return new Promise((resolve, reject) => {
		try{
			if (user.role_id == 1) {
				// const ChkBanner = `SELECT * FROM tbl_banner WHERE title = '${info.title}'`;
				// client.query(ChkBanner, (err1, res1) => {
				// 	if(err1){
				// 		resolve(message.SOMETHINGWRONG);
				// 	}else{
				// 		if (res1.rows == '') {
							
							    const sql = `INSERT INTO bi_banner(title,description,banner_image,is_status,created_by) VALUES ('${info.title}','${info.description}','${info.banner_image}','${1}','${user.id}')`;
								client.query(sql, (error, result) => {
									if(error){
										resolve(message.SOMETHINGWRONG);
									}else{
										if (result != '') {
											resolve(message.CREATEDSUCCESS);
										}else{
											resolve(message.NOTCREATED);
										}
									}
								})
						// }else{
							// resolve(message.ALREADYEXISTS);
						// }
					// }	
				// });	
			}else{
				resolve(message.PERMISSIONERROR);
			}			
		}catch(error){
			resolve(error);
		}
	})
}


/*** Banner list ***/
module.exports.Banners = (user) => {
	return new Promise((resolve, reject) => {
		try{
			const userId = user.id;
			if (user.role_id > 2 ) {
				resolve(message.PERMISSIONERROR);
			}else{
				const banArray = [];
				if (userId == 1) {
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
									success : true,
									message : 'list of banners',
									data     : banArray
								}
								resolve(response)
							}else{
								resolve(message.EMPTY)			
							}
						}
					});
				}else{
					const sql = `SELECT * FROM bi_banner WHERE is_status = '${1}' AND created_by = '${userId}'`;
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
									success : true,
									message : 'list of banners',
									data     : banArray
								}
								resolve(response)
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


/*** Update Banner ***/
module.exports.updateBanner = (user, info) => {
	return new Promise((resolve, reject) => {
		try{
			if (user.role_id > 2) {
				resolve(message.PERMISSIONERROR);
			}else{				
				const sql  = `UPDATE bi_banner SET title = '${info.title}', description = '${info.description}', banner_image = '${info.banner_image}'  WHERE banner_id = '${info.banner_id}'`;
				client.query(sql, (error, result) =>{
					if (error) {
						resolve(message.SOMETHINGWRONG);
					}else{
						if (result) {
							resolve(message.UPDATEDSUCCESS);
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