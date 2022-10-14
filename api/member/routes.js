const express = require("express")
const router = express.Router()
router.use(require('./controllers/member'))

module.exports = router