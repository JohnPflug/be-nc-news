const { getArticlesData, getAllArticlesData } = require("../models/articles.models");

exports.getArticles = (req, res, next) => {
    const { article_id } = req.params;
    getArticlesData(article_id).then((response) => {
        res.status(200).send({ articles: response })
    }).catch((err) => {
        next(err);
    })
}

exports.getAllArticles = (req, res, next) => {
    getAllArticlesData().then(({ rows }) => {
        res.status(200).send({ articles: rows });
    }).catch((err) => {
        next(err);
    })
}