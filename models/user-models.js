const db = require("../db/connection");

exports.fetchUserData = ()=>{
    return db.query(
        `SELECT * FROM users;`
    ).then(({ rows }) =>{
        return rows;
    })
}