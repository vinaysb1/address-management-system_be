const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
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
    rejectUnauthorized: false,
  },
});

app.use(bodyParser.json());

// Create tables 
(async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS addresses (
        id UUID PRIMARY KEY,
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
        id UUID PRIMARY KEY,
        user_id UUID,
        address_id UUID REFERENCES addresses(id),
        relationship_type VARCHAR(20) CHECK (relationship_type IN ('OWNER', 'TENANT', 'OTHER')) NOT NULL
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

/**
 * @swagger
 * /addresses:
 *   post:
 *     summary: Create a new address
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address_type_code:
 *                 type: string
 *               is_primary:
 *                 type: boolean
 *               name:
 *                 type: string
 *               primary_contact_name:
 *                 type: string
 *               line1:
 *                 type: string
 *               line2:
 *                 type: string
 *               line3:
 *                 type: string
 *               city:
 *                 type: string
 *               state_or_province:
 *                 type: string
 *               country:
 *                 type: string
 *               zipcode:
 *                 type: string
 *               relationship_type:
 *                 type: string
 *               user_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Address created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
//post Add a new address
app.post('/addresses', async (req, res) => {
    try {
      const { address_type_code, is_primary, name, primary_contact_name, line1, line2, line3, city, state_or_province, country, zipcode, relationship_type, user_id } = req.body;
      const client = await pool.connect();
  
      const addressId = uuidv4();
      await client.query('INSERT INTO addresses (id, address_type_code, is_primary, name, primary_contact_name, line1, line2, line3, city, state_or_province, country, zipcode) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)', [addressId, address_type_code, is_primary, name, primary_contact_name, line1, line2, line3, city, state_or_province, country, zipcode]);
  
      await client.query('INSERT INTO user_address_relation (id, user_id, address_id, relationship_type) VALUES ($1, $2, $3, $4)', [uuidv4(), user_id, addressId, relationship_type]);
      
  
      client.release();
      res.status(201).json({ id: addressId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error adding address' });
    }
  });

/**
 * @swagger
 * /addresses/{id}:
 *   put:
 *     summary: Update an existing address
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address_type_code:
 *                 type: string
 *               is_primary:
 *                 type: boolean
 *               name:
 *                 type: string
 *               primary_contact_name:
 *                 type: string
 *               line1:
 *                 type: string
 *               line2:
 *                 type: string
 *               line3:
 *                 type: string
 *               city:
 *                 type: string
 *               state_or_province:
 *                 type: string
 *               country:
 *                 type: string
 *               zipcode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Address updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /addresses/{id}:
 *   delete:
 *     summary: Delete an address by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Address deleted successfully
 *       500:
 *         description: Internal server error
 */
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
      res.status(500).json({ error: 'Error deleting address' });
    }
  });

/**
 * @swagger
 * /addresses/{id}:
 *   get:
 *     summary: Retrieve an address by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Address retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *       404:
 *         description: Address not found
 *       500:
 *         description: Internal server error
 */
// Retrieve an address by ID
app.get('/addresses/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM addresses WHERE id=$1', [id]);
      client.release();
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Address not found' });
      }
      res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error retrieving address' });
    }
  });
  
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
