var Equipment = require('../model/equipment')
var jwt = require('jwt-simple')
var config = require('../config/dbconfig')

var functions = {
    addEquipment: function (req, res) {
        var newEquipment = Equipment ({
            name : req.body.name,
            phone : req.body.phone,
            location : req.body.location,
            productName : req.body.productName,
            rent : req.body.rent
        });

        newEquipment.save(function (err,newEquipment) {
            if (err) {
                res.json({success: false, msg: 'Failed to save'})
            }
            else {
                res.json({success: true, msg: 'Successfully saved'})
            }
        })
    },

    getEquipments: async (req, res) => {
        // try {
        //     const equipments = await Equipment.aggregate([
        //         {
        //             $group: {
        //                 _id: {
        //                     location: req.body.location,
        //                     // productName: req.body.productName
        //                 },
        //                 count: { $sum: 1},
        //                 equipments: { $push: "$$ROOT"}
        //             }
        //         },
        //         {
        //             $match: { count: { $gt: 1 } }
        //         },
        //         {
        //             $project: {
        //               _id: 0,
        //               equipments: 1
        //             }
        //         }
        //     ]);
        //     const flattenedEquipments = equipments.flatMap(group => group.equipments);
        //     res.json(flattenedEquipments);
        // } catch (err) {
        //     res.status(500).json({ success: false, msg: 'Internal server error' });
        // }

        const { productName, location } = req.body;

        if (!productName || !location) {
            return res.status(400).json({ success: false, msg: 'Name and location are required'});
          }

        try {
            const equipments = await Equipment.find({ location: location, productName: productName });
            
            if (equipments.length === 0) {
              return res.status(404).json({ success: false, msg: 'No users found' });
            }
        
            res.json({ success: true, equipments: equipments });
          } catch (err) {
            console.error('Error fetching users:', err);
            res.status(500).json({ success: false, msg: 'Internal server error' });
          }
    }
}

module.exports = functions