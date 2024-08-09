const articles = require("../db/data/test-data/articles");
const {
  fetchArticleById,
  fetchArticleByTopic,
  fetchArticleData,
  fetchCommentData,
  postCommentData,
  patchVotes,
  removeCommentById,
} = require("../models/articles-models");

const { checkIfTopic } = require("../models/topics-models");

exports.sendArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.sendArticleData = (req, res, next) => {
  const query = req.query;

  if (query.topic) {
    checkIfTopic(query.topic)
      .then((topicExists) => {
        if (topicExists) {
          return fetchArticleData({ slug: query.topic, sort_by: query.sort_by });
        } else {
          return Promise.reject({
            status: 404,
            msg: "Not Found",
          });
        }
      })
      .then((articleData) => {
        res.status(200).send({ articleData });
      })
      .catch(next);
  } else {
    fetchArticleData(query)
      .then((articleData) => {
        res.status(200).send({ articleData });
      })
      .catch(next);
  }
};


exports.sendArticleByTopic = (req, res, next) => {
  const { topic } = req.params;
  fetchArticleByTopic(topic)
    .then((articleData) => {
      if (articleData.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      res.status(200).send({ articleData });
    })
    .catch(next);
};

exports.sendCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  fetchCommentData(article_id)
    .then((commentData) => {
      res.status(200).send({ commentData });
    })
    .catch(next);
};

exports.postCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  postCommentData(article_id, username, body)
    .then((commentData) => {
      res.status(201).send({ commentData });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  patchVotes(article_id, inc_votes)
    .then((articleData) => {
      res.status(200).send({ articleData });
    })
    .catch(next);
};
exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
