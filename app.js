const express = require("express");
const app = express();

const cors = require("cors");

const apiRouter = require("./routes/api-router");

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.all("*", (req, res, next) => {
  res.status(404).send({ msg: "Not Found" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else if (
    err.code === "22P02" ||
    err.code === "42703" ||
    err.code === "23503" ||
    err.code === "22003"
  ) {
    res.status(400).send({ msg: "Bad Request" });
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});
module.exports = app;
