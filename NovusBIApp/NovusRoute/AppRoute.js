const express 		= require('express');
const router 		= express.Router();
const bodyParser 	= require('body-parser');
// const List 			= require('./list');
const {userAuthenticator} = require('../../middlewares/authenticator');
const UserBI 		= require('./AppUser');
// const Subcategory   = require('./subcategories');
// const Article       = require('./articles');
// const Contant       = require('./contants');
// const Comment       = require('./comments');
// const News          = require('./news');
// const Banner        = require('./banner');
// const Audio 		= require('../Controller/audio');
var cors   			= require('cors');

	
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());



// ===================== Novus BI App user =======================

router.post('/NovusUser', UserBI.NovusUser);
router.post('/appuser_login', UserBI.appuser_login);
router.post('/articles_list',userAuthenticator,UserBI.articles_list);

// router.post('/')



module.exports = router;