export const INSERT_ADDRESS = 'INSERT INTO addresses (address_type_code, is_primary, name, primary_contact_name, line1, line2, line3, city, state_or_province, country, zipcode) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id';

export const INSERT_USER_ADDRESS = 'INSERT INTO user_address (user_id, address_id, relationship_type) VALUES ($1, $2, $3)';

export const SELECT_ADDRESS_BY_ID = 'SELECT * FROM addresses WHERE id = $1';

export const UPDATE_ADDRESS = 'UPDATE addresses SET address_type_code = $1, is_primary = $2, name = $3, primary_contact_name = $4, line1 = $5, line2 = $6, line3 = $7, city = $8, state_or_province = $9, country = $10, zipcode = $11 WHERE id = $12';

export const UPDATE_USER_ADDRESS_RELATIONSHIP = 'UPDATE user_address SET relationship_type = $1 WHERE address_id = $2 AND user_id = $3';

export const DELETE_ADDRESS_BY_ID = 'DELETE FROM addresses WHERE id = $1';