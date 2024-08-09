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

exports.checkIfTopic = (topic) => {
  return db
    .query(`SELECT * FROM topics WHERE slug = $1;`, [topic])
    .then(({ rows }) => {
      return rows.length > 0;
    });
};
