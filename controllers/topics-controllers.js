const { fetchTopics } = require("../models/topics-models");
const apiData = require("../endpoints.json");

const sendTopicData = (req, res, next) => {
  fetchTopics()
    .then((topicData) => {
      res.status(200).send({ topicData });
    })
    .catch(next);
};

const sendApiData = (req, res, next) => {
  res.status(200).send(apiData);
};

const sendCustom404 = (req, res, next) => {
  res.status(404).send({msg : "Not Found"});
};

module.exports = { sendTopicData, sendCustom404, sendApiData };
