const client 		= require("../../db");
const message 		= require("../../Helpers/message");
const redis 	    = require('redis');
const moment 		= require('moment');
const date   		= new Date();
const myDate 		= moment(date).format('l');
const redisClient   = redis.createClient(6379, 'localhost');


module.exports.region = (user,body) => {
	return new Promise((resolve , reject) => {
		const country = body.country;
		// console.log(country.split(',')
		// console.log(country)
		const searchRegion = `select * from region where region_name = '${body.region_name}' `
		client.query(searchRegion, (error, result) => {
			if(error){
				resolve(message.SOMETHINGWRONG)
			}else{
				if(result.rows == ''){
					const insertRegion = `insert into region(region_name,country) values('${body.region_name}','${body.country}')`
					client.query(insertRegion, (insertError, insertResult) => {
						if(insertError) {
							resolve(message.SOMETHINGWRONG)
						}else {
							const redata = {
								region_id 	  : result.rows[0].comment_id,
								region_name	  : body.region_name,
								country 	  : body.country,
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
							resolve(message.CREATED)
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