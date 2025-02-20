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

exports.getUserByUsernameData = (username) => {
    return db.query(`
        SELECT username, name, avatar_url
        FROM users
        WHERE username = $1
        `, [username]).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Username does not exist" });
        }
        else return rows;
    })
}