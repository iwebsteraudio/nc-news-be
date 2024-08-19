const articleRouter = require("express").Router();
const {
  sendArticleById,
  sendArticleData,
  sendCommentsByArticleId,
  postCommentsByArticleId,
  patchArticleById,
  sendArticleByTopic,
  postNewArticle,
  deleteArticleById
} = require("../controllers/articles-controllers");

articleRouter.route("/").get(sendArticleData).post(postNewArticle);

articleRouter
  .route("/:article_id")
  .get(sendArticleById)
  .patch(patchArticleById)
  .delete(deleteArticleById);

articleRouter.route("/topics/:topic").get(sendArticleByTopic);

articleRouter
  .route("/:article_id/comments")
  .get(sendCommentsByArticleId)
  .post(postCommentsByArticleId);

module.exports = articleRouter;
