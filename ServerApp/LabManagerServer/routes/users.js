var router = require('express').Router();
var models = require('../models');



/*
 * api [POST] add a new user
 */
router.post('/api/new', function (req, res, next) {
	
	//log entity
	var userEntity = new models.UserModel({
		"userId": 'dep_01',
		"name":  'PH',
		"pwd":  'PH',
		"lastLogInTime":  Date.now()
	});
	
	//save the entity
	userEntity.save(function (err) {
		
		if (err) {
			console.log(err);
			res.json(err);
			
		} else {
			console.log('[EVENT] add a new user');
			res.json( {id: userEntity._id} ); //respone id
		}
		
	});
});


/*
 * api [POST] check user exists
 */
router.post('/api/check', function (req, res, next) {
	
	var id = req.body.userId,
			pwd = req.body.pwd;
	
	models.UserModel.findOne({ "userId" : id, "pwd" : pwd }, function (err, data) {
		
		//respone exists
		if(data){ 
			req.session.isManager = true;
			res.json( {'isManager' : req.session.isManager, 'name' : data.name } );
			//console.log('[TEST] req.session.isManager', req.session.isManager);

			
		}else{
			req.session.isManager = false;
			res.json( {'isManager' : req.session.isManager, 'name' : 'Guest' } );
			//console.log('[TEST] req.session.isManager', req.session.isManager);

		}
	});
});


module.exports = router;
