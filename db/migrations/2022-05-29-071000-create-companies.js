require('dotenv').config()

const Pool = require('pg').Pool
const pool = new Pool()

const query = `
  DROP TABLE IF EXISTS companies CASCADE;
  CREATE TABLE companies (id SERIAL PRIMARY KEY, name VARCHAR NOT NULL);
`
pool.query(query)
  .then(() => {
    console.log('Done')
    pool.end()
  })
