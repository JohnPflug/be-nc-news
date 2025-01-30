const db = require("../db/connection");

exports.getAllUsersData = () => {
    return db.query(`
        SELECT username, name, avatar_url
        FROM users
        `).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 204, msg: "No users found" })
        } else return rows;
    })
}