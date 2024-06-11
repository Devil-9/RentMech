var Order = require('../model/order')
var jwt = require('jwt-simple')
var config = require('../config/dbconfig')

var functions = {
    makeOrder: function (req, res) {
        var newOrder = Order ({
            email : req.body.email,
            phone : req.body.phone,
            location : req.body.location,
            productName : req.body.productName,
            rent : req.body.rent
        });

        newOrder.save(function (err,newOrder) {
            if (err) {
                res.json({success: false, msg: 'Failed to save'})
            }
            else {
                res.json({success: true, msg: 'Successfully saved'})
            }
        })
    },
}

module.exports = functions