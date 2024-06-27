var mongoose = require('mongoose');
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
    company: {
        type: String,
        require: true
    },
    minRent: {
        type: String,
        required: true
    },
    maxRent: {
        type: String,
        required: true
    },
    location: {
        type: String,
        require: true
    },
    totalQuantity: {
        type: Number,
        default: 0
    },
    id: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model('Equipments', equipmentSchema);
