const articleRouter = require("express").Router();
const {
  sendArticleById,
  sendArticleData,
  sendCommentsByArticleId,
  postCommentsByArticleId,
  patchArticleById,
} = require("../controllers/articles-controllers");

articleRouter.route("/").get(sendArticleData);

articleRouter
  .route("/:article_id")
  .get(sendArticleById)
  .patch(patchArticleById);

articleRouter
  .route("/:article_id/comments")
  .get(sendCommentsByArticleId)
  .post(postCommentsByArticleId);

module.exports = articleRouter;
