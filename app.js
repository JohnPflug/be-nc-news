const express = require("express");
const endpointsJson = require("./endpoints.json");
const { getTopics } = require("./controllers/topics.controllers")

const app = express();

app.get('/api', (req, res) => {
    res.status(200).send({ endpoints: endpointsJson });
});

app.get('/api/topics', getTopics);

app.use((req, res) => {
    res.status(404).send({ msg: "Endpoint not found" });
});

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send(err.msg);
    }
    else {
        res.status(500).send({ msg: "Internal Server Error" })
    }
})

module.exports = app;