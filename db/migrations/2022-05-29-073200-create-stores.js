require('dotenv').config()

const Pool = require('pg').Pool
const pool = new Pool()

const query = `
  DROP TABLE IF EXISTS stores;
  CREATE TABLE stores (
    id int PRIMARY KEY NOT NULL,
    name VARCHAR NOT NULL,
    city_id INT NOT NULL REFERENCES cities (id),
    location VARCHAR(250)
    );
`
pool.query(query)
  .then(() => {
    console.log('Done')
    pool.end()
  })
