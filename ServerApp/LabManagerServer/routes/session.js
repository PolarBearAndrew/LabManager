var router = require('express').Router();
//var models = require('../models');
var session = require('express-session');
router.use(session({ secret: 'sessionToken', cookie: { maxAge: 60000 }}))

/*
 * session api [POST] set isManager
 */
router.post('/session/manager', function(req, res, next) {
  req.session.isManager = true;
	//console.log('[TEST] req.session.isManager', req.session.isManager);
	res.json( {'isManager' : req.session.isManager, 'name' : 'Andrew' } );
})

/*
 * session api [DELETE] logout isManager
 */
router.delete('/session/manager/signout', function(req, res, next) {
  req.session.isManager = false;
	res.json( {'isManager' : false, 'name' : 'guest' } );
})



/*
 * session api [GET] get isManager and name
 */
router.get('/session/manager', function(req, res, next) {
  //req.session.isManager = true;
	console.log('[TOKEN] get isManager session ctrl -->', req.session.isManager);
	res.json( {'isManager' : req.session.isManager, 'name' : 'Andrew' } );
})


module.exports = router;