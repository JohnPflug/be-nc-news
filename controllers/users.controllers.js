const { getAllUsersData, getUserByUsernameData } = require("../models/users.models");

exports.getAllUsers = (req, res, next) => {
    getAllUsersData().then((rows) => {
        res.status(200).send({ users: rows });
    }).catch((err) => {
        next(err);
    })
}

exports.getUserByUsername = (req, res, next) => {
    const { username } = req.params;
    getUserByUsernameData(username).then((row) => {
        res.status(200).send({ user: row });
    }).catch((err) => {
        next(err);
    })
}