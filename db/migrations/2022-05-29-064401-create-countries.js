require('dotenv').config()

const Pool = require('pg').Pool
const pool = new Pool()

const query = `
  DROP TABLE IF EXISTS countries;
  CREATE TABLE countries (id int PRIMARY KEY NOT NULL, name VARCHAR NOT NULL);
`
pool.query(query)
  .then(() => {
    console.log('Done')
    pool.end()
  })
