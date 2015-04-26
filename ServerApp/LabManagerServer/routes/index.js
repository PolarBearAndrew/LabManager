var express = require('express');
var router = express.Router();

var models = require('../models');

/* GET home page. */
router.get('/LabManager.oit', function (req, res, next) {
	console.log('models', models.LogModel);
	res.render('index');
});


/*
 * api
 */
/* GET all logs */
router.get('/api/log/', function (req, res, next) {

	//get all log or the only one room log
	models.LogModel.find({}, function (err, data) {
		res.json(data);
	});
});

/* GET the logs with room ID */
router.get('/api/log/:ctrl', function (req, res, next) {
	var ctrl = req.params.ctrl;
	
	models.LogModel.find({
		"room": ctrl
	}, function (err, data) {
		if(err){
			console.log('err', err);
		}
		res.json(data);
	});
});

/* POST add a new row of log. */
router.post('/api/join', function (req, res, next) {
	//console.log('req.body-->', req.body.sid);
	
	var logEntity = new models.LogModel({
		"sid": req.body.sid,
		"name": req.body.name,
		"room": req.body.room,
		"posi": req.body.posi,
		"inTime": req.body.inTime,
		"outTime": "",
		"inCheck": req.body.inCheck,
		"outCheck": ""
	});
	
	console.log('entity', logEntity);

	logEntity.save(function (err) {
		if (err) {
			res.json(err);
			console.log(err);
		} else {
			res.json({id: logEntity._id})
			console.log('saved, and ask for inCheck');
		}
		res.end();
	});
});

/* PUT reply for checkin. */
router.put('/api/ckeckIn/assent/:id', function (req, res, next) {

	var query = { _id: req.params.id };
	
	models.LogModel.update(query, { inCheck: req.body.inCheck }, function(){
		console.log('[EVENT] assent checkIn : ' + req.body.sid + ',' + req.body.name);
		res.end();
	});
});


/* DELETE reply while checkin */
router.delete('/api/ckeckIn/ignore/:id', function (req, res, next) {

	var query = { _id: req.params.id };
	
	models.LogModel.remove(query, function(){
		console.log('[EVENT] ignore checkIn : ' + req.body.sid + ',' + req.body.name);
		res.end();
	});
});


/* PUT ask for checkout. */
router.put('/api/ckeckOut/:id', function (req, res, next) {

	var query = { _id: req.params.id };
	
	models.LogModel.update(query, { outCheck: 'waiting' }, function(){
		console.log('[EVENT] ask checkOut : ' + req.body.sid + ',' + req.body.name);
		res.end();
	});
});

/* PUT reply for checkout. */
router.put('/api/ckeckOut/assent/:id', function (req, res, next) {

	var query = { _id: req.params.id };
	
	models.LogModel.update(query, { outCheck: req.body.outCheck, outTime: req.body.outTime }, function(){
		console.log('[EVENT] assent checkOut : ' + req.body.sid + ',' + req.body.name);
		res.end();
	});
});


module.exports = router;