const {
  fetchArticleById,
  fetchArticleData,
  fetchCommentData,
  postCommentData,
  patchVotes,
  removeCommentById,
} = require("../models/articles-models");

exports.sendArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.sendArticleData = (req, res, next) => {
  fetchArticleData()
    .then((articleData) => {
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

exports.deleteCommendById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then((commentData) => {
      if(commentData.length === 0){
        return Promise.reject({
          status: 404,
          msg: 'comment not found'
        })
      }
      res.status(204).send({ commentData });
    })
    .catch(next);
};
