const { fetchArticleById, fetchArticleData, fetchCommentsByArticleId } = require("../models/articles-models");

const sendArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

const sendArticleData = (req, res, next) => {
  fetchArticleData()
  .then((articleData) => {
    
    res.status(200).send({ articleData })
  })
  .catch(next);
}

const sendCommentsByArticleId = (req, res, next) => {
  fetchCommentsByArticleId()
  .then((commentData) => {
    res.status(200).send({ commentData})
  })
  .catch(next);
}

module.exports = { sendArticleById, sendArticleData, sendCommentsByArticleId };
