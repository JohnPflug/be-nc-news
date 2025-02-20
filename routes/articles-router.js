const articlesRouter = require("express").Router();

const { getAllArticles, getArticlesByID, getCommentsByArticleId, postCommentByArticleId, patchArticleById } = require("../controllers/articles.controllers");

// GET requests:
articlesRouter.get('/', getAllArticles);
articlesRouter.get('/:article_id', getArticlesByID);
articlesRouter.get('/:article_id/comments', getCommentsByArticleId);

// POST requests:
articlesRouter.post('/:article_id/comments', postCommentByArticleId);

// PATCH requests:
articlesRouter.patch('/:article_id', patchArticleById);

module.exports = articlesRouter;