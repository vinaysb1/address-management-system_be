import pool from '../database/dbConfig.js';
import { v4 as uuidv4 } from 'uuid';
import * as dbQueries from '../database/dbQueries.js';

const createAddress = async (user, address) => {
    try {
        const { address_type_code, is_primary, name, primary_contact_name, line1, line2, line3, city, state_or_province, country, zipcode } = address;

        // Generate a UUID for user ID
        const userId = uuidv4();
        const queryParams = [address_type_code, is_primary, name, primary_contact_name, line1, line2, line3, city, state_or_province, country, zipcode];
            
        const addressResult = await pool.query(dbQueries.INSERT_ADDRESS, queryParams);
        const addressId = addressResult.rows[0].id;
        const queryParams2 = [userId, addressId, user.relationship_type];
        await pool.query(dbQueries.INSERT_USER_ADDRESS, queryParams2);

        return { message: 'Address added successfully' };
    } catch (error) {
        throw new Error('Error adding address:', error.message);
    }
};

const getAddressById = async (id) => {
    try {
        const result = await pool.query(dbQueries.SELECT_ADDRESS_BY_ID, [id]);
        if (result.rows.length === 0) {
            throw new Error('Address not found');
        } else {
            return result.rows[0];
        }
    } catch (error) {
        throw new Error('Error retrieving address:', error.message);
    }
};

const updateAddress = async (id, address, user) => {
    try {
        await pool.query(
            dbQueries.UPDATE_ADDRESS,
            [address.address_type_code, address.is_primary, address.name, address.primary_contact_name, address.line1, address.line2, address.line3, address.city, address.state_or_province, address.country, address.zipcode, id]
        );
        await pool.query(dbQueries.UPDATE_USER_ADDRESS_RELATIONSHIP, [user.relationship_type, id, user.id]);

        return { message: 'Address updated successfully' };
    } catch (error) {
        throw new Error('Error updating address:', error.message);
    }
};

const deleteAddress = async (id) => {
    try {
        await pool.query(dbQueries.DELETE_ADDRESS_BY_ID, [id]);
        return { message: 'Address deleted successfully' };
    } catch (error) {
        throw new Error('Error deleting address:', error.message);
    }
};

export { createAddress, getAddressById, updateAddress, deleteAddress };