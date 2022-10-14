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
const schedule = require('node-schedule')
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
        path: ["/auth/login_online_bp", "/auth/login_member", "/auth/login_pos_bp",
            "/auth/test", "/auth/check_member", "/auth/check_online_bp", "/auth/check_pos_bp",
            "/auth/login_bp_user", "/auth/login_bo_user", "/member/checkMemberID",
            "/member/checkMemberMobile", "/online_bp/checkMemberID", "/online_bp/checkOnlineBPMobile",
            "/pos_bp/checkPosBPMobile", "/pos_bp/checkPosBPID", "/auth/check_company_pos",
            "/auth/check_company_member", "/auth/check_company_online",
            "/member/checkMemberMobileID", "/member/checkMemberMailPassword", "/member/checkMemberMail", "/member/checkMember",
            "/pos_bp/checkPosBPMobileID", "/pos_bp/checkPosBPMail", "/pos_bp/checkPosBPMailPassword", "/pos_bp/checkPosBP",
            "/online_bp/checkOnlineBPMobileID", "/online_bp/checkOnlineBPMail", "/online_bp/checkOnlineBPMailPassword", "/online_bp/checkOnlineBP",
            "/bo_user/createBo_user", "/bp_user/createBp_user", "/member/createMember", "/online_bp/createOnline_bp", "/pos_bp/createPos_bp",
            "/get_data/getBank", "/get_data/getPosGroup", "/get_data/getBusinessType", "/get_data/getCareer", "/get_data/getCompanyType",
            "/auth/resetPasswordPos", "/auth/resetPasswordOnline", "/auth/resetPasswordMember"
        ]
    })
)
app.get("/", function (req, res, next) {
    res.send(`listening port ${port}`)
})
app.use(require('./router'))
const job = schedule.scheduleJob('0 59 23 * *', function (fireDate) {
    console.log('reset block')
    // func.resetBlock()
    // func.resetCount()
})