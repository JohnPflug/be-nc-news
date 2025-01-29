const db = require("../db/connection");

exports.deleteCommentByIdData = (comment_id) => {
    if (/^\d+$/.test(comment_id)) {
        return db.query(
            `SELECT *
            FROM comments
            WHERE comment_id = $1`, [comment_id]
        ).then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "Comment does not exist" });
            } else {
                return db.query(
                    `DELETE FROM comments
                    WHERE comment_id = $1`, [comment_id]
                );
            }
        });
    } else return Promise.reject({ status: 400, msg: 'Bad Request: comment_id must be an integer' });
}