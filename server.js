const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
require('dotenv').config();

const app = express();
const port = 3000;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
  ssl: {
    rejectUnauthorized: false, // Set to false if using self-signed certificates
    // You may need to provide other SSL options such as ca, cert, and key
    // Example:
    // ca: fs.readFileSync('path/to/ca-certificate.crt'),
    // cert: fs.readFileSync('path/to/client-certificate.crt'),
    // key: fs.readFileSync('path/to/client-certificate.key')
  },
});


app.use(bodyParser.json());

// Create tables if not exists
(async () => {
    const client = await pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS address_users (
          id UUID PRIMARY KEY,
          name VARCHAR(255),
          age VARCHAR(255)
        );
      `);
      await client.query(`
        CREATE TABLE IF NOT EXISTS addresses (
          id UUID PRIMARY KEY,
          user_id UUID REFERENCES address_users(id),
          address_type_code VARCHAR(255),
          is_primary BOOLEAN,
          name VARCHAR(255),
          primary_contact_name VARCHAR(255),
          line1 VARCHAR(255),
          line2 VARCHAR(255),
          line3 VARCHAR(255),
          city VARCHAR(255),
          state_or_province VARCHAR(255),
          country VARCHAR(255),
          zipcode VARCHAR(255)
        );
      `);
      await client.query(`
        CREATE TABLE IF NOT EXISTS user_address_relation (
          user_id UUID REFERENCES address_users(id),
          address_id UUID REFERENCES addresses(id),
          relationship_type VARCHAR(255)
        );
      `);
      console.log('Tables created successfully');
    } catch (err) {
      console.error('Error creating tables:', err);
    } finally {
      client.release();
    }
  })();
  
// Swagger options
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Address Management API',
      version: '1.0.0',
      description: 'API documentation for the Address Management System',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
  },
  apis: ['./server.js'],
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Add a new address and associate it with a user
app.post('/addresses', async (req, res) => {
  try {
    const { user_id, address_type_code, is_primary, name, primary_contact_name, line1, line2, line3, city, state_or_province, country, zipcode } = req.body;
    const client = await pool.connect();
    const result = await client.query('INSERT INTO addresses (user_id, address_type_code, is_primary, name, primary_contact_name, line1, line2, line3, city, state_or_province, country, zipcode) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *', [user_id, address_type_code, is_primary, name, primary_contact_name, line1, line2, line3, city, state_or_province, country, zipcode]);
    client.release();
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding address');
  }
});

// Update an existing address
app.put('/addresses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { address_type_code, is_primary, name, primary_contact_name, line1, line2, line3, city, state_or_province, country, zipcode } = req.body;
    const client = await pool.connect();
    const result = await client.query('UPDATE addresses SET address_type_code=$1, is_primary=$2, name=$3, primary_contact_name=$4, line1=$5, line2=$6, line3=$7, city=$8, state_or_province=$9, country=$10, zipcode=$11 WHERE id=$12 RETURNING *', [address_type_code, is_primary, name, primary_contact_name, line1, line2, line3, city, state_or_province, country, zipcode, id]);
    client.release();
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating address');
  }
});

// Delete an address
app.delete('/addresses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const client = await pool.connect();
    await client.query('DELETE FROM addresses WHERE id=$1', [id]);
    client.release();
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting address');
  }
});

// Retrieve an address by ID
app.get('/addresses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM addresses WHERE id=$1', [id]);
    client.release();
    if (result.rows.length === 0) {
      res.status(404).send('Address not found');
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving address');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
