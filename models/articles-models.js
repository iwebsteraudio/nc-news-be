const db = require("../db/connection");

const fetchArticleById = (article_id) => {
  
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({ rows }) => {
        
      if (typeof article_id === Number) {
        console.log(article_id)
        return Promise.reject({ status: 400, msg: "Bad Request" });
      }

      if (rows.length > 0) {
        return rows[0];
      }
      return Promise.reject({ status: 404, msg: "Article ID Not Found" });
    });
};

module.exports = { fetchArticleById };
