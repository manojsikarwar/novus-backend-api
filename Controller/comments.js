const client 		= require("../db");
const message 		= require("../Helpers/message");
const redis 	    = require('redis');
const redisClient   = redis.createClient(6379, 'localhost');

/*** Create Comment ***/
module.exports.createComment = (user, info) => {
	return new Promise((resolve, reject) => {
		try{
			if (user.role_id == 1 || user.role_id == 2 || user.role_id == 4) {
				// resolve(user.id)
				const today = new Date();
				const findcommet = `select * from bi_contant where contant_id = '${info.contant_id}' `
				client.query(findcommet, (commeterr, commentress) => {
					if(commeterr){
						resolve(message.SOMETHINGWRONG)
					}else{
						if(commentress.rows != ''){
					    const sql = `INSERT INTO bi_comment(comment,contant_id,user_id,is_status,created_on) VALUES ('${info.comment}','${info.contant_id}','${user.id}','${1}','${today}')RETURNING comment_id`;
						client.query(sql, (error, result) => {
							if(error){
								resolve(message.SOMETHINGWRONG);
							}else{
								if (result != '') {
									const redata = {
										comment_id 	  : result.rows[0].comment_id,
										comment  	  : info.comment,
										contant_id 	  : info.contant_id,
										user_id 	  : user.id,
										description   : info.description,
										is_status	  : 1,
										created_on    : today
									}
									redisClient.hmset('bi_comment', result.rows[0].comment_id, JSON.stringify(redata), function (err, data) {
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
							const errmessage = {
								'status':false,
								'message':'this contant id not found'
							}
							resolve(errmessage)	
						}
					}
				})
			
			}else{
				resolve(message.PERMISSIONERROR);
			}			
		}catch(error){
			resolve(error);
		}
	})
}


/*** Comment list ***/
module.exports.comments = (user, contantId) => {
	return new Promise((resolve, reject) => {
		try{
			const userId = user.id;
			if (user.role_id > 2 ) {
				resolve(message.PERMISSIONERROR);
			}else{
				const commentArray = [];
				if (userId == 1) {
					const sql = `SELECT * FROM bi_comment WHERE contant_id = '${contantId}' AND is_status = '${1}'`;
					client.query(sql, (error, result) => {
						if(error){
							resolve(message.SOMETHINGWRONG);
						}else{
							if(result.rows != ''){
								for(let dat of result.rows)
								{
									const data = {
										comment_id		 : dat.comment_id,
								        comment 		 : dat.comment.trim(),
								        contant_id		 : dat.contant_id,
								        user_id		 	 : dat.user_id,
								        is_status		 : dat.is_status,								 
								        created_on		 : dat.created_on.trim(),
									}
									commentArray.push(data);
								}
								const response = {
									success : true,
									message : 'list of comments',
									data     : commentArray
								}
								redisClient.hgetall('bi_comment', function (err, data) {
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
					const sql = `SELECT * FROM bi_comment WHERE contant_id = '${contantId}' AND is_status = '${1}'`;
					client.query(sql, (error, result) => {
						if(error){
							resolve(message.SOMETHINGWRONG);
						}else{
							if(result.rows != ''){
								for(let dat of result.rows)
								{
									const data = {
										comment_id		 : dat.comment_id,
								        comment 		 : dat.comment.trim(),
								        contant_id		 : dat.contant_id,
								        user_id		 	 : dat.user_id,
								        is_status		 : dat.is_status,								 
								        created_on		 : dat.created_on.trim(),
									}
									commentArray.push(data);
								}
								const response = {
									success : true,
									message : 'list of comments',
									data     : commentArray
								}
								redisClient.hgetall('bi_comment', function (err, data) {
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


/*** Update Comment ***/
module.exports.updateComment = (user, info) => {
	return new Promise((resolve, reject) => {
		try{
			if (user.role_id > 2) {
				resolve(message.PERMISSIONERROR);
			}else{	

				const checksql = `SELECT * FROM bi_comment WHERE comment_id = '${info.comment_id}' AND user_id = '${info.user_id}'`;
				client.query(checksql, (err, res) =>{
					if (err) {
						resolve(message.SOMETHINGWRONG);
					}else{
						if (res.rows[0] != '') {
							const sql  = `UPDATE bi_comment SET comment = '${info.comment}' WHERE comment_id = '${info.comment_id}' AND  user_id = '${info.user_id}'`;

							client.query(sql, (error, result) =>{
								if (error) {
									resolve(message.SOMETHINGWRONG);
								}else{
									if (result) {
										const today = new Date();
										const resdata = {
											comment_id	  : res.rows[0].comment_id,
											comment 	  : info.comment,
											contant_id    : res.rows[0].contant_id,
											user_id 	  : res.rows[0].user_id,
											is_status     : res.rows[0].is_status,
											created_on    : today
										}
										redisClient.hmset('bi_comment', res.rows[0].comment_id, JSON.stringify(resdata), function (err, data) {
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


/***  Delete Comment ***/
module.exports.deleteComment = (user, info) => {
	return new Promise((resolve, reject) => {
		try{
			if (user.role_id > 2) {
				resolve(message.PERMISSIONERROR);
			}else{
				const sql  = `DELETE FROM bi_comment WHERE comment_id = '${info.comment_id}' AND user_id = '${info.user_id}'RETURNING comment_id`;
				client.query(sql, (error, result) =>{
					// console.log(result);
					if (error) {
						resolve(message.SOMETHINGWRONG);
					}else{
						if(result) {
							const commentId = result.rows[0].comment_id;
                            redisClient.hdel('bi_comment',commentId,function(err,redisdata){
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