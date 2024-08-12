const { patchCommentVotes } = require("../models/comments-models");

exports.patchCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  patchCommentVotes(comment_id, inc_votes)
    .then((commentData) => {
      res.status(200).send({ commentData });
    })
    .catch(next);
};
