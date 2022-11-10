const knexDB = require("../../../knex/knexfile")
const mysql = knexDB.mysql
const { postToDialogflow, createLineTextEvent, convertToDialogflow } = require('../../../dialogflow')
var axios = require('axios');

const searchLineUserId = async (data) => {
    try {
        let response = await mysql("member_line_info").select('lineUserId').where('memberId', data.memberId)
        if (response.length === 0) {
            return {
                status_code: 200,
                status_phrase: 'FAIL',
                message: `Not found memberId : ${data.memberId}`
            }
        } else {
            return response[0].lineUserId
        }
    } catch (error) {
        console.log(error)
    }
}
const sentText = async (data, userId) => {
    try {
        await axios({
            method: 'post',
            url: `https://api.line.me/v2/bot/message/push`,
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.channel_access_token}` },
            data: {
                to: userId,
                messages: [{
                    type: "text",
                    text: data.messageBody || data.messageText
                }]
            }
        })
        return {
            "status_code": "200",
            "status_phrase": "SUCCESS",
            "message": `sent message success`
        }
    } catch (error) {
        console.log(error)
        return ({
            "status_code": "303",
            "status_phrase": "FAIL",
            "message": `sent message fail`,
            "error message": error.sqlMessage
        })
    }
}
const sentFlex = async (data, userId) => {
    try {
        await axios({
            method: 'post',
            url: `https://api.line.me/v2/bot/message/push`,
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.channel_access_token}` },
            data: {
                to: userId,
                messages: [{
                    "type": "flex",
                    "altText": "This is a Flex Message",
                    "contents": {
                      "type": "bubble",
                      "body": {
                        "type": "box",
                        "layout": "horizontal",
                        "contents": [
                          {
                            "type": "text",
                            "text": "Hello,"
                          },
                          {
                            "type": "text",
                            "text": "World!"
                          }
                        ]
                      }
                    }
                  }]
            }
        })
        return {
            "status_code": "200",
            "status_phrase": "SUCCESS",
            "message": `sent message success`
        }
    } catch (error) {
        console.log(error)
        return ({
            "status_code": "303",
            "status_phrase": "FAIL",
            "message": `sent message fail`,
            "error message": error.sqlMessage
        })
    }
}
const sentSticker = async (data, userId) => {
    try {
        await axios({
            method: 'post',
            url: `https://api.line.me/v2/bot/message/push`,
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.channel_access_token}` },
            data: {
                to: userId,
                messages: [{
                    type: "sticker",
                    packageId: data.packageId,
                    stickerId: data.stickerId
                }]
            }
        })
        return {
            "status_code": "200",
            "status_phrase": "SUCCESS",
            "message": `sent sticker success`
        }
    } catch (error) {
        console.log(error)
        return ({
            "status_code": "303",
            "status_phrase": "FAIL",
            "message": `Data not Correct`,
            "error message": error.sqlMessage
        })
    }
}
const sentImage = async (data, userId) => {
    try {
        await axios({
            method: 'post',
            url: `https://api.line.me/v2/bot/message/push`,
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.channel_access_token}` },
            data: {
                to: userId,
                messages: [{
                    type: "image",
                    originalContentUrl: data.originalContentUrl,
                    previewImageUrl: data.previewImageUrl
                }]
            }
        })
        return {
            "status_code": "200",
            "status_phrase": "SUCCESS",
            "message": `sent image success`
        }
    } catch (error) {
        console.log(error)
        return ({
            "status_code": "303",
            "status_phrase": "FAIL",
            "message": `Data not Correct`,
            "error message": error.sqlMessage
        })
    }
}
const sentVideo = async (data, userId) => {
    try {
        await axios({
            method: 'post',
            url: `https://api.line.me/v2/bot/message/push`,
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.channel_access_token}` },
            data: {
                to: userId,
                messages: [{
                    type: "video",
                    originalContentUrl: data.originalContentUrl,
                    previewImageUrl: data.previewImageUrl
                }]
            }
        })
        return {
            "status_code": "200",
            "status_phrase": "SUCCESS",
            "message": `sent video success`
        }
    } catch (error) {
        console.log(error)
        return ({
            "status_code": "303",
            "status_phrase": "FAIL",
            "message": `Data not Correct`,
            "error message": error.sqlMessage
        })
    }
}
const sentAudio = async (data, userId) => {
    try {
        await axios({
            method: 'post',
            url: `https://api.line.me/v2/bot/message/push`,
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.channel_access_token}` },
            data: {
                to: userId,
                messages: [{
                    type: "audio",
                    originalContentUrl: data.originalContentUrl,
                    duration: 1000
                }]
            }
        })
        return {
            "status_code": "200",
            "status_phrase": "SUCCESS",
            "message": `sent audio success`
        }
    } catch (error) {
        console.log(error)
        return ({
            "status_code": "303",
            "status_phrase": "FAIL",
            "message": `Data not Correct`,
            "error message": error.sqlMessage
        })
    }
}
const sentLocation = async (data, userId) => {
    try {
        await axios({
            method: 'post',
            url: `https://api.line.me/v2/bot/message/push`,
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.channel_access_token}` },
            data: {
                to: userId,
                messages: [{
                    type: "location",
                    title: data.title,
                    address: data.address,
                    latitude: data.latitude,
                    longitude: data.longitude
                }]
            }
        })
        return {
            "status_code": "200",
            "status_phrase": "SUCCESS",
            "message": `sent location success`
        }
    } catch (error) {
        console.log(error)
        return ({
            "status_code": "303",
            "status_phrase": "FAIL",
            "message": `Data not Correct`,
            "error message": error.sqlMessage
        })
    }
}

const createMember = async (data) => {
    try {
        let newMember = await checkMemberByMobileNo(data.mobileNo)
        if (newMember) {
            let no_series = await createNoSeries()
            let response = await mysql("member_line_info").insert({
                "memberId": no_series,
                "mobileNo": data.mobileNo || '',
                "lineIdToken": '',
                "refId": data.refId || '',
            })

            return ({
                status_code: "200",
                status_phrase: "OK",
                message: "Create Member SUCCESS!!",
                data: response,
            })
        } else {
            return ({
                status_code: "300",
                status_phrase: "FAIL",
                message: "Mobile No had already membered",
            })
        }
    } catch (error) {
        console.log(error)
        return ({
            "status_code": "303",
            "status_phrase": "FAIL",
            "message": `Data not Correct`,
            "error message": error.sqlMessage
        })
    }
}
const getProfile = async (userId) => {
    try {
        let url = `https://api.line.me/v2/bot/profile/${userId}`
        let headers = { 'Authorization': `Bearer ${process.env.channel_access_token}` }

        let res = await axios({
            method: 'get',
            url: url,
            headers: headers
        })
        if (res) {
            return res.data
        }
    } catch (error) {
        console.log(error)
    }
}
const updateMember = async (userId, mobile) => {
    try {
        let profile = await getProfile(userId)
        let response = await mysql("member_line_info").update({
            "lineUserId": profile.userId || '',
            "lineIdToken": profile.idToken || '',
            "displayName": profile.displayName || '',
            "statusMessage": profile.statusMessage || '',
            "lineProfilePicture": profile.pictureUrl || '',
        }).where('mobileNo', mobile)

        return ({
            status_code: "200",
            status_phrase: "OK",
            message: "Get Member Info SUCCESS!!",
            data: response,
        })
    } catch (error) {
        console.log(error)
        return ({
            "status_code": "303",
            "status_phrase": "FAIL",
            "message": `Data not Correct`,
            "error message": error.sqlMessage
        })
    }
}

const createNoSeries = async () => {
    try {
        let run
        let series
        let oldMember = await mysql('member_line_info').select('*')
        if (oldMember.length !== 0) {
            for (const element of oldMember) {
                element.run = parseInt(element.memberId[1] + element.memberId[2] + element.memberId[3] + element.memberId[4] + element.memberId[5] + element.memberId[6] + element.memberId[7] + element.memberId[8] + element.memberId[9] + element.memberId[10] + element.memberId[11] + element.memberId[12])
            }
            let uniqueArray = [...new Set(oldMember.map(item => item.run))];
            run = Math.max(...uniqueArray) + 1
        } else {
            run = 1
        }

        series = `1${await runNumber(run)}`
        return series
    } catch (error) {
        console.log(error)
    }
}
const runNumber = async (run) => {
    run = run.toString()
    while (run.length < 12) {
        run = "0" + run
    }
    return run
}

const requestOtp = async (req, event) => {
    const mobile = event.message.text
    let newMember = await checkMemberByMobileNo(mobile)

    if (!newMember) {
        await axios({
            method: 'post',
            url: `https://apigw.givingforward.online/otp/request`,
            headers: { 'auth-key': 'JBy6nryBOOMY40PFcUByZflgsQgBzrrM', 'Content-Type': 'application/json' },
            data: { mobile_no: mobile }
        })
            .then(function (response) {
                if (response.data.status_code === '200') {
                    const newEvent = createLineTextEvent(req, event, `MOBILE: ${response.data.mobile_number} , REF: ${response.data.OTP_ref}`);
                    convertToDialogflow(req, newEvent);
                } else {
                    const newEvent = createLineTextEvent(req, event, `MOBILE: ${mobile} , REF: ABCDE`);
                    convertToDialogflow(req, newEvent);
                }
                return JSON.stringify(response.data)
            })
            .catch(function (error) {
                console.log(error);
                return error
            });
    } else {
        const newEvent = createLineTextEvent(req, event, `MOBILE: ${mobile} , REF: ABCDE`);
        convertToDialogflow(req, newEvent);
    }


}
const sentOtp = async (req, event) => {
    const otp = event.message.text
    const newEvent = createLineTextEvent(req, event, `OTP: ${otp}`);
    convertToDialogflow(req, newEvent);
}
const verifyOtp = async (data) => {
    try {
        let res = await axios({
            method: 'post',
            url: `https://apigw.givingforward.online/otp/verify`,
            headers: { 'auth-key': 'JBy6nryBOOMY40PFcUByZflgsQgBzrrM', 'Content-Type': 'application/json' },
            data: {
                mobile_no: data.mobile,
                otp_ref: data.ref,
                otp_pin: data.otp
            }
        })
        if (res.data.status_code === '200') {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.log(error)
    }
}
const dialogFlow = async (req, event) => {
    try {
        switch (event.type) {
            case 'message':
                switch (event.message.type) {
                    case 'text':
                        switch (event.message.text.length) {
                            case 10:
                                return requestOtp(req, event);
                            case 6:
                                return sentOtp(req, event);
                        }
                        return postToDialogflow(req, event);
                    // case 'location':
                    //     return handleLocation(req, event);
                }
            // case 'postback':
            //     return handlePostback(req, event);
            default:
                throw new Error(`Unknown event: ${JSON.stringify(event)}`);
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    searchLineUserId,
    sentText,
    sentFlex,
    sentSticker,
    sentImage,
    sentVideo,
    sentAudio,
    sentLocation,
    createMember,
    updateMember,
    dialogFlow,
    verifyOtp,
    searchLineUserId
}