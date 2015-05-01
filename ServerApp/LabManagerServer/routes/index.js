var router = require('express').Router();
//var models = require('../models');

/*
 * homepage
 */
router.get('/LabManager.oit', function (req, res, next) {
	res.render('index');
});


module.exports = router;