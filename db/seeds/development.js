require('dotenv').config()

const Pool = require('pg').Pool
const pool = new Pool({
  idleTimeoutMillis: 3000
})
let client

const clearAllData = async () => {
  const query = `
    DELETE FROM stores CASCADE;
    DELETE FROM cities CASCADE;
    DELETE FROM countries CASCADE;
    DELETE FROM companies CASCADE;
    DELETE FROM categories CASCADE;
    DELETE FROM products CASCADE;
  `
  return await client.query(query)
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
  return client.query(query)
}

const getCountries = async () => {
  const query = 'SELECT * FROM countries'
  const response = await client.query(query)
  return response.rows
}

const getCountryByName = async (name) => {
  const query = 'SELECT * FROM countries WHERE name ILIKE $1'
  const response = await client.query(query, [name])
  return response.rows[0]
}

const getCityByName = async (name) => {
  const query = 'SELECT * FROM cities WHERE name ILIKE $1'
  const response = await client.query(query, [name])
  return response.rows[0]
}

const getCompanyByName = async (name) => {
  const query = 'SELECT * FROM companies WHERE name ILIKE $1'
  const response = await client.query(query, [name])
  return response.rows[0]
}
const getCategoryByName = async (name) => {
  const query = "SELECT * FROM categories WHERE name ILIKE $1";
  const response = await client.query(query, [name]);
  return response.rows[0];
};

const createCities = async () => {
  await client.query('DELETE FROM cities CASCADE')

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
    return client.query(query, [city, countryData.id])
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
    return client.query(query, [name])
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
      return client.query(query, [name, cityId, companyId, location])
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
      name: 'yogurt',
      parent: 'dairy'
    },
    {
      name: 'fruits',
    },
    {
      name: 'apples',
      parent: 'fruits'
    }
  ]

  data.forEach(async ({ name, parent: parentName }) => {
    let parentId = null
    if (parentName) {
      const parent = await getCategoryByName(parentName, client);
      parentId = parent ? parent.id : parentId
    }

    const query = `INSERT INTO categories (name, parent_id) VALUES ($1, $2);`
    return await client.query(query, [name, parentId])
  })
}

const createProducts = async () => {
  const data = [
    {
      name: 'granny smith apples',
      description: 'green apples, sweet and sour taste'
    },
    {
      name: 'plain yogurt 500ml jug',
      description: ''
    }
  ]

  const promises = data.map(async ({ name, description }) => {
    const query = `INSERT INTO products (name, description) VALUES ($1, $2);`
    return await client.query(query, [name, description])
  })
  await Promise.all(promises)
}

const main = async () => {
  client = await pool.connect()
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
  console.log('> Creating products')
  await createProducts()
  console.log('Done')
  client.release()
}

main()
