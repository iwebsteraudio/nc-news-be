const commentRouter = require("express").Router();
const { deleteCommentById } = require("../controllers/articles-controllers");

commentRouter.route("/:comment_id").delete(deleteCommentById);

module.exports = commentRouter;
