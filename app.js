const express = require("express");
const app = express();
const {
  sendTopicData,
  sendCustom404,
  sendApiData,
} = require("./controllers/topics-controllers");
const {
  sendArticleById,
  sendArticleData,
  sendCommentsByArticleId,
  postCommentsByArticleId,
  patchArticleById,
} = require("./controllers/articles-controllers");

app.get("/api/topics", sendTopicData);

app.get("/api/", sendApiData);

app.get("/api/articles/:article_id", sendArticleById);

app.get("/api/articles", sendArticleData);

app.get("/api/articles/:article_id/comments", sendCommentsByArticleId);

app.use(express.json())

app.post("/api/articles/:article_id/comments", postCommentsByArticleId);

app.patch("/api/articles/:article_id", patchArticleById)

app.all("*", sendCustom404);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  else if (err.code === "22P02" || err.code === "42703" || err.code==="23503") {
    res.status(400).send({ msg: "Bad Request" });
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
