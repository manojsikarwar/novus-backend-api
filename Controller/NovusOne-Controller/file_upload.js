const multer = require('multer');
const client = require('../../db');
var moment   = require('moment');
var myDate   = new Date();
var fs       = require('fs');
var date     = moment().format('LTS');
const date1  = moment().format('DD-MM-YYYY'); 
const csv    = require('csv-parser');
const bcrypt = require('bcrypt');
var cors     = require('cors')
// var mkdirp   = require('mkdirp');




//====================  image upload  ======================


//Storage the folder functionality
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        if(file.mimetype == 'image/jpeg' || 'image/png'){
            cb(null, 'uploads/');
        }else{
            return cb({'success':false,'message':'Only png, jpeg file can upload'});
        }
    },
    filename: function(req, file, cd) {
        var f1 = file.originalname;
        var text  = f1.split('.')[1];
        var finle_name = Math.random()+'.'+text;
        cd(null, finle_name)
    }
})

//upload the file function
var upload = multer({
    storage: storage
}).any('');

module.exports.file_upload = (req, res) => {
    upload(req, res, function(err) {
        if(err) {
            res.json(err)
        }else {
            var imagename = req.files;
            const path = imagename[0].filename;
            const map1 = imagename.map(data => {
                
                var imageurl = "http://3.132.68.85:3000/"+path;
                // var imageurl = "http://localhost:3000/"+path;
                // var imageurl = process.env.IMG+':'+process.env.PORT+'/'+path;
                
                res.json({
                    "success": true,
                    "message": 'Image uploaded successfully',
                    "imageurl": imageurl,
                    'path':path
                })
            })
        }
    })
}

// module.exports.solution = (req, res) => {

//     try{
//         const date = req.body.D;
//         const d1 = Object.keys(date)
//         // console.log(d1)
//         const start = d1[0];
//         const end = d1[1];
//         var startDate = new Date(start); //YYYY-MM-DD
//         var endDate = new Date(end); //YYYY-MM-DD
//         var arr = new Array();
//         var dt = new Date(startDate);
//         while (dt <= endDate) {
//             arr.push(new Date(dt));
//             dt.setDate(dt.getDate()+1);
//         }
//         // console.log(arr)
//         res.send(arr)

//     }catch(error){
//         // console.log(error)
//         res.send(error)
//     }
// }