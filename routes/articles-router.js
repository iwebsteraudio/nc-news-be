const articleRouter = require("express").Router();
const {
  sendArticleById,
  sendArticleData,
  sendCommentsByArticleId,
  postCommentsByArticleId,
  patchArticleById,
  sendArticleByTopic,
} = require("../controllers/articles-controllers");

articleRouter.route("/").get(sendArticleData);

articleRouter
  .route("/:article_id")
  .get(sendArticleById)
  .patch(patchArticleById);

articleRouter.route("/topics/:topic")
  .get(sendArticleByTopic);

articleRouter
  .route("/:article_id/comments")
  .get(sendCommentsByArticleId)
  .post(postCommentsByArticleId);

module.exports = articleRouter;
