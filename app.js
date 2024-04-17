const express = require("express");
const app = express();
const {
  sendTopicData,
  sendCustom404,
  sendApiData,
} = require("./controllers/topics-controllers");
const { sendArticleById } = require("./controllers/articles-controllers")


app.get("/api/topics", sendTopicData);

app.get("/api/", sendApiData);

app.get("/api/articles/:article_id", sendArticleById);

app.all("*", sendCustom404);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    
    res.status(err.status).send({ msg: err.msg });
  }
  if (err.code === '22P02') {
    res.status(400).send({ msg: 'Bad Request' });
  } else {
    res.status(500).send({ msg: "Internal Server Error" });
  }
});

module.exports = app;
