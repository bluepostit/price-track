require('dotenv').config()

const Pool = require('pg').Pool
const pool = new Pool()

const query = `
  DROP TABLE IF EXISTS products CASCADE;
  CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    description VARCHAR,
    parent_id INT NULL REFERENCES products (id) ON DELETE SET NULL
  );
`
pool.query(query)
  .then(() => {
    console.log('Done')
    pool.end()
  })
