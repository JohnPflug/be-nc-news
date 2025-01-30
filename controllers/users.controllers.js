const { getAllUsersData } = require("../models/users.models");

exports.getAllUsers = (req, res, next) => {
    getAllUsersData().then((rows) => {
        res.status(200).send({ users: rows });
    }).catch((err) => {
        next(err);
    })
}