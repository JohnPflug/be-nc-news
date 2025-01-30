const { deleteCommentByIdData } = require("../models/comments.models");

exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params;
    deleteCommentByIdData(comment_id)
        .then(() => {
            res.sendStatus(204);
        }).catch((err) => {
            next(err);
        });
}