const db = require('../db/connection')

const fetchTopics = ()=>{
    
    return db.query(`SELECT * FROM topics`).then(({ rows }) => {
        
        if(!rows[0]) {
            return Promise.reject({
                status: 404,
                msg: "Not Found"
            })
        }
        return rows;
    })
}


module.exports = { fetchTopics };