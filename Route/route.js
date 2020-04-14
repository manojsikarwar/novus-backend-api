const express 		= require('express');
const router 		= express.Router();
const bodyParser 	= require('body-parser');
const User 			= require('./NovusOne-Route/user');
const Admin 		= require('./NovusOne-Route/admin');
const Super 		= require('./NovusOne-Route/superadmin');
const Application 	= require('./NovusOne-Route/application');
const File 			= require('../Controller/NovusOne-Controller/file_upload');
const List 			= require('./NovusOne-Route/list');
const {userAuthenticator} = require('../middlewares/authenticator');
const Category 		= require('./NovusBI-Route/category');
const Subcategory   = require('./NovusBI-Route/subcategories');
const Article       = require('./NovusBI-Route/articles');
const Contant       = require('./NovusBI-Route/contants');
const Comment       = require('./NovusBI-Route/comments');
const News          = require('./NovusBI-Route/news');
const Banner        = require('./NovusBI-Route/banner');
const Region 		= require('./NovusBI-Route/region_rout');
const Audio 		= require('../Controller/NovusBI-Controller/audio');
var cors   			= require('cors');


router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// =================== user ===============================

router.post('/signup',User.signup);
router.post('/login',User.login);
router.get('/user_profile',[userAuthenticator],User.user_profile);
router.put('/user_update_profile',[userAuthenticator],User.user_update_profile);
router.post('/user_change_password',[userAuthenticator],User.user_change_password);
router.post('/user_forget_password',User.user_forget_password);//mail
router.post('/ValidateUser',User.ValidateUser);
// ======================== Super Admin ==========================

router.post('/superlogin',User.superlogin);
router.get('/user_list',[userAuthenticator],Super.user_list);
router.post('/user_approve',[userAuthenticator],Super.user_approve);
router.post('/user_disapprove',[userAuthenticator],Super.user_disapprove);
router.post('/super_forget_password',Super.super_forget_password);//mail
router.post('/sendResetPasswordLink',Super.sendResetPasswordLink);//mail
router.post('/resetpassword/:token',Super.resetpassword);//mail
router.put('/super_update_profile',[userAuthenticator],Super.super_update_profile);
router.put('/admin_update_userProfile',[userAuthenticator],Super.admin_update_userProfile);
router.delete('/admin_delete_user',[userAuthenticator],Super.admin_delete_user);
router.post('/admin_search_user',[userAuthenticator],Super.admin_search_user);
router.post('/send_notification',[userAuthenticator],Super.send_notification);
router.post('/createAdmin',[userAuthenticator],Super.createAdmin);
router.post('/adminlist',[userAuthenticator],Super.adminlist);
router.post('/adminApproveAndDisapprove',[userAuthenticator],Super.adminApproveAndDisapprove);
router.delete('/deleteAdmin',[userAuthenticator],Super.deleteAdmin);

// ======================== Admin ==========================

router.post('/adminlogin',Admin.adminlogin);

// ===================== Aplication management ===================

router.post('/application_management',[userAuthenticator],Application.application_management);
router.get('/application_list',[userAuthenticator],Application.application_list);
router.delete('/admin_delete_application',[userAuthenticator],Application.admin_delete_application);
router.put('/admin_update_app',[userAuthenticator],Application.admin_update_app);
router.post('/admin_check_user',Application.admin_check_user);
router.post('/createUser',[userAuthenticator],Application.createUser);
router.post('/AppUserApprove',[userAuthenticator],Application.AppUserApprove);
// ===================== file ===================================

router.post('/file_upload',File.file_upload);
// router.post('/solution',File.solution);

// ==================== Country, state and city list ===============

router.get('/country_list',List.country_list);
router.post('/state_list',List.state_list);
router.post('/city_list',List.city_list);



//====================== Start Routing for Novus BI ===================== //

//======================== Novus BI Categories ==========================

router.post('/createCategories',[userAuthenticator],Category.createCategories);
router.get('/Categories',[userAuthenticator],Category.Categories);
router.get('/Categories_list',[userAuthenticator],Category.Categories_list);
router.put('/updateCategories',[userAuthenticator],Category.updateCategories);
router.delete('/deleteCategories',[userAuthenticator],Category.deleteCategories);


//======================== Novus BI Subcategories ==========================
// router.post('/createSubCategories',[userAuthenticator], Subcategory.createSubCategories);
router.post('/SubCategories',[userAuthenticator], Subcategory.SubCategories);
router.put('/updateSubCategories',[userAuthenticator], Subcategory.updateSubCategories);
// router.delete('/deleteSubCategories',[userAuthenticator], Subcategory.deleteSubCategories);


//========================== Novus BI Contant ========================
router.post('/createContant',[userAuthenticator], Contant.createContant);
router.post('/contants',[userAuthenticator], Contant.contants);
router.put('/updateContant',[userAuthenticator], Contant.updateContant);
router.delete('/deleteContant',[userAuthenticator], Contant.deleteContant);
router.put('/active_content',[userAuthenticator], Contant.active_content);
router.get('/tracecontant_list',[userAuthenticator], Contant.tracecontant_list);
router.get('/latestArtical',[userAuthenticator], Contant.latestArtical);
router.post('/contentRegion',[userAuthenticator], Contant.contentRegion);


//========================== Novus BI Comment ========================
router.post('/createComment',[userAuthenticator], Comment.createComment);
router.post('/comments',[userAuthenticator], Comment.comments);
router.put('/updateComment',[userAuthenticator], Comment.updateComment);
router.delete('/deleteComment',[userAuthenticator], Comment.deleteComment);


//====================== Novus BI Banner ====================
router.post('/createBanner',[userAuthenticator], Banner.createBanner);
router.get('/banner_list',[userAuthenticator], Banner.banner_list);
router.put('/updateBanner',[userAuthenticator], Banner.updateBanner);
router.delete('/deleteBanner',[userAuthenticator], Banner.deleteBanner);


//====================== Novus BI Audio ====================
router.post('/uploadAudio',Audio.uploadAudio);

//===================== Novus BI Region ====================

router.post('/region',Region.region);
router.get('/regionList',Region.regionList);
router.delete('/deleteRegion',Region.deleteRegion);
router.put('/updateRegion',Region.updateRegion);

//====================== Novus BI Articles ====================
router.post('/createArticle',[userAuthenticator], Article.createArticle);
router.post('/Articles',[userAuthenticator], Article.Articles);
router.put('/updateArticles',[userAuthenticator], Article.updateArticles);
router.delete('/deleteArticle',[userAuthenticator], Article.deleteArticle);


//====================== Novus BI News ====================
router.post('/createNews',[userAuthenticator], News.createNews);
router.post('/getNews',[userAuthenticator], News.getNews);
router.delete('/deleteNews',[userAuthenticator], News.deleteNews);




module.exports = router;

