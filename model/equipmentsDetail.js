var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var equipmentsDetailSchema = new Schema({
    productName: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    maxRent :{
        type: String,
        required: true
    },
    minRent :{
        type: String,
        required: true
    },
    rent: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true,
        unique: true
    },
    totalQuantity: {
        type: Number,
        required: true
    },
    availableQuantity: {
        type: Number,
        required: true
    },
    vendor: {
        type: Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    }
});

module.exports = mongoose.model('EquipmentsDetail', equipmentsDetailSchema);
