require('dotenv').config()

const Pool = require('pg').Pool
const pool = new Pool()

const query = `
  DROP TABLE IF EXISTS stores CASCADE;
  CREATE TABLE stores (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    city_id INT NOT NULL REFERENCES cities (id),
    company_id INT NULL REFERENCES companies (id),
    location VARCHAR(250)
    );
`
pool.query(query)
  .then(() => {
    console.log('Done')
    pool.end()
  })
