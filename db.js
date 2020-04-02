const {Client} 	= require('pg');


const client = new Client({
    user	:'postgres',
	password:'postgres',
	host	:'localhost',
	port 	: 5432,
	database:'redis',
	ssl		: false
})



client.connect().then((conn)=>{
	console.log('Connection Successfully');

})


module.exports=client;

