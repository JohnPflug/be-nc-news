const express = require("express");
const articlesRouter = require("./routes/articles-router");
const usersRouter = require("./routes/users-router");
const endpointsJson = require("./endpoints.json");
const { getTopics } = require("./controllers/topics.controllers");
const { deleteCommentById } = require("./controllers/comments.controllers");
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

// GET requests:

app.get('/api', (req, res) => {
    res.status(200).send({ endpoints: endpointsJson });
});

app.get('/api/topics', getTopics);

app.use('/api/users', usersRouter);

app.use('/api/articles', articlesRouter);

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