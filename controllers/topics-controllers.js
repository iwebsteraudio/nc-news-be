const { fetchTopics } = require("../models/topics-models");


exports.sendTopicData = (req, res, next) => {
  fetchTopics()
    .then((topicData) => {
      res.status(200).send({ topicData });
    })
    .catch(next);
};