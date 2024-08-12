const commentRouter = require("express").Router();
const {
  deleteCommentById,
} = require("../controllers/articles-controllers");
const {
    patchCommentById
} = require("../controllers/comments-controllers")

commentRouter
  .route("/:comment_id")
  .patch(patchCommentById)
  .delete(deleteCommentById);

module.exports = commentRouter;
