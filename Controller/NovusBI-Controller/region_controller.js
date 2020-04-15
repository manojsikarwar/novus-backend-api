const client 		= require("../../db");
const message 		= require("../../Helpers/message");
const redis 	    = require('redis');
const moment 		= require('moment');
const date   		= new Date();
const myDate 		= moment(date).format('l');
const redisClient   = redis.createClient(6379, 'localhost');

//=============== Add region ====================
//post

module.exports.region = (body) => {
	return new Promise((resolve , reject) => {
		const searchRegion = `select * from region where region_name = '${body.region_name}' `
		client.query(searchRegion, (error, result) => {
			if(error){
				resolve(message.SOMETHINGWRONG)
			}else{
				if(result.rows == ''){
					const insertRegion = `insert into region(region_name,country) values('${body.region_name}','${body.country}')RETURNING region_id `
						client.query(insertRegion, (insertError, insertResult) => {
							if(insertError) {
								resolve(message.SOMETHINGWRONG)
							}else {
								var region_id = insertResult.rows[0].region_id
								const redata = {
									region_id 	  : region_id,
									region_name	  : body.region_name,
									country 	  : body.country,
								}
								redisClient.hmset('region', insertResult.rows[0].region_id, JSON.stringify(redata), function (err, data) {
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
								// resolve(message.CREATED)
								const ID1 = body.country;
								const ConID = ID1.split(',');
								for(let ContID of ConID){
									const insertRegion = `insert into region_country(region_id,country) values('${region_id}','${ContID}')RETURNING r_id `
									client.query(insertRegion, (insertError, insertResult) => {
										if(insertError) {
											resolve(message.SOMETHINGWRONG)
										}else {
											const redata = {
												r_id 	  : insertResult.rows[0].r_id,
												country   : ContID,
											}
											redisClient.hmset('region_country', insertResult.rows[0].r_id, JSON.stringify(redata), function (err, data) {
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
											resolve(message.CREATED)
										}
									})
								}
							}
						})
				}else{
					const errMessage = {
						'success' : false,
						'message' : 'This Region already present'
					}
					resolve(errMessage)
				}
			}
		})
	})
}

//============= Resion List ======================
//get

module.exports.regionList = () => {
	return new Promise((resolve,reject)=>{
	   	const reslist = `select * from region `;
		client.query(reslist, (reserror,resresult)=>{
			if(reserror){
				resolve(message.SOMETHINGWRONG)
			}else{
				if(resresult.rows == ''){
					resolve(message.NOTCOUNTIESLIST)
				}else{
					redisClient.hgetall('region', function (err, data) {
					    if(err){
					    	resolve(message.SOMETHINGWRONG);
					    }else{
							const successMessage = {
								'success':true,
								'RegionList':resresult.rows
							}
							resolve(successMessage);
					    }
					})
				}
			}
	 	})
	})
}

//===============  Delete Region =================
//delete

module.exports.deleteRegion = (info) => {
	return new Promise((resolve, reject) => {
		try{
			// resolve(info)
			const findregion = `select * from region where region_id = '${info.region_id}'`;
			client.query(findregion, (regionError, regionResult) => {
				if(regionError){
					resolve(message.SOMETHINGWRONG)
				}else{
					// resolve(regionResult.rows)
					if(regionResult.rows != ''){
						const sql  = `DELETE FROM region WHERE region_id = '${info.region_id}'`;
						client.query(sql, (error, result) =>{
							if (error) {
								resolve(message.SOMETHINGWRONG);
							}else{
								if(result) {
									console.log(result)
		                            redisClient.hdel('region',info.region_id,function(err,redisdata){
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
					}else{
						resolve(message.ALREADYDEL);
					}
				}
			})
		}catch(error){
			console.log(error)
		}
	})
}

//=============== Update Region ==================
//put

module.exports.updateRegion = (info) => {
	return new Promise((resolve, reject) => {
		try{
			const checksql = `SELECT * FROM region WHERE region_id = '${info.region_id}'`;
			client.query(checksql, (err, res) =>{
				if (err) {
					resolve(message.SOMETHINGWRONG);
				}else{
					// resolve(res.rows)
					if (res.rows != '') {
						const sql  = `UPDATE region SET region_name = '${info.region_name}',country = '${info.country}' WHERE region_id = '${info.region_id}'`;
						client.query(sql, (error, result) =>{
							if (error) {
								resolve(message.SOMETHINGWRONG);
							}else{
								if (result.rowCount >= 1) {
									const resdata = {
										region_id	  	: res.rows[0].region_id,
										region_name 	: info.region_name,
										country   		: info.country,
									}
									redisClient.hmset('region', res.rows[0].region_id, JSON.stringify(resdata), function (err, data) {
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
		}catch(error){
			console.log(error)
		}
	})
}

