const { getTopicsData } = require("../models/topics.models");

exports.getTopics = (req, res, next) => {
    getTopicsData()
        .then((rows) => {
            res.status(200).send({ topics: rows })
        })
        .catch((err) => {
            next(err);
        })
}