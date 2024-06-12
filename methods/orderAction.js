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

    getOrders: async (req, res) => {

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, msg: 'Email required'});
          }

        try {
            const orders = await Order.find({ email: email });
            if (orders.length === 0) {
              return res.status(404).json({ success: false, msg: 'No data found' });
            }
            res.json({ success: true, orders: orders });
          } catch (err) {
            console.error('Error fetching users:', err);
            res.status(500).json({ success: false, msg: 'Internal server error' });
          }
    }
}

module.exports = functions