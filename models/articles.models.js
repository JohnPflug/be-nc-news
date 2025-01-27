const db = require("../db/connection");

exports.getArticlesData = (article_id) => {
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