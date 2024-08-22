const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    if (!rows[0]) {
      return Promise.reject({
        status: 404,
        msg: "Not Found",
      });
    }
    return rows;
  });
};

exports.postTopic = (slug, description) => {
  return db
    .query(
      `INSERT INTO topics
      (slug, description)
      VALUES ($1, $2)
      RETURNING *;`,
      [slug, description]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.checkIfTopic = (topic) => {
  topic = topic.toLowerCase();
  return db
    .query(`SELECT * FROM topics WHERE slug = $1;`, [topic])
    .then(({ rows }) => {
      return rows.length > 0;
    });
};

exports.fetchArticleByTopic = (topic, query) => {
  let queryString = `SELECT articles.article_id, articles.title, topic, articles.author, articles.created_at, articles.votes, articles.article_img_url,
      COUNT(comment_id)::int AS comment_count
      FROM articles
      LEFT JOIN comments ON comments.article_id = articles.article_id
      WHERE topic = $1
      GROUP BY articles.article_id`;

      if (query.sort_by) {
        queryString += ` ORDER BY ${query.sort_by}`;
      } else {
        queryString += ` ORDER BY articles.created_at`;
      }

      if (query.order_by){
        queryString += ` ${query.order_by}`
      } else {
        queryString += ` DESC`
      }

      if (query.limit) {
        queryString += ` LIMIT ${query.limit}`;
      }
      if (query.p) {
        queryString += ` OFFSET ${query.limit} * ${query.p - 1}`;
      }

  queryString += `;`;
  return db.query(queryString, [topic]).then(({ rows }) => {
    return rows;
  });
};
