import { connect } from '../config/database.js';


export const showExitNs = async (req, res) => {
    try {
        let sqlQuery= "SELECT * FROM `exit`";
        const [result] = await connect.query(sqlQuery);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Error fetching Exit", details: error.message });
    }
};

export const showExitId = async (req, res) => {
    try {
        const [result] = await connect.query('SELECT * FROM `exit` WHERE Exit_id =? ', [req.params.id]);
        if (result.length === 0) return res.status(404).json({ error: "Exit not found"});
        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({ error: "Error fetching Exit", details: error.message });
    }
};

export const addExit = async (req, res) => {
    try {
        const { billId } = req.body;
        if (!billId)  {
            return res.status(400).json({ error: "Missing required fields" });
        }
        let sqlQuery = "INSERT INTO `exit` (Bill_id) VALUES (?)";
        const [result] = await connect.query(sqlQuery, [ billId ]);
        res.status(201).json({
            data: [{ id: result.insertId, billId }],
            status: 201
        });
    } catch (error) {
        res.status(500).json({ error: "Error adding Exit ", details: error.message });
    }
};

export const updateExit = async (req, res) => {
    try {
        const {billId} = req.body;
        if ( !billId ) {
            return res.status(400).json({ error: "Missing required fields "});
        }
        let sqlQuery = "UPDATE `exit` SET Bill_id=? WHERE Exit_id=?";
        const [result] = await connect.query(sqlQuery, [billId, req.params.id ]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Exit not found"});
        res.status(200).json({
            data: [{ billId }],
            status: 200,
            updated: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error updating Exit", details: error.message });
    }
};

export const deleteExit = async (req, res) => {
    try {
        let sqlQuery = "DELETE FROM exit_ns WHERE Exit_id = ?";
        const [result] = await connect.query(sqlQuery, [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Exit not found" });
        res.status(200).json({
            data: [],
            status: 200,
            deleted: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error deleting Exit", details: error.message});
    }
};
