const func = require('../function/message')
const express = require('express')
const router = express()
const line = require('@line/bot-sdk')

const config = {
    channel_access_token: process.env.channel_access_token,
    channelSecret: process.env.channel_secret
}

router
    .route("/")
    .post(async (req, res) => {
        try {
            let userId = await func.searchLineUserId(req.body)
            if (typeof userId !== 'string') {
                res.status(200).json(userId)
            } else {
                if (req.body.messageType === 'text') {
                    let response = await func.sentText(req.body, userId)
                    res.status(200).json(response)
                } else {
                    res.status(303).json({
                        'status_code': '303',
                        'message': 'FAIL',
                        'error': 'Not messageType available',
                    })
                }
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({ 'error': error })
        }
    })
router
    .route("/multiText")
    .post(async (req, res) => {
        try {
            let response = []
            for (const element of req.body.messageBody) {
                let userId = await func.searchLineUserId({ memberId: element.memberId })
                if (typeof userId !== 'string') {
                    response.push(`${userId.message}`)
                } else {
                    let res = await func.sentText({ messageText: element.messageText }, userId)
                    response.push(`${res.message}: ${element.memberId}`)
                }
            }
            res.status(200).json({
                status_code: 200,
                status_phase: 'SUCCESS',
                message: response
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({ 'error': error })
        }
    })
router
    .route("/text")
    .post(async (req, res) => {
        try {
            let userId = await func.searchLineUserId(req.body)
            if (typeof userId !== 'string') {
                res.status(200).json(userId)
            } else {
                let response = await func.sentText(req.body, userId)
                res.status(200).json(response)
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({ 'error': error })
        }
    })
router
    .route("/flex")
    .post(async (req, res) => {
        try {
            let userId = await func.searchLineUserId(req.body)
            if (typeof userId !== 'string') {
                res.status(200).json(userId)
            } else {
                let response = await func.sentFlex(req.body, userId)
                res.status(200).json(response)
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({ 'error': error })
        }
    })
router
    .route("/sticker")
    .post(async (req, res) => {
        try {
            let userId = await func.searchLineUserId(req.body)
            if (typeof userId !== 'string') {
                res.status(200).json(userId)
            } else {
                let response = await func.sentSticker(req.body, userId)
                res.status(200).json(response)
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({ 'error': error })
        }
    })
router
    .route("/image")
    .post(async (req, res) => {
        try {
            let userId = await func.searchLineUserId(req.body)
            if (typeof userId !== 'string') {
                res.status(200).json(userId)
            } else {
                let response = await func.sentImage(req.body, userId)
                res.status(200).json(response)
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({ 'error': error })
        }
    })
router
    .route("/video")
    .post(async (req, res) => {
        try {
            let userId = await func.searchLineUserId(req.body)
            if (typeof userId !== 'string') {
                res.status(200).json(userId)
            } else {
                let response = await func.sentVideo(req.body, userId)
                res.status(200).json(response)
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({ 'error': error })
        }
    })
router
    .route("/audio")
    .post(async (req, res) => {
        try {
            let userId = await func.searchLineUserId(req.body)
            if (typeof userId !== 'string') {
                res.status(200).json(userId)
            } else {
                let response = await func.sentAudio(req.body, userId)
                res.status(200).json(response)
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({ 'error': error })
        }
    })
router
    .route("/location")
    .post(async (req, res) => {
        try {
            let userId = await func.searchLineUserId(req.body)
            if (typeof userId !== 'string') {
                res.status(200).json(userId)
            } else {
                let response = await func.sentLocation(req.body, userId)
                res.status(200).json(response)
            }
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