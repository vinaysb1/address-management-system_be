/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for the user
 *         relationship_type:
 *           type: string
 *           description: The type of relationship between the user and the address
 *           enum:
 *             - OWNER
 *             - TENANT
 *             - OTHER
 *     Address:
 *       type: object
 *       properties:
 *         address_type_code:
 *           type: string
 *           description: The type of address (e.g., home, work)
 *         is_primary:
 *           type: boolean
 *           description: Indicates if the address is primary
 *         name:
 *           type: string
 *           description: Name associated with the address
 *         primary_contact_name:
 *           type: string
 *           description: Primary contact name for the address
 *         line1:
 *           type: string
 *           description: First line of the address
 *         line2:
 *           type: string
 *           description: Second line of the address
 *         line3:
 *           type: string
 *           description: Third line of the address
 *         city:
 *           type: string
 *           description: City of the address
 *         state_or_province:
 *           type: string
 *           description: State or province of the address
 *         country:
 *           type: string
 *           description: Country of the address
 *         zipcode:
 *           type: string
 *           description: ZIP code of the address
 */

/**
 * @swagger
 * /address:
 *   post:
 *     summary: Create a new address
 *     description: Creates a new address record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 $ref: '#/components/schemas/User'
 *               address:
 *                 $ref: '#/components/schemas/Address'
 *     responses:
 *       201:
 *         description: Address created successfully
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /address/{id}:
 *   get:
 *     summary: Get an address by ID
 *     description: Retrieve an address record by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the address to retrieve
 *     responses:
 *       200:
 *         description: Address retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 *       404:
 *         description: Address not found
 *       500:
 *         description: Internal Server Error
 *   put:
 *     summary: Update an address
 *     description: Update an existing address record
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the address to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 $ref: '#/components/schemas/User'
 *               address:
 *                 $ref: '#/components/schemas/Address'
 *     responses:
 *       200:
 *         description: Address updated successfully
 *       500:
 *         description: Internal Server Error
 *   delete:
 *     summary: Delete an address
 *     description: Delete an existing address record
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the address to delete
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *       500:
 *         description: Internal Server Error
 */

import express from 'express';
import {
  createAddress,
  getAddressById,
  updateAddress,
  deleteAddress,
} from '../controllers/addressController.js';

const router = express.Router();

router.route('/').post(createAddress);
router.route('/:id').get(getAddressById).put(updateAddress).delete(deleteAddress);

export default router;