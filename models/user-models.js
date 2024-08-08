const db = require("../db/connection");

exports.fetchUserData = () => {
  return db.query(`SELECT * FROM users;`).then(({ rows }) => {
    return rows;
  });
};

exports.fetchUserByUsername = (username) => {
  return db
    .query(`SELECT * FROM users WHERE users.username = $1;`, [username])
    .then(({ rows }) => {
      if (rows[0]) {
        return rows[0];
      } else {
        return Promise.reject({
          status: 404,
          msg: "User Not Found",
        });
      }
    });
};
