const { fetchArticleById } = require("../models/articles-models");

const sendArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

module.exports = { sendArticleById };
