require('dotenv').config()

const Pool = require('pg').Pool
const pool = new Pool()

const query = `
  DROP TABLE IF EXISTS product_categories;
  CREATE TABLE product_categories (
    id int PRIMARY KEY NOT NULL,
    product_id INT NOT NULL REFERENCES products (id),
    category_id INT NOT NULL REFERENCES categories (id)
  );
`
pool.query(query)
  .then(() => {
    console.log('Done')
    pool.end()
  })
