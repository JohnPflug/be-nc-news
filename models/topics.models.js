const db = require("../db/connection");

exports.getTopicsData = () => {
    return db.query(`SELECT * FROM topics`)
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "Data not found" })
            }
            else return rows;
        })
};