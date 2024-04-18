const db = require("../db/connection");

const fetchArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({ rows }) => {
      if (rows.length > 0) {
        return rows[0];
      }
      return Promise.reject({ status: 404, msg: "Article ID Not Found" });
    });
};

const fetchArticleData = () => {
    
  return db.query(
    `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`).then(({ rows }) => {
   
    return rows;
  });
};

const fetchCommentData = (article_id) => {
  return db.query(
    `SELECT * 
    FROM comments WHERE article_id = ${article_id}
    ORDER BY created_at DESC;`
  ).then(({ rows } ) => {
    return rows;
  })
}

const postCommentData = (article_id, user_name, body) => {
    return db.query(
    `INSERT INTO comments
    (article_id, author, body)
    VALUES ($1,$2,$3)
    RETURNING *;`,
    [article_id, user_name, body]
  ).then(({ rows }) =>{
    return rows[0];
  })
}

const patchVotes = (article_id, inc_votes) => {
  return db.query(
    `UPDATE articles
    SET
    votes = votes + $2
    WHERE article_id = $1
    RETURNING *;`,[article_id, inc_votes]
  ).then(({ rows }) =>{
    return rows[0];
  })
}

module.exports = { fetchArticleById, fetchArticleData, fetchCommentData, postCommentData, patchVotes };
