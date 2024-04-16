const { fetchTopics } = require("../models/news-models");
const  apiData  = require("../endpoints.json")


const sendTopicData = (req, res, next) => {
  fetchTopics()
    .then((topicData) => {
      res.status(200).send({ topicData });
    })
    .catch(next);
};

const sendApiData = (req, res, next) => {
  res.status(200).send( apiData );
}

const sendCustom404 = (req, res, next) => {
  const err = { status: 404, msg: "Not Found" };
  next(err);
};

module.exports = { sendTopicData, sendCustom404, sendApiData };
