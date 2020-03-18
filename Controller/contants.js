const client 		= require("../db");
const message 		= require("../Helpers/message");
const redis 	    = require('redis');
const redisClient   = redis.createClient(6379, 'localhost');

/*** Create Contant ***/
module.exports.createContant = (user, info) => {
	return new Promise((resolve, reject) => {
		try{
			if (user.role_id == 1) {
				if (info.cat_id != '' && info.subcat_id == '') {
					const Chkcontant = `SELECT * FROM bi_contant WHERE title = '${info.title}' AND cat_id = '${info.cat_id}' `;
					client.query(Chkcontant, (err1, res1) => {
						if(err1){
							resolve(message.SOMETHINGWRONG);
						}else{
							if (res1.rows == '') {	
									const today = new Date();
									const written_on_date = (today.getMonth()+1) +'/'+today.getDate()+'/'+today.getFullYear();
								    const sql = `INSERT INTO bi_contant(title,written_on,auther,description,editor,image,embed,quotations,audio,cat_id,is_status,created_by,created_on) VALUES ('${info.title}','${written_on_date}','${info.auther}','${info.description}','${info.editor}','${info.image}','${info.embed}','${info.quotations}','${info.audio}','${info.cat_id}','${1}','${user.id}','${today}')RETURNING id`;
									
									client.query(sql, (error, result) => {
										if(error){
											resolve(message.SOMETHINGWRONG);
										}else{
											if (result != '') {
												const redata = {
													id 	  		  : result.rows[0].id,
													title  		  : info.title,
													written_on 	  : written_on_date,
													auther 		  : info.auther,
													description   : info.description,
													editor 		  : info.editor,
													image 		  : info.image,
													embed 		  : info.embed,
													quotations 	  : info.quotations,
													audio 	      : info.audio,
													subcat_id 	  : '',
													cat_id 	      : info.cat_id,
													is_status	  : 1,
													created_by    : user.id,
													created_on    : today
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
					const Chkcontant = `SELECT * FROM bi_contant WHERE title = '${info.title}' AND subcat_id = '${info.subcat_id}' AND cat_id = '${info.cat_id}' `;
					client.query(Chkcontant, (err1, res1) => {
						if(err1){
							resolve(message.SOMETHINGWRONG);
						}else{
							if (res1.rows == '') {	
									const today = new Date();
									const written_on_date = (today.getMonth()+1) +'/'+today.getDate()+'/'+today.getFullYear();
								    const sql = `INSERT INTO bi_contant(title,written_on,auther,description,editor,image,embed,quotations,audio,subcat_id,cat_id,is_status,created_by,created_on) VALUES ('${info.title}','${written_on_date}','${info.auther}','${info.description}','${info.editor}','${info.image}','${info.embed}','${info.quotations}','${info.audio}','${info.subcat_id}','${info.cat_id}','${1}','${user.id}','${today}')RETURNING id`;
									client.query(sql, (error, result) => {
										if(error){
											resolve(message.SOMETHINGWRONG);
										}else{
											if (result != '') {
												const redata = {
													id 	  		  : result.rows[0].id,
													title  		  : info.title,
													written_on 	  : written_on_date,
													auther 		  : info.auther,
													description   : info.description,
													editor 		  : info.editor,
													image 		  : info.image,
													embed 		  : info.embed,
													quotations 	  : info.quotations,
													audio		  : info.audio,	
													subcat_id 	  : info.subcat_id,
													cat_id 	      : info.cat_id,
													is_status	  : 1,
													created_by    : user.id,
													created_on    : today
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
				}	
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
			const userId = user.id;
			if (user.role_id > 2 ) {
				resolve(message.PERMISSIONERROR);
			}else{
				const articlesArray = [];
				if (userId == 1) {

					if (info.cat_id != '' && info.subcat_id == '') {
						const sql = `SELECT * FROM bi_contant WHERE cat_id = '${info.cat_id}' AND is_status = '${1}'`;
						client.query(sql, (error, result) => {
							if(error){
								resolve(message.SOMETHINGWRONG);
							}else{
								if(result.rows != ''){
									for(let dat of result.rows)
									{
										const data = {
											id	     	     : dat.id,
									        title 			 : dat.title.trim(),
									        written_on		 : dat.written_on.trim(),
									        auther		 	 : dat.auther.trim(),
									        description		 : dat.description.trim(),
									        editor	 		 : dat.editor.trim(),
									        image	 		 : dat.image.trim(),
									        embed	 		 : dat.embed.trim(),
									        quotations	 	 : dat.quotations.trim(),
									        audio			 : dat.audio.trim(),
									        subcat_id		 : dat.subcat_id,
									        cat_id		 	 : dat.cat_id,
									        is_status		 : dat.is_status,
									        created_by		 : dat.created_by,
									        created_on		 : dat.created_on.trim(),
										}
										articlesArray.push(data);
									}
									const response = {
										success : true,
										message : 'list of contant',
										data     : articlesArray
									}
									redisClient.hgetall('bi_contant', function (err, data) {
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
						})
					}else{
						const sql = `SELECT * FROM bi_contant WHERE cat_id = '${info.cat_id}' AND subcat_id = '${info.subcat_id}' AND is_status = '${1}'`;
						client.query(sql, (error, result) => {
							if(error){
								resolve(message.SOMETHINGWRONG);
							}else{
								if(result.rows != ''){
									for(let dat of result.rows)
									{
										const data = {
											id	     	     : dat.id,
									        title 			 : dat.title.trim(),
									        written_on		 : dat.written_on.trim(),
									        auther		 	 : dat.auther.trim(),
									        description		 : dat.description.trim(),
									        editor	 		 : dat.editor.trim(),
									        image	 		 : dat.image.trim(),
									        embed	 		 : dat.embed.trim(),
									        quotations	 	 : dat.quotations.trim(),
									        audio	 	     : dat.audio.trim(),
									        subcat_id		 : dat.subcat_id,
									        cat_id		 	 : dat.cat_id,
									        is_status		 : dat.is_status,
									        created_by		 : dat.created_by,
									        created_on		 : dat.created_on.trim(),
										}
										articlesArray.push(data);
									}
									const response = {
										success : true,
										message : 'list of contant',
										data     : articlesArray
									}
									redisClient.hgetall('bi_contant', function (err, data) {
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
						})
					}

				}else{

					if (info.cat_id != '' && info.subcat_id == '') {
						const sql = `SELECT * FROM bi_contant WHERE cat_id = '${info.cat_id}' AND is_status = '${1}' AND created_by = '${userId}'`;
						client.query(sql, (error, result) => {
							if(error){
								resolve(message.SOMETHINGWRONG);
							}else{
								if(result.rows != ''){
									for(let dat of result.rows)
									{
										const data = {
											id	     	     : dat.id,
									        title 			 : dat.title.trim(),
									        written_on		 : dat.written_on.trim(),
									        auther		 	 : dat.auther.trim(),
									        description		 : dat.description.trim(),
									        editor	 		 : dat.editor.trim(),
									        image	 		 : dat.image.trim(),
									        embed	 		 : dat.embed.trim(),
									        quotations	 	 : dat.quotations.trim(),
									        audio	 	     : dat.audio.trim(),
									        subcat_id		 : dat.subcat_id,
									        cat_id		 	 : dat.cat_id,
									        is_status		 : dat.is_status,
									        created_by		 : dat.created_by,
									        created_on		 : dat.created_on.trim(),
										}
										articlesArray.push(data);
									}
									const response = {
										success : true,
										message : 'list of contant',
										data     : articlesArray
									}
									redisClient.hgetall('bi_contant', function (err, data) {
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
						})
					}else{
						const sql = `SELECT * FROM bi_contant WHERE cat_id = '${info.cat_id}' AND subcat_id = '${info.subcat_id}' AND is_status = '${1}' AND created_by = '${userId}' `;
						client.query(sql, (error, result) => {
							if(error){
								resolve(message.SOMETHINGWRONG);
							}else{
								if(result.rows != ''){
									for(let dat of result.rows)
									{
										const data = {
											id	     	     : dat.id,
									        title 			 : dat.title.trim(),
									        written_on		 : dat.written_on.trim(),
									        auther		 	 : dat.auther.trim(),
									        description		 : dat.description.trim(),
									        editor	 		 : dat.editor.trim(),
									        image	 		 : dat.image.trim(),
									        embed	 		 : dat.embed.trim(),
									        quotations	 	 : dat.quotations.trim(),
									        audio	 	     : dat.audio.trim(),
									        subcat_id		 : dat.subcat_id,
									        cat_id		 	 : dat.cat_id,
									        is_status		 : dat.is_status,
									        created_by		 : dat.created_by,
									        created_on		 : dat.created_on.trim(),
										}
										articlesArray.push(data);
									}
									const response = {
										success : true,
										message : 'list of contant',
										data     : articlesArray
									}
									redisClient.hgetall('bi_contant', function (err, data) {
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
						})
					}
				}
			}
		}catch(error){
			resolve(error)
		}
	})
}


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