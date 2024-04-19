const { fetchTopics } = require("../models/topics-models");
const apiData = require("../endpoints.json");

exports.sendTopicData = (req, res, next) => {
  fetchTopics()
    .then((topicData) => {
      res.status(200).send({ topicData });
    })
    .catch(next);
};

exports.sendApiData = (req, res, next) => {
  res.status(200).send(apiData);
};

exports.sendCustom404 = (req, res, next) => {
  res.status(404).send({msg : "Not Found"});
};