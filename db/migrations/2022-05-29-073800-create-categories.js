require('dotenv').config()

const Pool = require('pg').Pool
const pool = new Pool()

const query = `
  DROP TABLE IF EXISTS categories CASCADE;
  CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    parent_id INT NULL REFERENCES categories (id) ON DELETE SET NULL
  );
`
pool.query(query)
  .then(() => {
    console.log('Done')
    pool.end()
  })
