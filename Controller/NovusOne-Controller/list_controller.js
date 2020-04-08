const client 		= require('../../db');
const bcrypt 		= require('bcrypt');
const jwt			= require('jsonwebtoken');
const moment 		= require('moment');
const date   		= new Date();
const myDate 		= moment(date).format('L');
var redis 			= require('redis');
var redisClient 	= redis.createClient(6379, 'localhost');
const message 		= require('../../Helpers/message');	 


//=====================  country_list  =======================
//get

module.exports.country_list = () => {
	return new Promise((resolve,reject)=>{
	   	const conlist = `select * from countries`;
		client.query(conlist, (conlisterr,conlistress)=>{
			if(conlisterr){
				resolve(message.SOMETHINGWRONG)
			}else{
				if(conlistress.rows == ''){
					resolve(message.NOTCOUNTIESLIST)
				}else{
					const successMessage = {
						'success':true,
						'countriesList':conlistress.rows
					}
					resolve(successMessage);
				}
			}
	 	})
	})
}


//=====================  state_list  =======================
//post

module.exports.state_list = (body) => {
	return new Promise((resolve,reject)=>{
		const countryid = body.countryid
	   	const statelist = `select * from states where country_id = '${countryid}'`;
		client.query(statelist, (statelisterr,statelistress)=>{
			if(statelisterr){
				resolve(message.SOMETHINGWRONG)
			}else{
				if(statelistress.rows == ''){
					resolve(message.NOTCOUNTIESLIST)
				}else{
					const successMessage = {
						'success':true,
						'stateList':statelistress.rows
					}
					resolve(successMessage);
				}
			}
	 	})
	})
}

//=====================  city_list  =======================
//post

module.exports.city_list = (body) => {
	return new Promise((resolve,reject)=>{
		const stateId = body.stateId
	   	const citieslist = `select * from cities where state_id = '${stateId}'`;
		client.query(citieslist, (citieserr,citiesress)=>{
			if(citieserr){
				resolve(message.SOMETHINGWRONG)
			}else{
				if(citiesress.rows == ''){
					resolve(message.NOTCOUNTIESLIST)
				}else{
					const successMessage = {
						'success':true,
						'citylist':citiesress.rows
					}
					resolve(successMessage);
				
				}
			}
	 	})
	})
}