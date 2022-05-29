require('dotenv').config()

const Pool = require('pg').Pool
const pool = new Pool()

const query = `
  DROP TABLE IF EXISTS cities;
  CREATE TABLE cities (
    id int PRIMARY KEY NOT NULL,
    name VARCHAR NOT NULL,
    country_id INT NOT NULL REFERENCES countries (id)
    );
`
pool.query(query)
  .then(() => {
    console.log('Done')
    pool.end()
  })
