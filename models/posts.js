var mongoose = require('mongoose') ;
var Schema = mongoose.Schema ;
var mongoosePaginate = require('mongoose-paginate');
 


var schema = new Schema({
    newstype:{type:String, require: true} ,
    title:{type:String, require: true} ,
    body:{type:String, require: true} ,
    file:{type:String, require: true} , 
    date:  {type:Date, require: true} ,
    comments:  [{
        text: { type: String },
         date: { type: Date, default: Date.now },
         user: { type: String } ,
         name:{type:String} ,
      }] ,

}) ;

schema.plugin(mongoosePaginate);


module.exports = mongoose.model('posts',schema) ;