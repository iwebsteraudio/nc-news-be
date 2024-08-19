const {
  fetchTopics,
  postTopic,
  checkIfTopic,
} = require("../models/topics-models");

exports.sendTopicData = (req, res, next) => {
  fetchTopics()
    .then((topicData) => {
      res.status(200).send({ topicData });
    })
    .catch(next);
};

exports.postTopicData = (req, res, next) => {
  const { slug, description } = req.body;

  if (!slug || !description) {
    return Promise.reject({
      status: 400,
      msg: "Bad Request",
    }).catch(next)
  }

  checkIfTopic(slug).then((topicExists) => {
    if (topicExists) {
      return Promise.reject({
        status: 409,
        msg: "Conflict",
      }).catch(next);
    }
  });

  postTopic(slug, description)
    .then((topicData) => {
      res.status(201).send({ topicData });
    })
    .catch(next);
};
