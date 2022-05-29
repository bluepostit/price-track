require('dotenv').config()

const Pool = require('pg').Pool
const pool = new Pool()

const clearAllData = async () => {
  const query = `
    DELETE FROM stores CASCADE;
    DELETE FROM cities CASCADE;
    DELETE FROM countries CASCADE;
    DELETE FROM categories CASCADE;
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

const getCityByName = async (name) => {
  const query = 'SELECT * FROM cities WHERE name ILIKE $1'
  const response = await pool.query(query, [name])
  return response.rows[0]
}

const getCompanyByName = async (name) => {
  const query = 'SELECT * FROM companies WHERE name ILIKE $1'
  const response = await pool.query(query, [name])
  return response.rows[0]
}
const getCategoryByName = async (name) => {
  const query = 'SELECT * FROM categories WHERE name ILIKE $1'
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

const createCompanies = async () => {
  const data = [
    'Aldi',
    'Penny',
    'MediaMarkt',
    'Edeka',
    'Rewe'
  ]

  const promises = data.map(async (name) => {
    const query = `INSERT INTO companies ("name") VALUES ($1)`
    return pool.query(query, [name])
  })
  return await Promise.all(promises)
}

const createStores = async () => {
  const data = [
    {
      name: 'MediaMarkt Alexanderplatz',
      city: 'Berlin',
      company: 'MediaMarkt',
      location: 'Alexanderplatz'
    },
    {
      name: 'Aldi Nord Rüdersdorfer Straße',
      city: 'Berlin',
      company: 'Aldi',
      location: 'Rüdersdorfer Straße'
    }
  ]

  const promises = data.map(async ({ name, city, company, location }) => {
    const cityId = (await getCityByName(city)).id
    const companyId = (await getCompanyByName(company)).id
    const query = `INSERT INTO stores ("name", "city_id", "company_id", "location")
      VALUES ($1, $2, $3, $4);`
      return pool.query(query, [name, cityId, companyId, location])
  })
  return await Promise.all(promises)
}

const createCategories = async () => {
  const data = [
    {
      name: 'dairy'
    },
    {
      name: 'milk',
      parent: 'dairy'
    },
    {
      name: 'fruits',
    },
    {
      name: 'apples',
      parent: 'fruits'
    },
    {
      name: 'granny smith apples',
      parent: 'apples'
    }
  ]

  data.forEach(async ({ name, parent: parentName }) => {
    let parentId = null
    if (parentName) {
      parentId = (await getCategoryByName(parentName)).id
    }

    const query = `INSERT INTO categories (name, parent_id) VALUES ($1, $2);`
    await pool.query(query, [name, parentId])
  })
}

const main = async () => {
  console.log(' ==== Seeding for development ====')
  console.log('Clearing data')
  await clearAllData()
  console.log('Inserting data')
  console.log('> Creating countries')
  await createCountries()
  console.log('> Creating cities')
  await createCities()
  console.log('> Creating companies')
  await createCompanies()
  console.log('> Creating stores')
  await createStores()
  console.log('> Creating product categories')
  await createCategories()
  console.log('Done')
  pool.end()
}

main()
