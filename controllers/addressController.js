import * as addressService from '../services/addressService.js';


const createAddress = (async (req, res) => {
    const { user, address } = req.body;
    try {
        const result = await addressService.createAddress(user, address);
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const getAddressById = (async (req, res) => {
    const id = req.params.id;
    try {
        const result = await addressService.getAddressById(id);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const updateAddress = (async (req, res) => {
    const id = req.params.id;
    const { address, user } = req.body;
    try {
        const result = await addressService.updateAddress(id, address, user);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const deleteAddress = (async (req, res) => {
    const id = req.params.id;
    try {
        const result = await addressService.deleteAddress(id);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export { createAddress, getAddressById, updateAddress, deleteAddress };