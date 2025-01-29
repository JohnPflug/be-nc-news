const express = require("express");
const endpointsJson = require("./endpoints.json");
const { getTopics } = require("./controllers/topics.controllers");
const { getArticlesByID, getAllArticles, getCommentsByArticleId, postCommentByArticleId } = require("./controllers/articles.controllers");

const app = express();

app.use(express.json());

// GET requests:
app.get('/api', (req, res) => {
    res.status(200).send({ endpoints: endpointsJson });
});

app.get('/api/topics', getTopics);

app.get('/api/articles', getAllArticles);

app.get('/api/articles/:article_id', getArticlesByID);

app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

// POST requests:
app.post('/api/articles/:article_id/comments', postCommentByArticleId);

// Invalid endpoints:
app.use((req, res) => {
    res.status(404).send({ msg: "Endpoint not found" });
});

// PSQL error handling:
app.use((err, req, res, next) => {
    if (err.code === "22P02") {
        res.status(400).send({ msg: "Invalid input" });
    } else next(err);
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