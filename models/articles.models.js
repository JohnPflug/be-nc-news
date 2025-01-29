const db = require("../db/connection");
const format = require('pg-format');

// GET models:
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
            `SELECT *
            FROM articles
            WHERE article_id = $1`, [article_id]).then(({ rows }) => {
                if (rows.length === 0) {
                    return Promise.reject({ status: 404, msg: "Article does not exist" });
                }
                else return db.query(
                    `SELECT comment_id, votes, created_at, author, body, article_id
                    FROM comments
                    WHERE article_id = $1
                    ORDER BY created_at DESC`, [article_id]).then(({ rows }) => {
                        if (rows.length === 0) {
                            return Promise.reject({ status: 200, msg: "No comments for article" });
                        }
                        else return rows;
                    })
            })
    } else return Promise.reject({ status: 400, msg: 'Bad Request: article_id must be a number' });
}

// POST models:
exports.postCommentByArticleIdData = (article_id, username, body) => {
    if (/^\d+$/.test(article_id)) {
        return db.query(
            `SELECT *
            FROM articles
            WHERE article_id = $1`, [article_id]
        ).then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "Article does not exist" });
            } else if (username) {
                return db.query(
                    `SELECT *
                    FROM users
                    WHERE username = $1`, [username]
                ).then(({ rows }) => {
                    if (rows.length === 0) {
                        return Promise.reject({ status: 400, msg: "Bad Request: Username does not exist" });
                    } else if (body) {
                        return db.query(
                            `INSERT INTO comments
                            (author, body, article_id, votes)
                            VALUES
                            ($1, $2, $3, $4)`, [username, body, article_id, 0]
                        ).then(({ rows }) => {
                            return rows;
                        });
                    } else return Promise.reject({ status: 400, msg: "No body provided" });
                });
            } else return Promise.reject({ status: 400, msg: "Username not provided" });
        });
    } else return Promise.reject({ status: 400, msg: 'Bad Request: article_id must be a number' });
};

exports.patchArticleByIdData = (article_id, inc_votes) => {
    if (/^\d+$/.test(article_id)) {
        return db.query(
            `SELECT *
            FROM articles
            WHERE article_id = $1`, [article_id]
        ).then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "Article does not exist" });
            } else if (inc_votes) {
                if (/^-?\d+$/.test(inc_votes)) {
                    return db.query(
                        `UPDATE articles
                        SET votes = votes + $1
                        WHERE article_id = $2`, [inc_votes, article_id]
                    ).then(() => {
                        return db.query(
                            `SELECT *
                            FROM articles
                            WHERE article_id = $1`, [article_id]
                        ).then(({ rows }) => {
                            return rows;
                        })
                    })
                } else return Promise.reject({ status: 400, msg: "Votes must be an integer" });
            } else return Promise.reject({ status: 400, msg: "Votes not provided" });
        });
    } else return Promise.reject({ status: 400, msg: 'Bad Request: article_id must be a number' });
}