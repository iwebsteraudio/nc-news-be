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

const fetchCommentsByArticleId = () => {
  return db.query(
    
  )
}

module.exports = { fetchArticleById, fetchArticleData };
