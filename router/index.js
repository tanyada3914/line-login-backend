let router = require('express').Router()
router.use("/member", require("../api/member/routes"))
router.use("/message", require("../api/message/routes"))

module.exports = router