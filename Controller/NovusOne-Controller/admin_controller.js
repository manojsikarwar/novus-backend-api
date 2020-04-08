const client        = require('../../db');
const bcrypt        = require('bcrypt');
const jwt           = require('jsonwebtoken');
const moment        = require('moment');
const date          = new Date();
const myDate        = moment(date).format('L');
var redis           = require('redis');
var redisClient     = redis.createClient(6379, 'localhost');
const message       = require('../../Helpers/message');
const serverKey     = require('../../Helpers/serverKey');   
var randomToken     = require('random-token');
const nodemailer    = require('nodemailer');
const generator     = require('generate-password');
const FCM           = require('fcm-node');
const KEY           = serverKey.KEY;

module.exports.adminlogin = (body) => {
    return new Promise((resolve, reject) => {
        try {
            const email = body.email;
            const password = body.password;
            if (email != '' && password != '') {
                if (email && password) {
                    const checkAdmin = `select * from signup where trim(email) = '${email}' and role_id = '${2}' and status = '${0}'`;
                    client.query(checkAdmin, (adminerr, adminresult) => {
                        if (adminresult.rows != '') {
                            bcrypt.compare(password, adminresult.rows[0].password.trim(), (err, isMatch) => {
                                if (isMatch == true) {
                                    var token = jwt.sign({
                                        id: adminresult.rows[0].user_id,
                                        email: adminresult.rows[0].email,
                                        role_id: adminresult.rows[0].role_id
                                    }, 'secret', {
                                        expiresIn: "12hr"
                                    });
                                    redisClient.hget('user', email, function(err, reply) {
                                        const data = JSON.parse(reply)
                                        if (reply == null) {
                                            resolve(message.INVALIDEMAIL);
                                        } else {
                                            bcrypt.compare(password, adminresult.rows[0].password.trim(), (err, isMatch) => {
                                                if (isMatch == true) {
                                                    const appuser = `select * from application_management where application_id = '${adminresult.rows[0]. access_application_id}' and status = '${0}'`;                                                    
                                                    client.query(appuser, (apperr, appress) => {
                                                        if (apperr) {
                                                            resolve(message.SOMETHINGWRONG);
                                                        } else {
                                                            if (appress.rows == '') {
                                                                resolve(message.DATANOTFOUND);
                                                            } else {
                                                                appdata = {
                                                                    'app_id': appress.rows[0].application_id,
                                                                    'app_name': appress.rows[0].application_name.trim(),
                                                                    'app_icon': appress.rows[0].icon.trim(),
                                                                    'selected_countries': appress.rows[0].selected_countries.trim(),
                                                                    'status': appress.rows[0].status,
                                                                     'users_id':appress.rows[0].selected_user, //todo changes
                                                                    'created_date': appress.rows[0].created_date
                                                                }

                                                                redisClient.hget('application', appress.rows[0].application_name, function(err1, redress1) {
                                                                    if (err1) {
                                                                        resolve(message.SOMETHINGWRONG);
                                                                    } else {
                                                                        const Admindata = {
                                                                            "id": adminresult.rows[0].user_id,
                                                                            "fullname": adminresult.rows[0].fullname.trim(),
                                                                            "email": adminresult.rows[0].email.trim(),
                                                                            "zipcode": adminresult.rows[0].zipcode.trim(),
                                                                            "role_id": adminresult.rows[0].role_id,
                                                                            "status": adminresult.rows[0].status,
                                                                            "created_date": adminresult.rows[0].created_date.trim(),
                                                                            'application_data': appdata
                                                                        }
                                                                        const tokenData = {
                                                                            'success': true,
                                                                            'message': "Admin Log in successfully",
                                                                            'Status': 200,
                                                                            'token': token,
                                                                            'data': Admindata
                                                                        }
                                                                        resolve(tokenData)
                                                                    }
                                                                })
                                                            }
                                                        }
                                                    })


                                                } else {
                                                    resolve(message.PASSWORD)
                                                }
                                            })
                                        }
                                    })
                                } else {
                                    resolve(message.PASSWORD)
                                }
                            });
                        } else {
                            resolve(message.INVALIDEMAIL)

                        }
                    })
                } else {
                    resolve(message.PARAMETES)
                }
            } else {
                resolve(message.FILEDS)
            }
        } catch (error) {
            resolve(message.ERROR)
        }
    })
}