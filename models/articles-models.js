const db = require("../db/connection");

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.*,
    COUNT(comment_id) AS comment_count
    FROM articles 
    LEFT JOIN comments ON comments.article_id = articles.article_id 
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length > 0) {
        return rows[0];
      }
      return Promise.reject({ status: 404, msg: "Article ID Not Found" });
    });
};

exports.fetchArticleData = (query) => {
  const queryStringArray = [];
  let queryString = `SELECT articles.article_id, articles.title, topic, articles.author, articles.created_at, articles.votes, articles.article_img_url,
  COUNT(comment_id) AS comment_count
  FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id `;

  if (query) {
    queryString += `WHERE topic = $1`;
    queryStringArray.push(query);
  }

  queryString += ` GROUP BY articles.article_id
                  ORDER BY articles.created_at DESC;`;

  return db.query(queryString, queryStringArray).then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticleByTopic = (topic) => {
  console.log("HI")
  return db
    .query(
      `SELECT * FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE topic = $1;`,
      [topic]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchCommentData = (article_id) => {
  return db
    .query(
      `SELECT * 
    FROM comments WHERE article_id = $1
    ORDER BY created_at DESC;`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.postCommentData = (article_id, user_name, body) => {
  return db
    .query(
      `INSERT INTO comments
    (article_id, author, body)
    VALUES ($1,$2,$3)
    RETURNING *;`,
      [article_id, user_name, body]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.patchVotes = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles
    SET
    votes = votes + $2
    WHERE article_id = $1
    RETURNING *;`,
      [article_id, inc_votes]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.removeCommentById = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [
      comment_id,
    ])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "comment not found",
        });
      }
      return result.rows;
    });
};
