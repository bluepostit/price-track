require('dotenv').config()

const Pool = require('pg').Pool
const pool = new Pool()

const query = `
  DROP TABLE IF EXISTS product_prices;
  CREATE TABLE product_prices (
    id SERIAL PRIMARY KEY NOT NULL,
    product_id INT NOT NULL REFERENCES products (id),
    store_id INT NOT NULL REFERENCES stores (id),
    date TIME WITH TIME ZONE,
    price NUMERIC NOT NULL DEFAULT 0
  );
`
pool.query(query)
  .then(() => {
    console.log('Done')
    pool.end()
  })
