require('dotenv').config()

const Pool = require('pg').Pool
const pool = new Pool()

const query = `
  DROP TABLE IF EXISTS categories;
  CREATE TABLE categories (
    id int PRIMARY KEY NOT NULL,
    name VARCHAR NOT NULL,
    parent_id INT NULL REFERENCES categories (id) ON DELETE SET NULL
  );
`
pool.query(query)
  .then(() => {
    console.log('Done')
    pool.end()
  })
