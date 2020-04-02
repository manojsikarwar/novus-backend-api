const multer = require('multer');
const client = require('../db');
var moment   = require('moment');
var myDate   = new Date();
var fs       = require('fs');
var date     = moment().format('LTS');
const date1  = moment().format('DD-MM-YYYY'); 
const csv    = require('csv-parser');
const bcrypt = require('bcrypt');
var cors     = require('cors')
// var mkdirp   = require('mkdirp');


//--------------- Storage the folder functionality ----------------
var storage = multer.diskStorage({
    destination: function(req, file, cd) {
        cd(null, 'uploads/audio')
    },
    filename: function(req, file, cd) {
        cd(null,file.originalname)
    }
})

// --------------------upload the file function--------------------
var upload = multer({
    storage: storage
}).any('');



//========================= Upload Audio =========================
module.exports.uploadAudio=async(req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.warn(err)
        } else {
            var imagename = req.files;
            console.log(imagename)
            const path = imagename[0].filename;
            const map1 = imagename.map(data => {
                var imageurl = "http://3.132.68.85:3000/"+path;
                // var imageurl = process.env.IMG+':'+process.env.PORT+'/'+path;
                
                res.json({
                    "success": true,
                    "message": 'Audio uploaded successfully',
                    "imageurl": imageurl,
                    'path':path
                })
            })
        }
    })
}