const express = require("express")
const app = express()
const bodyParser = require("body-parser")
global.moment = require('moment')
const port = 8009
const morgan = require("morgan")
require("dotenv").config()
const jwt = require("express-jwt")
const compression = require('compression')
const cors = require("cors")
const fs = require("fs")
const { WebhookClient } = require('dialogflow-fulfillment');
const { verifyOtp, updateMember, checkMemberByMobileNo } = require("./api/member/function/member")

app.use(compression())
app.use(
    morgan(
        ":method :url [:date[clf]] :status :res[content-length] - :response-time ms"
    )
)
global.knexDB = require("./knex/knexfile")

let servers = app.listen(port, function (err) {
    if (err) {
        console.log("somthing went wrong", err)
    } else {
        console.log("Server is listening on port " + port)
    }
})
global.privateKeyPath = __dirname + "/middleware/PrivateKey.key"
const privateKey = fs.readFileSync(privateKeyPath, "utf8");
app.use(cors());
app.use("/public", express.static("public"));
app.use(
    bodyParser.urlencoded({
        limit: "20mb",
        extended: true
    })
)
app.use(bodyParser.json({
    limit: "20mb"
}))
app.use(
    jwt({
        secret: privateKey,
        algorithms: ["HS256"],
        credentialsRequired: true,
        getToken: function fromHeaderOrQuerystring(req) {
            if (
                req.headers.authorization &&
                req.headers.authorization.split(" ")[0] === "Bearer"
            ) {
                return req.headers.authorization.split(" ")[1];
            } else if (req.query && req.query.token) {
                return req.query.token;
            }
            return null;
        }
    }).unless({
        path: ["/member/InsertProfile", "/member/createMember", "/member/webhook", "/member/fulfillment", "/fulfillment"]
    })
)
app.get("/", function (req, res, next) {
    res.send(`listening port ${port}`)
})

app.use(require('./router'))

async function handleFulfillment(agent) {
    const userId = agent.originalRequest.payload.data.source.userId;
    const { mobile, ref, otp } = agent.parameters;
    const doc = {
        uid: userId,
        mobile,
        ref,
        otp
    };
    let status_otp = await verifyOtp(doc)
    if (status_otp) {
        await updateMember(userId, mobile)
        agent.add('รหัส OTP ถูกต้อง ยืนยันตัวตนสำเร็จ');
    } else {
        // console.log('userId',userId)
        // await updateMember(userId, mobile)
        agent.add('รหัส OTP ไม่ถูกต้อง');
    }
}
async function handleFulfillmentMobile(agent) {
    const userId = agent.originalRequest.payload.data.source.userId;
    const { mobile, ref } = agent.parameters;
    const doc = {
        uid: userId,
        mobile,
        ref,
    };
    let newMember = await checkMemberByMobileNo(doc.mobile)

    if (!newMember) {
        agent.add(`กรุณากรอกรหัส OTP ที่ได้รับทาง SMS (#Ref: ${ref})`);
    } else {
        agent.add('ไม่มีหมายเลขนี้อยู่ในระบบ');
    }
}
// function handlerOne(agent) {
//     agent.add(`This is handler one`);
// }

// function handlerThree(agent) {
//     agent.add(`This is handler three`);
// }
app.post('/fulfillment', (request, response) => {
    const agent = new WebhookClient({ request, response });
    let intentMap = new Map();
    intentMap.set('register - mobile', handleFulfillmentMobile);
    intentMap.set('register - otpverify', handleFulfillment);
    agent.handleRequest(intentMap);
});


