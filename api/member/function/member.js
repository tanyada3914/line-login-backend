const knexDB = require("../../../knex/knexfile")
const mysql = knexDB.mysql
const { postToDialogflow, createLineTextEvent, convertToDialogflow } = require('../../../dialogflow')
var axios = require('axios');

const InsertProfile = async (data) => {
    try {
        let response = await mysql("member_line_info").insert({
            "memberId": "1000000001111",
            "lineUserId": data.userId || '',
            "lineIdToken": data.idToken || '',
            "displayName": data.displayName || '',
            "statusMessage": data.statusMessage || '',
            "lineProfilePicture": data.pictureUrl || '',
        })

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
            // "mem_id": data.mem_id,
            "error message": error.sqlMessage
        })
    }
}
const checkMemberByMobileNo = async (mobileNo) => {
    try {
        let response = await mysql("member_line_info").select('*').where('mobileNo', mobileNo)
        if (response.length === 0) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.log(error)
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
    InsertProfile,
    createMember,
    updateMember,
    dialogFlow,
    verifyOtp,
    checkMemberByMobileNo
}