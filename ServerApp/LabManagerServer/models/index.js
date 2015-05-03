var mongoose = require('mongoose').connect('mongodb://localhost:27017/LabManager'),
		db = mongoose.connection;
//db.on('error', console.error.bind(console, 'connection error:'));

var LogShema = new mongoose.Schema({
	"sid": { type: String },
	"name":  { type: String },
	"room":  { type: String },
	"posi":  { type: String },
	"inTime":  { type: String },
	"outTime":  { type: String },
	"inCheck":  { type: String },
	"outCheck":  { type: String }
});


var UserShema = new mongoose.Schema({
	"userId": { type: String },
	"name":  { type: String },
	"pwd":  { type: String },
	"lastLogInTime":  { type: String }
});

module.exports = {
	LogModel : db.model('loglists', LogShema),
	UserModel : db.model('Users', UserShema),
};