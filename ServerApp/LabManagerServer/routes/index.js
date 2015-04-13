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
		"name": "陳柏安",
		"room": "806",
		"posi": "討論1",
		"inTime": "2015/3/14-08:00",
		"outTime": "2015/3/14-16:00",
		"inCheck": "PH",
		"outCheck": "柔"
	});

//		logEntity.save(function (err) {
//			if (err) {
//				console.log(err);
//			} else {
//				console.log('saved');
//			}
//		});

	//讀取資料
	//	LogModel.find({}, function (err, data) {
	//		console.log('data', data);
	//	});

});


/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', {
		title: 'Express'
	});
});

/*
 * api
 */
router.get('/api/:ctrl', function (req, res, next) {
	var ctrl = req.params.ctrl;

	if (ctrl == 'all') {
		LogModel.find({}, function (err, data) {
			res.json(data);
		});
	}
});

module.exports = router;