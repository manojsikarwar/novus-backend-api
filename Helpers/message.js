const message = {

	UNREGISTRATION 	: {'success':false,'message':'Try again Something wrong'},
	SOMETHINGWRONG 	: {'success':false,'message':'Something went wrong'},
	ALREADYUSE 		: {"success":false,"message":'Sorry, this user is already in use'},
	PARAMETES 		: {"success":false,"message":'Give correct parameters'},
	RESETTOKEN 		: {"success":false,"message":'Reset token required'},
	FILEDS  		: {"success":false,"message":'Fill all fields'},
	ERROR   		: {"success":false,"message":'Error'},
	INVALIDEMAIL	: {"success":false,'message':'Invalid Email Id'},
	INVALIDRESETTOKEN	: {"success":false,'message':'Invalid Reset Token'},
	PASSWORD    	: {'success':false,'message': "Incorrect Password"},
	USERCREATE    	: {'success':false,'message': "Your account is not activated by admin"},
	ACCOUNT 	   	: {'success':false,'message': "Could not find your account"},
	NOTPERMISSION  	: {'success':false,'message': "You have not permission"},
	CORRECTSTATUS   : {'success':false,'message': "Give correct status name"},
	DATANOTFOUND    : {'success':true,'message': "Data not found"},
	NOTACTIVEACCOUNT: {'success':false,'message': "User not activated"},
	USERPROFILE 	: {'success':false,'message':'Profile not found'},
	NOTAPPLICATION  : {'success':false,'message': "Not created application"},
	NOTUPDATE		: {'success':false,'message': "Not update profile "},
	NOTCOUNTIESLIST	: {'success':false,'message': "Not available countries list "},
	APPLICATION		: {"success":false,"message":'Sorry, this application is already in use'},
	PASSWORDNOTGEN	: {"success":false,"message":'password not generate'},
	NOTDISAPPROVEUSER: {'success':false,'message': "User not deleted"},
	ALREADYEMAIL	: {'success':false,'message': "Already exists"},

	//======================== true ====================================


	DISAPPROVEUSER  : {'success':true,'message': "User disapprove sucessfully"},
	ACTIVEACCOUNT   : {'success':true,'message': "User activated sucessfully"},
	ACTIVEACCOUNT   : {'success':true,'message': "User activated sucessfully"},
	REGISTRATION 	: {'success':true,'message':'Registration sucessfully'},
	PROFILEUPDATE 	: {'success':true,'message':'Profile updated sucessfully'},
	CHANGEPASSWORD 	: {'success':true,'message':'Successfuly Change Password'},
	CORRECTPASSWORD	: {'success':true,'message':'Please Enter Correct Password'},
	RESETPASSWORDSUCCESS	    : {'success':true,'message':'Reset password sucessfully'},
	MAIL_SEND	    : {'success':true,'message':'Mail send sucessfully'},
	SUCCESSAPPLICATION 	: {'success':true,'message':'Sucessfully created application'},
	USERDELETE 	    : {'success':true,'message':'User deleted sucessfully'},
	APP 	 	    : {'success':true,'message':'App deleted sucessfully'},
	APPUPDATE 	    : {'success':true,'message':'App updated sucessfully'},
	APPNOTUPDATE    : {'success':true,'message':'App not updated sucessfully'},
	NOTIFICATION 	: {'success':true,'message':'Successfully sent notification'}


}

module.exports = message