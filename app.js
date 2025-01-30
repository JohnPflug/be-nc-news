const express = require("express");
const endpointsJson = require("./endpoints.json");
const { getTopics } = require("./controllers/topics.controllers");
const { getArticlesByID, getAllArticles, getCommentsByArticleId, postCommentByArticleId, patchArticleById } = require("./controllers/articles.controllers");
const { deleteCommentById } = require("./controllers/comments.controllers");
const { getAllUsers } = require("./controllers/users.controllers");

const app = express();

app.use(express.json());

// GET requests:
app.get('/api', (req, res) => {
    res.status(200).send({ endpoints: endpointsJson });
});

app.get('/api/topics', getTopics);

app.get('/api/articles', getAllArticles);

app.get('/api/users', getAllUsers);

app.get('/api/articles/:article_id', getArticlesByID);

app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

// POST requests:
app.post('/api/articles/:article_id/comments', postCommentByArticleId);

// PATCH requests:
app.patch('/api/articles/:article_id', patchArticleById);

// DELETE requests:
app.delete('/api/comments/:comment_id', deleteCommentById);

// Invalid endpoints:
app.use((req, res) => {
    res.status(404).send({ msg: "Endpoint not found" });
});

// PSQL error handling:
app.use((err, req, res, next) => {
    if (err.code === "22P02") {
        res.status(400).send({ msg: "Invalid input" });
    } else if (err.code === "23505") {
        res.status(409).send({ msg: "Duplicate key value" });
    } else {
        next(err);
    }
});

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    }
    else {
        res.status(500).send({ msg: "Internal Server Error" })
    }
})

module.exports = app;