const express = require('express');
const app = express();
const env = require('dotenv').config();
const api = require('./Route/route');
const novusapp = require('./NovusBIApp/NovusRoute/AppRoute');
const jwt = require('jsonwebtoken');
var redis = require('redis');
var cors  = require('cors')
var redisClient = redis.createClient({host : 'localhost', port : 6379});
const curl = require( 'curl' );
var request = require('request');

app.use(express.static("uploads"));
app.use(cors());


// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({extended:true}))
// curl.get(url, options, function(err, response, body) {});
// curl.post(url, body, options, function(err, response, body) {});

// request('http://cb805957.ngrok.io', function (error, response, body) {
//   console.log('error:', error); // Print the error if one occurred
//   console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//   console.log('body:', body); // Print the HTML for the Google homepage.
// });


// Enable CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// Get the Access Token
// TODO: Validate the JWT token
app.use((req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        const token = req.headers.authorization.split(' ')[1]; 
        if (token) {
            return jwt.verify(token,'secret', (err, userData) => {  
                // console.log(userData)
                if(err){
                     res.status(401).json(err);
                }else{
                    req.user = {
                        id      : userData.id,
                        username: userData.user_name,
                        user_name: userData.username,
                        application_id  : userData.application_id,
                        email   : userData.email,
                        role_id : userData.role_id,
                        company : userData.company,
                        status  : userData.status,
                        token   : token,
                        exp     : userData.exp
                    }
                }
                return next();
            });
        }
        return res.unauthorized();
    }
    next();
});

// =============== Novus BI App =====================

// app.use((req, res, next) => {
//     if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
//         const token = req.headers.authorization.split(' ')[1]; 
//         if (token) {
//             return jwt.verify(token,'secretKey', (err, userData) => {  
//                 if(err){
//                      res.status(401).json(err);
//                 }else{
//                     req.user = {
//                          id             : getuserress.rows[0].user_id,
                        
                        
//                         status          :getuserress.rows[0].status,
//                         // token           : token,
//                         exp             : userData.exp
//                     }
//                 }
//                 return next();
//             });
//         }
//         return res.unauthorized();
//     }
//     next();
// });

redisClient.on('ready',function(err, data) {
	if(err){
		console.log("Error in Redis");
	}else{
	 	console.log("Redis is ready");
	}
});

app.use('/api',api);
app.use('/novusapp',novusapp);

app.listen(3000,console.log('Server Run 3000'))
