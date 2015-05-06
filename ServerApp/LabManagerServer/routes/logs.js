

function logRouter  (io){

	var router = require('express').Router();
	var models = require('../models');


	router.use(function (req, res, next) {
		//console.log('set header');
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		next();
	});

	io.on('connection', function (mySocket) {

		mySocket.on('notify', function (data) {

			console.log('date', data);

			mySocket.emit('newLog', { data: data });

		});

		/*
		 * api [GET] all logs
		 */
		router.get('/', function (req, res, next) {

			models.LogModel.find({}, function (err, data) {
				res.json(data);
			});

			//console.log('socket in router', mySocket.emit('newLog', { date: 'lalala' }));

			//mySocket.emit('newLog', { data: 'lalala' });

			// console.log('test after socket ');

		});


		/*
		 * api [GET] log with room id
		 */
		router.get('/:ctrl', function (req, res, next) {

			var roomID = req.params.ctrl;

			models.LogModel.find({
				"room": roomID
			}, function (err, data) {

				if (err) {
					console.log('err', err);
					res.json({
						'err': err
					});
				} else {
					res.json(data);
				}
			});
		});


		/*
		 * api [POST] add a new log
		 */
		router.post('/join', function (req, res, next) {

			//console.log('socket', socket);

			mySocket.emit('newLog', { data: 'new one ~!' });

			// log entity
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

			//save the entity
			logEntity.save(function (err) {

				if (err) {
					console.log(err);
					res.json(err);

				} else {
					console.log('[EVENT] add a new log, and ask for checkin');
					res.json({
						id: logEntity._id
					});
				}

			});
		});


		/*
		 * api [PUT] assent checkin
		 */
		router.put('/ckeckIn/assent/:id', function (req, res, next) {

			var query = {
				_id: req.params.id
			};

			models.LogModel.update(query, {
				inCheck: req.body.inCheck
			}, function () {
				console.log('[EVENT] assent checkIn : ' + req.body.sid + ',' + req.body.name);
				res.end();
			});
		});


		/*
		 * api [DELETE] ignore checkin, delete the log
		 */
		router.delete('/ckeckIn/ignore/:id', function (req, res, next) {

			var query = {
				_id: req.params.id
			};

			models.LogModel.remove(query, function () {
				console.log('[EVENT] ignore checkIn : ' + req.body.sid + ',' + req.body.name);
				res.end();
			});
		});


		/*
		 * api [PUT] ask for checkout
		 */
		router.put('/ckeckOut/:id', function (req, res, next) {

			var query = {
				_id: req.params.id
			};

			models.LogModel.update(query, {
				outCheck: 'waiting'
			}, function () {
				console.log('[EVENT] ask checkOut : ' + req.body.sid + ',' + req.body.name);
				res.end();
			});
		});


		/*
		 * api [PUT] assent the checkout
		 */
		router.put('/ckeckOut/assent/:id', function (req, res, next) {

			var query = {
				_id: req.params.id
			};

			models.LogModel.update(query, {
				outCheck: req.body.outCheck,
				outTime: req.body.outTime
			}, function () {
				console.log('[EVENT] assent checkOut : ' + req.body.sid + ',' + req.body.name);
				res.end();
			});
		});

	});

	return router;
}
module.exports = logRouter;