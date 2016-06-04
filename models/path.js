var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pathSchema = new Schema({
	strokeWidth: Number,
	stroke: String,
	path : { type : Array , "default" : [] }
});

var Path = mongoose.model("Path", pathSchema);

// make this available to our users in our Node applications
module.exports = Path;