let router = require('express').Router()
router.use("/member", require("../api/member/routes"))

module.exports = router