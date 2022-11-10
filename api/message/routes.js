const express = require("express")
const router = express.Router()
router.use(require('./controllers/message'))

module.exports = router