var express = require('express');
var router = express.Router();
var mongoose = require('mongoose').connect('mongodb://localhost:27017/LabManager');
var db = mongoose.connection;

var LogModel;


db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () { //once, 一旦進入'open'狀況,就執行
	console.log("-->Database Connected.");

	//Mongoose對MongoDB的操作涉及三個層面：Schema, Model與Entity。
	//Schema是資料文件的骨架，本身不影響資料庫，用來產生Model。
	//Model是用Schema產生的模型。
	//Entity是用Model創建的實作。

	var LogShema = new mongoose.Schema({
		"sid": {
			type: String
		},
		"name": {
			type: String
		},
		"room": {
			type: String
		},
		"posi": {
			type: String
		},
		"inTime": {
			type: String
		},
		"outTime": {
			type: String
		},
		"inCheck": {
			type: String
		},
		"outCheck": {
			type: String
		}
	});
	LogShema.methods.speak = function () {
		console.log('LogShema --> ' + this.name);
	};

	LogModel = db.model('loglists', LogShema); //UserSchema來產生一個名(index)為”namelist”的Model並指定給變數UserModel。

	var logEntity = new LogModel({
		"sid": "101111212",
		"name": "洪于雅",
		"room": "802",
		"posi": "討論3",
		"inTime": "2015/3/14-08:00",
		"outTime": "2015/3/14-16:00",
		"inCheck": "PH",
		"outCheck": "柔"
	});

	//logEntity.save(function (err) {
	//	if (err) {
	//		console.log(err);
	//	} else {
	//		console.log('saved');
	//	}
	//});

	//讀取資料
	//	LogModel.find({}, function (err, data) {
	//		console.log('data', data);
	//	});

});


/* GET home page. */
router.get('/LabManager.oit', function (req, res, next) {
	res.render('index');
});

/*
 * api
 */
/* GET all logs */
router.get('/api/log/', function (req, res, next) {

	//get all log or the only one room log
	LogModel.find({}, function (err, data) {
		res.json(data);
	});
});

/* GET the logs with room ID */
router.get('/api/log/:ctrl', function (req, res, next) {
	var ctrl = req.params.ctrl;

	LogModel.find({
		"room": ctrl
	}, function (err, data) {
		res.json(data);
	});
});

/* POST add a new row of log. */
router.post('/api/join', function (req, res, next) {
	//console.log('req.body-->', req.body.sid);
	var logEntity = new LogModel({
		"sid": req.body.sid,
		"name": req.body.name,
		"room": req.body.room,
		"posi": req.body.posi,
		"inTime": req.body.inTime,
		"outTime": "",
		"inCheck": req.body.inCheck,
		"outCheck": ""
	});

	logEntity.save(function (err) {
		if (err) {
			res.json(err);
			console.log(err);
		} else {
			res.json({})
			console.log('saved, and ask for inCheck');
		}
	});
});

/* PUT reply for checkin. */
router.put('/api/ckeckIn/assent/:id', function (req, res, next) {

	var query = { _id: req.params.id };
	
	LogModel.update(query, { inCheck: req.params.inCheck }, function(){
		console.log('update success (inCheck assent)');
	});
});


/* PUT ask for checkout. */
router.put('/api/ckeckOut/:id', function (req, res, next) {

	var query = { _id: req.params.id };
	
	LogModel.update(query, { outCheck: 'waiting' }, function(){
		console.log('update success (outCheck)');
	});
});

/* PUT reply for checkout. */
router.put('/api/ckeckOut/assent/:id', function (req, res, next) {

	var query = { _id: req.params.id };
	
	LogModel.update(query, { outCheck: req.params.outCheck }, function(){
		console.log('update success (outCheck assent)');
	});
});


module.exports = router;