const { getArticlesData } = require("../models/articles.models");

exports.getArticles = (req, res, next) => {
    const { article_id } = req.params;
    getArticlesData(article_id).then((response) => {
        res.status(200).send({ articles: response })
    }).catch((err) => {
        next(err);
    })
}