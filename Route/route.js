const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('./user');
const Super = require('./superadmin');
const Application = require('./application');
const File = require('../Controller/file_upload');
const List = require('./list');
const {userAuthenticator} = require('../middlewares/authenticator');
var cors   = require('cors');


router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// =================== user ===============================

router.post('/signup',[userAuthenticator],User.signup);
router.post('/login',User.login);
router.get('/user_profile',[userAuthenticator],User.user_profile);
router.put('/user_update_profile',[userAuthenticator],User.user_update_profile);
router.post('/user_change_password',[userAuthenticator],User.user_change_password);
router.post('/user_forget_password',User.user_forget_password);//mail

// ======================== Super Admin ==========================

router.post('/superlogin',User.superlogin);
router.get('/user_list',[userAuthenticator],Super.user_list);
router.post('/user_approve',[userAuthenticator],Super.user_approve);
router.post('/user_disapprove',[userAuthenticator],Super.user_disapprove);
router.post('/super_forget_password',Super.super_forget_password);//mail
router.put('/super_update_profile',[userAuthenticator],Super.super_update_profile);
router.put('/admin_update_userProfile',[userAuthenticator],Super.admin_update_userProfile);
router.delete('/admin_delete_user',[userAuthenticator],Super.admin_delete_user);
router.post('/admin_search_user',[userAuthenticator],Super.admin_search_user);
router.post('/send_notification',[userAuthenticator],Super.send_notification);

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

// ==================== Country, state and city list ===============

router.get('/country_list',List.country_list);
router.post('/state_list',List.state_list);
router.post('/city_list',List.city_list);

module.exports = router;

