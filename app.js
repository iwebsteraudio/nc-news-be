const express = require("express");
const app = express();
const {
  sendTopicData,
  sendCustom404,
} = require("./controllers/news-controllers");

app.get("/api/topics", sendTopicData);

app.get("*", sendCustom404);

app.use((err, req, res, next) => {
    
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    res.status(500).send({ msg: "Internal Server Error" });
  }
});

module.exports = app;
