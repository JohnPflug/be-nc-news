const { getArticlesByIdData, getAllArticlesData, getCommentsByArticleIdData, postCommentByArticleIdData } = require("../models/articles.models");

// GET controllers:
exports.getArticlesByID = (req, res, next) => {
    const { article_id } = req.params;
    getArticlesByIdData(article_id).then((response) => {
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

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    getCommentsByArticleIdData(article_id).then((rows) => {
        res.status(200).send({ comments: rows });
        console.log({ comments: rows });
    }).catch((err) => {
        next(err);
    })
}

// POST controllers:
exports.postCommentByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    const { username, body } = req.body;
    const responseData = {
        username,
        body
    };
    postCommentByArticleIdData(article_id, username, body).then(() => {
        res.status(201).json({ response: responseData });
    }).catch((err) => {
        next(err);
    })
}