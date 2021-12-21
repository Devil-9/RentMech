const express = require('express')
const actions = require('../methods/actions')
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
router.post('/update', actions.updateinfo)

module.exports = router