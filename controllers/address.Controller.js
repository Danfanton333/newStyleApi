import { connect } from '../config/database.js';

export const showAddress = async (req, res) => {
    try {
        let sqlQuery= "SELECT * FROM address";
        const [result] = await connect.query(sqlQuery);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Error fetching address", details: error.message });
    }
};

export const showAddressId = async (req, res) => {
    try {
        const [result] = await connect.query('SELECT * FROM address WHERE address_id = ?', [req.params.id]);
        if (result.length === 0) return res.status(404).json({ error: "address not found"});
        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({ error: "Error fetching address", details: error.message });
    }
};

export const addAddress = async (req, res) => {
    try {
        const { addressNumberStreet, addressBarrio, addressLocalidad, addressCiudad } = req.body;
        if (!addressNumberStreet || !addressBarrio || !addressLocalidad || !addressCiudad) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        let sqlQuery = "INSERT INTO address (Address_number_street, address_barrio, address_localidad, address_ciudad) VALUES (?,?,?,?)";
        const [result] = await connect.query(sqlQuery, [addressNumberStreet, addressBarrio, addressLocalidad, addressCiudad]);
        res.status(201).json({
            data: [{ id: result.insertId, addressNumberStreet, addressBarrio, addressLocalidad, addressCiudad}],
            status: 201
        });
    } catch (error) {
        res.status(500).json({ error: "Error adding address", details: error.message });
    }
};

export const updateAddress = async (req, res) => {
    try {
        const { addressNumberStreet, addressBarrio, addressLocalidad, addressCiudad } = req.body;
        if ( !addressNumberStreet || !addressBarrio || !addressLocalidad || !addressCiudad ) {
            return res.status(400).json({ error: "Missing required fields "});
        }
        let sqlQuery = "UPDATE address SET Address_number_street=?, address_barrio=?, address_localidad=?, address_ciudad=? WHERE Address_id=?";
        const [result] = await connect.query(sqlQuery, [addressNumberStreet, addressBarrio, addressLocalidad, addressCiudad, req.params.id ]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "address not found"});
        res.status(200).json({
            data: [{ addressNumberStreet, addressBarrio, addressLocalidad, addressCiudad }],
            status: 200,
            updated: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error updating address", details: error.message });
    }
};

export const deleteAddress = async (req, res) => {
    try {
        let sqlQuery = "DELETE FROM address WHERE address_id = ?";
        const [result] = await connect.query(sqlQuery, [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "address not found" });
        res.status(200).json({
            data: [],
            status: 200,
            deleted: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error deleting address", details: error.message});
    }
};
