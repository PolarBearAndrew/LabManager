var router = require('express').Router();

/*
 * homepage
 */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/LabManager.oit', function (req, res, next) {
	res.render('index');
});


module.exports = router;