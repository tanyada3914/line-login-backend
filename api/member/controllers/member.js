const func = require('../function/member')
const express = require('express')
const router = express()
const line = require('@line/bot-sdk')

const config = {
    channel_access_token: process.env.channel_access_token,
    channelSecret: process.env.channel_secret
}

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
router
    .route("/createMember")
    .post(async (req, res) => {
        try {
            let response = await func.createMember(req.body)
            res.status(200).json(response)
        } catch (error) {
            console.log(error)
            res.status(500).json({ 'error': error })
        }
    })

router
    .route("/updateMember")
    .post(async (req, res) => {
        try {
            let response = await func.updateMember(req.body)
            res.status(200).json(response)
        } catch (error) {
            console.log(error)
            res.status(500).json({ 'error': error })
        }
    })
router
    .route("/webhook", line.middleware(config))
    .post(async (req, res) => {
        try {
            Promise.all(req.body.events.map(event => {
                return func.dialogFlow(req, event);
            }))
            res.status(200).json()
        } catch (error) {
            console.log(error)
            res.status(500).json({ 'error': error })
        }
    })

module.exports = router 