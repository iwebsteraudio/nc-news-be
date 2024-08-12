const db = require("../db/connection");

exports.patchCommentVotes = (comment_id, inc_votes) => {
  return db
    .query(
      `UPDATE comments SET votes = votes + $2 WHERE comment_id = $1 RETURNING *;`,
      [comment_id, inc_votes]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "comment not found",
        });
      }
      return rows[0];
    })
    .catch((err) => {
      throw err;
    });
};
