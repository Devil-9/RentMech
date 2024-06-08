var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var equipmentSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    phone: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    productName: {
        type: String,
        require: true
    },
    model: {
        type: String,
        require: true
    },
    rent: {
        type: String,
        require: true
    },
    location: {
        type: String,
        require: true
    }

})

module.exports = mongoose.model('Equipment', equipmentSchema)