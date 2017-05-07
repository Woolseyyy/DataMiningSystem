/**
 * Created by admin on 2017/5/6.
 */
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;
module.exports = mongoose.model('query', new Schema({
    itemID:String,
    statue:{type:'String', enum:['asking', 'handling', 'ok'], default:'asking'},
    data:{}
}));