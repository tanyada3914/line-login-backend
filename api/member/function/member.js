const mysql = knexDB.mysql
const moment = require("moment")

const InsertProfile = async (data) => {
    try {
        console.log('data', data)
        // let response = await mysql("member").select("*").where('mem_id', data.mem_id)

        return ({
            status_code: "200",
            status_phrase: "OK",
            message: "Get Member Info SUCCESS!!",
            data: 'response[0]',
        })
    } catch (error) {
        console.log(error)
        return ({
            "status_code": "303",
            "status_phrase": "FAIL",
            "message": `Data not Correct`,
            "mem_id": data.mem_id,
            "error message": error.sqlMessage
        })
    }
}

module.exports = {
    InsertProfile,
}