var mongoose = require('mongoose') ;
var Schema = mongoose.Schema ;

var schema = new Schema({
    clinicname:{type:String, require: true} ,
     patientname:{type:String}
}) ;

module.exports = mongoose.model('clinic',schema) ;