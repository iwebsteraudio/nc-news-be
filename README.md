# Environment Variables

To run this repository, you will need to crate two .env files in the db folder: .env.test and .env.development.
Into each file, please add 'PGDATABASE=', with the correct database name for that environment (see /db/setup.sql for the database names).

# Dependencies to Install


npm i -y
npm i jest -D
npm i jest-sorted -D
npm i nodemon -D
npm i supertest -D
npm i pg
npm i pg-format -D
npm i dotenv
npm i express

# Tickets Completed

1. Project Setup: "sets up project"
2. GET Topic: "Send a GET request and receives topic data"
3. GET API: "Send a GET request for the API data and receives endpoints.json"