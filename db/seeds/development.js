require('dotenv').config()

const Pool = require('pg').Pool
const pool = new Pool()

const clearAllData = async () => {
  const query = `
    DELETE FROM cities CASCADE;
    DELETE FROM countries CASCADE;
  `
  return await pool.query(query)
}

const createCountries = async () => {
  const query = `
    DELETE FROM countries CASCADE;
    INSERT INTO countries("name")
    VALUES
    ('Belgium'),
    ('Canada'),
    ('France'),
    ('Germany'),
    ('Spain'),
    ('United Kingdom');
  `
  return pool.query(query)
}

const getCountries = async () => {
  const query = 'SELECT * FROM countries'
  const response = await pool.query(query)
  return response.rows
}

const getCountryByName = async (name) => {
  const query = 'SELECT * FROM countries WHERE name ILIKE $1'
  const response = await pool.query(query, [name])
  return response.rows[0]
}

const createCities = async () => {
  await pool.query('DELETE FROM cities CASCADE')

  const data = [
    {
      country: 'Belgium',
      city: 'Brussels'
    },
    {
      country: 'Canada',
      city: 'Ontario'
    },
    {
      country: 'France',
      city: 'Paris'
    },
    {
      country: 'Germany',
      city: 'Berlin'
    },
    {
      country: 'Spain',
      city: 'Madrid'
    },
    {
      country: 'United Kingdom',
      city: 'London'
    },
  ]

  const promises = data.map(async ({ country, city }) => {
    const countryData = await getCountryByName(country)
    const query = `
      INSERT INTO cities ("name", "country_id")
      VALUES ($1, $2)
    `
    return pool.query(query, [city, countryData.id])
  })
  return await Promise.all(promises)
}

const main = async () => {
  console.log(' ==== Seeding for development ====')
  console.log('Clearing data')
  await clearAllData()
  console.log('Inserting data')
  await createCountries()
  await createCities()
  console.log('Done')
  pool.end()
}

main()
