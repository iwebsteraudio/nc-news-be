const {
  fetchArticleById,
  fetchArticleByTopicQuery,
  fetchArticleData,
  fetchCommentData,
  postCommentData,
  patchVotes,
  removeCommentById,
  postArticleData,
  removeArticleById
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

  if (
    (query.limit && isNaN(parseInt(query.limit))) ||
    (query.p && isNaN(parseInt(query.p)))
  ) {
    return Promise.reject({
      status: 400,
      msg: "Bad Request",
    }).catch(next);
  }

  if (query.topic) {
    checkIfTopic(query.topic)
      .then((topicExists) => {
        if (topicExists) {
          return fetchArticleData({
            slug: query.topic,
            sort_by: query.sort_by,
          });
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
        if (articleData.length !== 0) {
          res.status(200).send({ articleData });
        } else {
          Promise.reject({
            status: 404,
            msg: "Not Found",
          }).catch(next);
        }
      })
      .catch(next);
  }
};

exports.sendCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const query = req.query;
  fetchCommentData(article_id, query)
    .then((commentData) => {
      if (commentData.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
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
exports.postNewArticle = (req, res, next) => {
  postArticleData(req.body)
    .then((articleData) => {
      res.status(201).send({ articleData });
    })
    .catch(next);
};

exports.deleteArticleById = (req, res, next) => {
  const { article_id } = req.params;
  removeArticleById(article_id)
  .then(()=>{
    res.status(204).send()
  })
  .catch(next)
}