const express = require('express')
const actions = require('../methods/actions')
const equipmentActions = require('../methods/equipmentActions')
const orderAction = require('../methods/orderAction')
const equipmentsDetailAction = require('../methods/equipmentsDetailAction')
const router = express.Router()

router.get('/', (req, res) => {
    res.send('Welcome...')
})

router.get('/abhinay', (req, res) => {
    res.send('hello abhinay')
})

//add a user
router.post('/adduser', actions.addNew)
router.post('/authenticate', actions.authenticate)
router.get('/getinfo', actions.getinfo)
router.post('/getUser', actions.getUser)
router.post('/update', actions.updateinfo)
router.post('/check-email', actions.checkEmailExists);
router.post('/addEquipment', equipmentActions.addEquipment)
router.post('/getEquipments', equipmentActions.getEquipments)
router.post('/makeOrder', orderAction.makeOrder)
router.post('/getOrders', orderAction.getOrders)
router.post('/acceptOrder', orderAction.acceptOrder)
router.post('/completeOrder', orderAction.completeOrder)
router.post('/cancelOrder', orderAction.cancelOrder)
router.post('/getOrdersByStatus', orderAction.getOrdersByStatus)
router.post('/addEquipmentsDetail', equipmentsDetailAction.addOrUpdateEquipmentsDetail)
router.post('/addVendor', equipmentsDetailAction.addVendor)

module.exports = router
