const db = require("../db/connection");

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.*,
    COUNT(comment_id)::int AS comment_count
    FROM articles 
    LEFT JOIN comments ON
    comments.article_id = articles.article_id 
    WHERE articles.article_id = $1
    GROUP BY articles.article_id
    
    ;`,
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
  count(*) OVER() AS total_count,
  COUNT(comment_id)::int AS comment_count
  FROM articles
  LEFT JOIN comments
  ON comments.article_id = articles.article_id`;

  if (query.slug) {
    queryString += ` WHERE topic = $1`;
    queryStringArray.push(query.slug);
  }

  queryString += ` GROUP BY articles.article_id`;

  if (query.sort_by) {
    queryString += ` ORDER BY ${query.sort_by} DESC;`;
  } else {
    queryString += ` ORDER BY articles.created_at DESC`;
  }
  if (query.limit) {
    queryString += ` LIMIT ${query.limit}`;
  }
  if (query.p) {
    queryString += ` OFFSET ${query.limit} * ${query.p - 1}`;
  }

  queryString += `;`;

  return db
    .query(queryString, queryStringArray)
    .then(({ rows }) => {
      return rows;
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.fetchCommentData = (article_id, query) => {
  let queryString = `SELECT * 
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC`;

  if (query.limit) {
    queryString += ` LIMIT ${query.limit}`;
  }
  if (query.p) {
    queryString += ` OFFSET ${query.limit} * ${query.p - 1}`;
  }

  queryString += `;`;
  return db.query(queryString, [article_id]).then(({ rows }) => {
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

exports.postArticleData = (params) => {
  if (params.title === null || params.body === null || params.topic === null) {
    return Promise.reject({
      status: 400,
      msg: "Bad Request",
    });
  }
  return db
    .query(
      `INSERT INTO articles
    (title, author, topic, body, article_img_url)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;`,
      [
        params.title,
        params.author,
        params.topic,
        params.body,
        params.article_img_url,
      ]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.removeArticleById = (article_id) => {
  return db
    .query(`DELETE FROM comments WHERE article_id = $1;`, [article_id])
    .then(() => {
      return db.query(
        `DELETE FROM articles WHERE article_id = $1 RETURNING *;`,
        [article_id]
      );
    })
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "article not found",
        })
      }
      return result.rows;
    })
    .catch((err) => {
      throw err;
    });
};
