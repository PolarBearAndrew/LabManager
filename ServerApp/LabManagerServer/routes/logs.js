

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

		mySocket.join('roomEveryone');

		mySocket.on('notify', function (data) {

			//console.log('date', data);

		});

		/*
		 * api [GET] all logs
		 */
		router.get('/', function (req, res, next) {

			models.LogModel.find({}, function (err, data) {
				res.json(data);
			});
			//mySocket.emit('newLog', { data: 'lalala' });
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

			var log = {
				"sid": req.body.sid,
				"name": req.body.name,
				"room": req.body.room,
				"posi": req.body.posi,
				"inTime": req.body.inTime,
				"outTime": ' ',
				"inCheck": req.body.inCheck,
				"outCheck": ""
			};


			// log entity
			var logEntity = new models.LogModel( log );

			//save the entity
			logEntity.save(function (err) {

				if (err) {
					console.log(err);
					res.json(err);

				} else {
					console.log('[EVENT] add a new log, and ask for checkin');

					log._id = logEntity._id;
					io.emit('newLog', { log: log });

					res.json({
						_id: logEntity._id
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

			var log = {
				"_id": req.body._id,
				"sid": req.body.sid,
				"name": req.body.name,
				"room": req.body.room,
				"posi": req.body.posi,
				"inTime": req.body.inTime,
				"outTime": ' ',
				"inCheck": req.body.inCheck,
				"outCheck": ''
			};

			io.emit('update', { log: log });


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

			var log = {
				"_id": req.body._id,
				"sid": req.body.sid,
				"name": req.body.name,
				"room": req.body.room,
				"posi": req.body.posi,
				"inTime": req.body.inTime,
				"outTime": ' ',
				"inCheck": req.body.inCheck,
				"outCheck": ""
			};

			io.emit('remove', { log: log });


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

			var log = {
				"_id": req.body._id,
				"sid": req.body.sid,
				"name": req.body.name,
				"room": req.body.room,
				"posi": req.body.posi,
				"inTime": req.body.inTime,
				"outTime": ' ',
				"inCheck": req.body.inCheck,
				"outCheck": req.body.outCheck
			};

			io.emit('update', { log: log });


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

			var log = {
				"_id": req.body._id,
				"sid": req.body.sid,
				"name": req.body.name,
				"room": req.body.room,
				"posi": req.body.posi,
				"inTime": req.body.inTime,
				"outTime": req.body.outTime,
				"inCheck": req.body.inCheck,
				"outCheck": req.body.outCheck
			};

			io.emit('checkout', { log: log });


			models.LogModel.update(query, {
				outCheck: req.body.outCheck,
				outTime: req.body.outTime
			}, function () {
				console.log('[EVENT] assent checkOut : ' + req.body.sid + ',' + req.body.name);
				res.end();
			});
		});


		/*
		 * api [PUT] assent the checkout
		 */
		router.put('/ckeckOut/ignore/:id', function (req, res, next) {

			var query = {
				_id: req.params.id
			};

			var log = {
				"_id": req.body._id,
				"sid": req.body.sid,
				"name": req.body.name,
				"room": req.body.room,
				"posi": req.body.posi,
				"inTime": req.body.inTime,
				"outTime": req.body.outTime,
				"inCheck": req.body.inCheck,
				"outCheck": req.body.outCheck
			};

			io.emit('checkout', { log: log });


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