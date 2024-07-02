var EquipmentsDetail = require('../model/equipmentsDetail');
var Equipment = require('../model/equipment');
var Vendor = require('../model/vendor');
var jwt = require('jwt-simple');
var config = require('../config/dbconfig');

var functions = {

    addVendor: function (req, res) {
        var newVendor = new Vendor({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address
        });

        // Check if a vendor with the same email already exists
        Vendor.findOne({ email: newVendor.email }, function (err, existingVendor) {
            if (err) {
                console.error('Error finding Vendor:', err);
                return res.status(500).json({ success: false, msg: 'Database error', error: err });
            }

            if (existingVendor) {
                // Return an error if a vendor with the same email already exists
                return res.status(400).json({ success: false, msg: 'Vendor with this email already exists', error: 'Duplicate Email' });
            }

            // Save new Vendor
            newVendor.save(function (err, savedVendor) {
                if (err) {
                    console.error('Error saving Vendor:', err);
                    return res.status(500).json({ success: false, msg: 'Failed to save Vendor', error: err });
                }
                res.json({ success: true, msg: 'Successfully added Vendor', vendor: savedVendor });
            });
        });
    },

    getVendorsList: function (req, res) {
        var { productName, model, company, location } = req.body;

        // Validate input
        if (!productName || !model || !company || !location) {
            return res.status(400).json({ success: false, msg: 'Missing required fields' });
        }

        // Find EquipmentsDetail entries that match the given criteria
        EquipmentsDetail.find({ productName, model, company, location }, 'email rent', function (err, details) {
            if (err) {
                console.error('Error finding EquipmentsDetail:', err);
                return res.status(500).json({ success: false, msg: 'Database error', error: err });
            }

            if (!details.length) {
                // Return a message if no matching entries are found
                return res.status(404).json({ success: false, msg: 'No matching Vendor found', error: 'Not found' });
            }

            // Format the results to include only email and rent
            var vendorList = details.map(detail => ({
                email: detail.email,
                rent: detail.rent
            }));

            // Return the formatted list
            res.json({ success: true, msg: 'Successfully retrieved vendor list', vendors: vendorList });
        });
    },

    addOrUpdateEquipmentsDetail: function (req, res) {
        var idDetail = `${req.body.email}@${req.body.productName}@${req.body.model}@${req.body.company}@${req.body.location}`;
        var idEquip = `${req.body.productName}@${req.body.model}@${req.body.company}@${req.body.location}`;
    
        // Parse rent range
        var rentRange = req.body.rent.split('-');
        var minRent = parseFloat(rentRange[0]);
        var maxRent = parseFloat(rentRange[1]);
    
        // Check if Vendor exists
        Vendor.findOne({ email: req.body.email }, function (err, vendor) {
            if (err) {
                console.error('Error finding Vendor:', err);
                return res.status(500).json({ success: false, msg: 'Database error', error: err });
            }
    
            if (!vendor) {
                // Return an error if Vendor does not exist
                return res.status(400).json({ success: false, msg: 'Vendor with this email does not exist', error: 'Vendor not found' });
            }
    
            // Check if EquipmentsDetail with the same id exists
            EquipmentsDetail.findOne({ id: idDetail }, function (err, existingDetail) {
                if (err) {
                    console.error('Error finding EquipmentsDetail:', err);
                    return res.status(500).json({ success: false, msg: 'Database error', error: err });
                }
    
                if (existingDetail) {
                    // Return an error if EquipmentsDetail with the same id already exists
                    return res.status(400).json({ success: false, msg: 'EquipmentsDetail with this ID already exists', error: 'Duplicate ID' });
                }
    
                // Create new EquipmentsDetail
                var newEquipmentsDetail = new EquipmentsDetail({
                    productName: req.body.productName,
                    model: req.body.model,
                    company: req.body.company,
                    minRent: minRent,
                    maxRent: maxRent,
                    location: req.body.location,
                    email: req.body.email,
                    quantity: req.body.quantity,
                    totalQuantity: req.body.totalQuantity,
                    availableQuantity: req.body.availableQuantity,
                    id: idDetail,
                    vendor: vendor._id // Associate with Vendor
                });
    
                // Save new EquipmentsDetail
                newEquipmentsDetail.save(function (err, savedDetail) {
                    if (err) {
                        console.error('Error saving EquipmentsDetail:', err);
                        return res.status(500).json({ success: false, msg: 'Failed to save EquipmentsDetail', error: err });
                    }
    
                    // Find the associated Equipment and update totalQuantity
                    Equipment.findOneAndUpdate(
                        {
                            productName: newEquipmentsDetail.productName,
                            model: newEquipmentsDetail.model,
                            company: newEquipmentsDetail.company,
                            id: idEquip,
                            location: newEquipmentsDetail.location
                        },
                        { $inc: { totalQuantity: newEquipmentsDetail.totalQuantity } }, // Increment totalQuantity by newEquipmentsDetail.totalQuantity
                        { upsert: true, new: true }, // Upsert: create new if not found, return updated record
                        function (err, equipment) {
                            if (err) {
                                console.error('Error updating Equipment:', err);
                                return res.status(500).json({ success: false, msg: 'Failed to update Equipment', error: err });
                            }
    
                            // Adjust minRent and maxRent based on new rent in EquipmentsDetail
                            if (!equipment.minRent || minRent < equipment.minRent) {
                                equipment.minRent = minRent;
                            }
    
                            if (!equipment.maxRent || maxRent > equipment.maxRent) {
                                equipment.maxRent = maxRent;
                            }
    
                            // Save updated Equipment
                            equipment.save(function (err) {
                                if (err) {
                                    console.error('Error saving Equipment:', err);
                                    return res.status(500).json({ success: false, msg: 'Failed to save Equipment', error: err });
                                }
                                res.json({ success: true, msg: 'Successfully added EquipmentsDetail and updated Equipment', detail: savedDetail });
                            });
                        }
                    );
                });
            });
        });
    }
    
};

module.exports = functions;
