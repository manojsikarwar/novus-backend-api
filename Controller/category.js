const client=require("../db")
const message=require("../Helpers/message")


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
								const sql = `INSERT INTO bi_categories(category_name,icon,is_status,created_by) VALUES ('${info.category_name}','${info.icon}','${1}','${user.id}')`;
								client.query(sql, (error, result) => {
									if(error){
										resolve(message.SOMETHINGWRONG);
									}else{
										if (result != '') {
											resolve(message.CREATED);
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
								resolve(response)
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


/*** Update Categories ***/
module.exports.updateCategories = (user, info) => {
	return new Promise((resolve, reject) => {
		try{
			if (user.role > 2) {
				resolve(message.PERMISSIONERROR);
			}else{				
				const sql  = `UPDATE bi_categories SET category_name = '${info.category_name}', icon = '${info.icon}'  WHERE cat_id = '${info.cat_id}'`;
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

/***  Delete Categories ***/
module.exports.deleteCategories = (user, info) => {
	return new Promise((resolve, reject) => {
		try{
			if (user.role > 2) {
				resolve(message.PERMISSIONERROR);
			}else{
				const sql  = `DELETE FROM bi_categories WHERE cat_id = '${info.cat_id}'`;
				client.query(sql, (error, result) =>{
					if (error) {
						resolve(message.SOMETHINGWRONG);
					}else{
						if(result) {
							resolve(message.DELETEDSUCCESS);
						}else{		
							resolve(message.NOTDELETED);
						}
					}
				})
			}
		}catch(error){
			resolve(error)
		}
	})
}