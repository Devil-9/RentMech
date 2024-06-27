var Vendor = require('../model/vendor');
var jwt = require('jwt-simple');
var config = require('../config/dbconfig');

var functions = {
    getVendor: async function (req, res) {
        try {
            const { email } = req.body;
            const vendor = await Vendor.findOne({ email });
            if (!vendor) {
                return res.status(404).json({ success: false, msg: 'Vendor not found' });
            }

            res.json({ success: true, user: vendor });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, msg: err });
        }
    }
};
module.exports = functions;