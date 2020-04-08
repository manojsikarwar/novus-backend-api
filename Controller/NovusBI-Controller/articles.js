const client 		= require("../../db");
const message 		= require("../../Helpers/message");
const redis 	    = require('redis');
const redisClient   = redis.createClient(6379, 'localhost');

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
							    const sql = `INSERT INTO bi_articles(title,written_on,auther,description,editor,image,embed,quotations,subcat_id,is_status,created_by,created_on) VALUES ('${info.title}','${written_on_date}','${info.auther}','${info.description}','${info.editor}','${info.image}','${info.embed}','${info.quotations}','${info.subcat_id}','${1}','${user.id}','${today}')RETURNING article_id`;
								client.query(sql, (error, result) => {
									if(error){
										resolve(message.SOMETHINGWRONG);
									}else{
										if (result != '') {
											const redata = {
												article_id 	  : result.rows[0].article_id,
												title  		  : info.title,
												written_on 	  : written_on_date,
												auther 		  : info.auther,
												description   : info.description,
												editor 		  : info.editor,
												image 		  : info.image,
												embed 		  : info.embed,
												quotations 	  : info.quotations,
												subcat_id 	  : info.subcat_id,
												is_status	  : 1,
												created_by    : user.id,
												created_on    : today
											}
											redisClient.hmset('bi_articles', info.title, JSON.stringify(redata), function (err, data) {
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


/*** Articles list ***/
module.exports.Articles = (user, subcatId) => {
	return new Promise((resolve, reject) => {
		try{
			const userId = user.id;
			if (user.role_id == 2 || user.role_id == 3 ||user.role_id == 4 ) {
					const articlesArray = [];
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
								        editor	 		 : dat.editor.trim(),
								        image	 		 : dat.image.trim(),
								        embed	 		 : dat.embed.trim(),
								        quotations	 	 : dat.quotations.trim(),
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
								redisClient.hgetall('bi_articles', function (err, data) {
								    if(err){
								    	resolve(message.SOMETHINGWRONG);
								    }else{
								    	
										resolve(response)
								    }
								})
								// resolve(response)
							}else{
								const response = {
									success : true,
									message : 'list of articles',
									data     : result.rows
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
				// 	const sql = `SELECT * FROM bi_articles WHERE subcat_id = '${subcatId}' AND is_status = '${1}' AND created_by = '${userId}'`;
				// 	client.query(sql, (error, result) => {
				// 		if(error){
				// 			resolve(message.SOMETHINGWRONG);
				// 		}else{
				// 			if(result.rows != ''){
				// 				for(let dat of result.rows)
				// 				{
				// 					const data = {
				// 						article_id		 : dat.article_id,
				// 				        title 			 : dat.title.trim(),
				// 				        written_on		 : dat.written_on.trim(),
				// 				        auther		 	 : dat.auther.trim(),
				// 				        description		 : dat.description.trim(),
				// 				        editor	 		 : dat.editor.trim(),
				// 				        image	 		 : dat.image.trim(),
				// 				        embed	 		 : dat.embed.trim(),
				// 				        quotations	 	 : dat.quotations.trim(),
				// 				        subcat_id		 : dat.subcat_id,
				// 				        is_status		 : dat.is_status,
				// 				        created_by		 : dat.created_by,
				// 				        created_on		 : dat.created_on.trim(),
				// 					}
				// 					articlesArray.push(data);
				// 				}
				// 				const response = {
				// 					success : true,
				// 					message : 'list of articles',
				// 					data     : articlesArray
				// 				}
				// 				redisClient.hgetall('bi_articles', function (err, data) {
				// 				    if(err){
				// 				    	resolve(message.SOMETHINGWRONG);
				// 				    }else{
								    	
				// 						resolve(response)
				// 				    }
				// 				})
				// 				//resolve(response)
				// 			}else{
				// 				resolve(message.EMPTY)			
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


/*** Update Articles ***/
module.exports.updateArticles = (user, info) => {
	return new Promise((resolve, reject) => {
		try{
			if (user.role_id > 2) {
				resolve(message.PERMISSIONERROR);
			}else{	

				const checksql = `SELECT * FROM bi_articles WHERE article_id = '${info.article_id}' AND subcat_id = '${info.subcat_id}'`;
				client.query(checksql, (err, res) =>{
					if (err) {
						resolve(message.SOMETHINGWRONG);
					}else{
						if (res.rows[0] != '') {
							const today = new Date();
							const written_on_date = (today.getMonth()+1) +'/'+today.getDate()+'/'+today.getFullYear();

							const sql  = `UPDATE bi_articles SET 
									title  		= '${info.title}',
									written_on  = '${written_on_date}',
									auther  	= '${info.auther}',
									description = '${info.description}',
									editor  	= '${info.editor}',
									image  		= '${info.image}', 
									embed 		= '${info.embed}',
									quotations  = '${info.quotations}',
									subcat_id   = '${info.subcat_id}' WHERE article_id = '${info.article_id}' AND  subcat_id = '${info.subcat_id}'`;

							client.query(sql, (error, result) =>{
								if (error) {
									resolve(message.SOMETHINGWRONG);
								}else{
									if (result) {
										const resdata = {
											article_id	  : res.rows[0].article_id,
											title 		  : info.title,
											written_on    : written_on_date,
											auther 		  : info.auther,
											description   : info.description,
											editor        : info.editor,
											image         : info.image,
											embed    	  : info.embed,
											quotations    : info.quotations,
											subcat_id     : info.subcat_id

										}
										redisClient.hmset('bi_articles', res.rows[0].title, JSON.stringify(resdata), function (err, data) {
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
									}else{
										resolve(message.NOTUPDATED);
									}
								}
							})	
							//resolve(message.UPDATEDSUCCESS);
						}
					}
				})



				// const sql  = `UPDATE bi_articles SET 
				// 					title  		= '${info.title}',
				// 					written_on  = '${info.written_on}',
				// 					auther  	= '${info.auther}',
				// 					description = '${info.description}',
				// 					editor  	= '${info.editor}',
				// 					image  		= '${info.image}', 
				// 					embed 		= '${info.embed}',
				// 					quotations  = '${info.quotations}',
				// 					subcat_id   = '${info.subcat_id}' WHERE subcat_id = '${info.subcat_id}'`;

				// client.query(sql, (error, result) =>{
				// 	if (error) {
				// 		resolve(message.SOMETHINGWRONG);
				// 	}else{
				// 		if (result) {
				// 			resolve(message.UPDATEDSUCCESS);
				// 		}
				// 	}
				// })
			}
		}catch(error){
			resolve(error)
		}
	})
}


/***  Delete Article ***/
module.exports.deleteArticle = (user, info) => {
	return new Promise((resolve, reject) => {
		try{
			if (user.role_id > 2) {
				resolve(message.PERMISSIONERROR);
			}else{
				const sql  = `DELETE FROM bi_articles WHERE article_id = '${info.article_id}'RETURNING title`;
				client.query(sql, (error, result) =>{
					console.log(result);
					if (error) {
						resolve(message.SOMETHINGWRONG);
					}else{
						if(result) {
							const article_title = result.rows[0].title.trim();
                            redisClient.hdel('bi_articles',article_title,function(err,redisdata){
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

/*** latestArtical ***/

