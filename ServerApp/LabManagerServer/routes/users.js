var router = require('express').Router();
var models = require('../models');

router.get('/test', function(req, res, next) {
  res.json({ 'test' : 'succes' });
});

/*
 * api [POST] add a new user
 */
router.post('/api/new', function (req, res, next) {
	
	// log entity
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
			res.json( {id: userEntity._id} );
		}
		
	});
});


module.exports = router;
