const db = require('../db/connection')

const fetchTopics = ()=>{
    
    return db.query(`SELECT * FROM topics`).then(({ rows }) => {
        const path = rows[0];
        if(!path) {
            return Promise.reject({
                status: 404,
                msg: "Not Found"
            })
        }
        return rows;
    })
}

// const fetchApiData = () => {
//     return db.query
// }


module.exports = { fetchTopics };