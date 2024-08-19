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
    .query(`INSERT INTO topics
      (slug, description)
      VALUES ($1, $2)
      RETURNING *;`,
      [slug, description])
      .then(({ rows }) => {
        return rows[0]
      })
}

exports.checkIfTopic = (topic) => {
  topic = topic.toLowerCase()
  return db
    .query(`SELECT * FROM topics WHERE slug = $1;`, [topic])
    .then(({ rows }) => {
      return rows.length > 0;
    });
};

