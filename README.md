# Environment Variables

To run this repository, you will need to crate two .env files in the db folder: .env.test and .env.development.
Into each file, please add 'PGDATABASE=', with the correct database name for that environment (see /db/setup.sql for the database names).

# Dependencies to Install

npm i

# Tickets Completed

1. Project Setup: "sets up project"
2. GET Topic: "Send a GET request and receives topic data"
3. GET API: "Send a GET request for the API data and receives endpoints.json"
    HINT - I've chosen to put the getAPI controller in topics-controller.
4. GET Article by ID: "Send a GET request for an article which responds with the relevant properties"
5. GET Article: "Gets all articles and returns array of all articles, ommitting body"
6. GET Comment by Article ID: "Responds with an array of comments for the given article_id"
7. Posts a comment to a given article_id and responds with that comment
8. Patch request to increase the number of votes on an article
9. Delete comment by comment id
10. GET Api users: "Gets all users"
11. GET api articles topic query: "filters the articles by the topic value specified in the query. If the query is omitted, the endpoint should respond with all articles"
12. GET Api articles by :article_id (comment_count): "article response object should also now include comment_count"