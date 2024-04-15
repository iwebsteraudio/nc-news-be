const { fetchTopics } = require("../models/news-models");

const sendTopicData = (req, res, next) => {
  fetchTopics()
    .then((topicData) => {
      res.status(200).send({ topicData });
    })
    .catch(next);
};

const sendCustom404 = (req, res, next) => {
  const err = { status: 404, msg: "Not Found" };
  next(err);
};

module.exports = { sendTopicData, sendCustom404 };
