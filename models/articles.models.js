const db = require("../db/connection");

exports.getArticlesByIdData = (article_id) => {
    if (/^\d+$/.test(article_id)) {
        return db.query(
            `SELECT *
            FROM articles
            WHERE article_id = $1`, [article_id]).then(({ rows }) => {
                if (rows.length === 0) {
                    return Promise.reject({ status: 404, msg: "Article does not exist" });
                }
                else return rows;
            })
    }
    else return Promise.reject({ status: 400, msg: 'Bad Request: article_id must be a number' });
};

exports.getAllArticlesData = () => {
    return db.query(
        `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC
        `);
}

exports.getCommentsByArticleIdData = (article_id) => {
    if (/^\d+$/.test(article_id)) {
        return db.query(
            `SELECT comment_id, votes, created_at, author, body, article_id
            FROM comments
            WHERE article_id = $1
            ORDER BY created_at DESC`, [article_id]).then(({ rows }) => {
                if (rows.length === 0) {
                    return Promise.reject({ status: 404, msg: "Article does not exist" });
                }
                else return rows;
            })
    }
    else return Promise.reject({ status: 400, msg: 'Bad Request: article_id must be a number' });
}