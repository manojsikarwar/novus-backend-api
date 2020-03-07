const client=require("../db")
const message=require("../Helpers/message")


/*** Create Articles ***/
module.exports.createArticle = (user, info) => {
	return new Promise((resolve, reject) => {
		try{
			if (user.role_id == 1) {
				const ChkArticles = `SELECT * FROM bi_articles WHERE title = '${info.title}'`;
				client.query(ChkArticles, (err1, res1) => {
					if(err1){
						resolve(message.SOMETHINGWRONG);
					}else{
						if (res1.rows == '') {	
								const today = new Date();
								const written_on_date = (today.getMonth()+1) +'/'+today.getDate()+'/'+today.getFullYear();
							    const sql = `INSERT INTO bi_articles(title,written_on,auther,article_image,description,subcat_id,is_status,created_by,created_on) VALUES ('${info.title}','${written_on_date}','${info.auther}','${info.article_image}','${info.description}','${info.subcat_id}','${1}','${user.id}','${today}')`;
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


/*** Articles list ***/
module.exports.Articles = (user, subcatId) => {
	return new Promise((resolve, reject) => {
		try{
			const userId = user.id;
			if (user.role_id > 2 ) {
				resolve(message.PERMISSIONERROR);
			}else{
				const articlesArray = [];
				if (userId == 1) {
					const sql = `SELECT * FROM bi_articles WHERE subcat_id = '${subcatId}' AND is_status = '${1}'`;
					client.query(sql, (error, result) => {
						if(error){
							resolve(message.SOMETHINGWRONG);
						}else{
							if(result.rows != ''){
								for(let dat of result.rows)
								{
									const data = {
										article_id		 : dat.article_id,
								        title 			 : dat.title.trim(),
								        written_on		 : dat.written_on.trim(),
								        auther		 	 : dat.auther.trim(),
								        description		 : dat.description.trim(),
								        article_image	 : dat.article_image.trim(),
								        subcat_id		 : dat.subcat_id,
								        is_status		 : dat.is_status,
								        created_by		 : dat.created_by,
								        created_on		 : dat.created_on.trim(),
									}
									articlesArray.push(data);
								}
								const response = {
									success : true,
									message : 'list of articles',
									data     : articlesArray
								}
								resolve(response)
							}else{
								resolve(message.EMPTY)			
							}
						}
					});
				}else{
					const sql = `SELECT * FROM bi_articles WHERE subcat_id = '${subcatId}' AND is_status = '${1}' AND created_by = '${userId}'`;
					client.query(sql, (error, result) => {
						if(error){
							resolve(message.SOMETHINGWRONG);
						}else{
							if(result.rows != ''){
								for(let dat of result.rows)
								{
									const data = {
										article_id		 : dat.article_id,
								        title 			 : dat.title.trim(),
								        written_on		 : dat.written_on.trim(),
								        auther		 	 : dat.auther.trim(),
								        description		 : dat.description.trim(),
								        article_image	 : dat.article_image.trim(),
								        subcat_id		 : dat.subcat_id,
								        is_status		 : dat.is_status,
								        created_by		 : dat.created_by,
								        created_on		 : dat.created_on.trim(),
									}
									articlesArray.push(data);
								}
								const response = {
									success : true,
									message : 'list of articles',
									data     : articlesArray
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


// /*** Update SubCategories ***/
// module.exports.updateSubCategories = (user, info) => {
// 	return new Promise((resolve, reject) => {
// 		try{
// 			if (user.role > 2) {
// 				resolve(message.PERMISSIONERROR);
// 			}else{				
// 				const sql  = `UPDATE tbl_subcategories SET subcategory_name = '${info.subcategory_name}', cat_id = '${info.cat_id}', icon = '${info.icon}' WHERE subcat_id = '${info.subcat_id}'`;
// 				client.query(sql, (error, result) =>{
// 					if (error) {
// 						resolve(message.SOMETHINGWRONG);
// 					}else{
// 						if (result) {
// 							resolve(message.UPDATEDSUCCESS);
// 						}
// 					}
// 				})
// 			}
// 		}catch(error){
// 			resolve(error)
// 		}
// 	})
// }


/***  Delete Article ***/
module.exports.deleteArticle = (user, info) => {
	return new Promise((resolve, reject) => {
		try{
			if (user.role_id > 2) {
				resolve(message.PERMISSIONERROR);
			}else{
				const sql  = `DELETE FROM bi_articles WHERE article_id = '${info.article_id}'`;
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