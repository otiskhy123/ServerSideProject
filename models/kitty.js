var mongoose = require('mongoose');


var kittySchema = mongoose.Schema({
	_id: Number,
	name: String,
	cuisine: String
});



module.exports = kittySchema;
