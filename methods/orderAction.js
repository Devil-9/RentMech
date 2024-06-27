var Order = require('../model/order')
var EquipmentsDetail = require('../model/equipmentsDetail');
var Equipment = require('../model/equipment');
var jwt = require('jwt-simple')
var config = require('../config/dbconfig')

var functions = {
    makeOrder: function (req, res) {
        var newOrder = Order ({
            email : req.body.email,
            location : req.body.location,
            productName : req.body.productName,
            model : req.body.model,
            company : req.body.company,
            rent : "ND",
            date : req.body.date,
            duration : req.body.duration,
            address : req.body.address,
            status : req.body.status
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
    },

    acceptOrder: async function (req, res) {
        const { orderId, vendorEmail, rent } = req.body;
    
        try {
            // Find the order by orderId
            const order = await Order.findById(orderId);
            if (!order) {
                return res.status(404).json({ success: false, msg: 'Order not found' });
            }
            if(order.status == "completed" || order.status == "accepted") {
                return res.status(400).json({ success: false, msg: 'Order is already completed or accepted' })
            }
    
            // Update order details
            order.vendorEmail = vendorEmail; // Add vendor's email
            order.rent = rent; // Update rent
            order.status = 'accepted'; // Update status to accepted
    
            // Save updated order
            await order.save();
    
            // Update EquipmentsDetail and Equipment
            const equipmentsDetail = await EquipmentsDetail.findOne({
                productName: order.productName,
                model: order.model,
                company: order.company,
                email: vendorEmail
            });
    
            if (!equipmentsDetail) {
                return res.status(404).json({ success: false, msg: 'EquipmentsDetail not found' });
            }
    
            // Update availableQuantity in EquipmentsDetail
            if (equipmentsDetail.availableQuantity > 0) {
                equipmentsDetail.availableQuantity -= 1;
            }
    
            // Save updated EquipmentsDetail
            await equipmentsDetail.save();
    
            // Update totalQuantity in Equipment
            const equipment = await Equipment.findOne({
                productName: order.productName,
                model: order.model,
                company: order.company
            });
    
            if (!equipment) {
                return res.status(404).json({ success: false, msg: 'Equipment not found' });
            }
    
            // Update availableQuantity in EquipmentsDetail
            if (equipment.totalQuantity > 0) {
                equipment.totalQuantity -= 1;
            }
    
            // Save updated EquipmentsDetail
            await equipment.save();
    
            res.json({ success: true, msg: 'Order accepted', order: order });
        } catch (err) {
            console.error('Error accepting order:', err);
            res.status(500).json({ success: false, msg: 'Failed to accept order', error: err });
        }
    },

    completeOrder: async function (req, res) {
        const { orderId } = req.body;
    
        try {
            // Find the order by orderId
            const order = await Order.findById(orderId);
            if (!order) {
                return res.status(404).json({ success: false, msg: 'Order not found' });
            }
            if(order.status == "completed") {
                return res.status(400).json({ success: false, msg: 'Order is already completed' })
            }
    
            // Update order status to completed
            order.status = 'completed';
    
            // Save updated order
            await order.save();
    
            // Update EquipmentsDetail and Equipment
            const equipmentsDetail = await EquipmentsDetail.findOne({
                productName: order.productName,
                model: order.model,
                company: order.company,
                email: order.vendorEmail
            });
    
            if (!equipmentsDetail) {
                return res.status(404).json({ success: false, msg: 'EquipmentsDetail not found' });
            }
    
            // Increase availableQuantity in EquipmentsDetail
            equipmentsDetail.availableQuantity += 1;
    
            // Save updated EquipmentsDetail
            await equipmentsDetail.save();
    
            // Update totalQuantity in Equipment
            const equipment = await Equipment.findOne({
                productName: order.productName,
                model: order.model,
                company: order.company
            });
    
            if (!equipment) {
                return res.status(404).json({ success: false, msg: 'Equipment not found' });
            }
    
            // Increase totalQuantity in Equipment
            equipment.totalQuantity += 1;
    
            // Save updated Equipment
            await equipment.save();
    
            res.json({ success: true, msg: 'Order completed', order: order });
        } catch (err) {
            console.error('Error completing order:', err);
            res.status(500).json({ success: false, msg: 'Failed to complete order', error: err });
        }
    },
    
    cancelOrder: async function (req, res) {
        const { orderId } = req.body;
    
        try {
            // Find the order by orderId
            const order = await Order.findById(orderId);
            if (!order) {
                return res.status(404).json({ success: false, msg: 'Order not found' });
            }
            if(order.status == "completed") {
                return res.status(400).json({ success: false, msg: 'Order is already completed' })
            }
            // Update status to cancelled
            order.status = 'cancelled';
    
            // Save updated order
            await order.save();
            res.json({ success: true, msg: 'Order cancelled', order: order });
        } catch (err) {
            console.error('Error cancelling order:', err);
            res.status(500).json({ success: false, msg: 'Failed to cancel order', error: err });
        }
    },

    getOrdersByStatus: async function (req, res) {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ success: false, msg: 'Status parameter is required' });
        }

        try {
            const orders = await Order.find({ status: status });

            if (orders.length === 0) {
                return res.status(404).json({ success: false, msg: `No orders found with status '${status}'` });
            }

            res.json({ success: true, orders: orders });
        } catch (err) {
            console.error('Error fetching orders:', err);
            res.status(500).json({ success: false, msg: 'Internal server error', error: err });
        }
    }
}

module.exports = functions