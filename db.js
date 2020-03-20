const {Client} 	= require('pg');


const client = new Client({
    user	:'postgres',
	password:'postgres',
	host	:'localhost',
	port 	: 5432,
	database:'redis',
	ssl		: false
})

// const client = new Client({
//     user	:'postgres',
// 	password:'admin',
// 	host	:'localhost',
// 	port 	: 5432,
// 	database:'redis',
// 	ssl		: false
// })


// if(client._connected == false){

// 		console.log('Connection not found');
// }else{
	client.connect().then((conn)=>{
		console.log('Connection Successfully');

	})
// }




module.exports=client;
// console.log(client._connected)

