const func = require('../function/member')
const express = require('express')
const router = express()

router
    .route("/InsertProfile")
    .post(async (req, res) => {
        try {
            let response = await func.InsertProfile(req.body)
            res.status(200).json(response)
        } catch (error) {
            console.log(error)
            res.status(500).json({ 'error': error })
        }
    })

module.exports = router 