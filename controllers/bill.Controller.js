import { connect } from '../config/database.js';


export const showBill = async (req, res) => {
    try {
        let sqlQuery= "SELECT * FROM bill";
        const [result] = await connect.query(sqlQuery);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Error fetching bill", details: error.message });
    }
};

export const showBillId = async (req, res) => {
    try {
        const [result] = await connect.query('SELECT * FROM bill WHERE Bill_id =? ', [req.params.id]);
        if (result.length === 0) return res.status(404).json({ error: "Bill not found"});
        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({ error: "Error fetching Bill", details: error.message });
    }
};

export const addBill = async (req, res) => {
    try {
        const { BillDate, OrderId } = req.body;
        if (!BillDate || !OrderId)  {
            return res.status(400).json({ error: "Missing required fields" });
        }
        let sqlQuery = "INSERT INTO bill (Bill_date, Order_id) VALUES (?,?)";
        const [result] = await connect.query(sqlQuery, [ BillDate, OrderId ]);
        res.status(201).json({
            data: [{ id: result.insertId, BillDate, OrderId }],
            status: 201
        });
    } catch (error) {
        res.status(500).json({ error: "Error adding bill ", details: error.message });
    }
};

export const updateBill = async (req, res) => {
    try {
        const { BillDate, OrderId} = req.body;
        if ( !BillDate ) {
            return res.status(400).json({ error: "Missing required fields "});
        }
        let sqlQuery = "UPDATE bill SET Bill_date=?, Order_id=? WHERE Bill_id=?";
        const [result] = await connect.query(sqlQuery, [BillDate, OrderId, req.params.id ]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Bill not found"});
        res.status(200).json({
            data: [{ BillDate, OrderId }],
            status: 200,
            updated: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error updating Bill", details: error.message });
    }
};

export const deleteBill = async (req, res) => {
    try {
        let sqlQuery = "DELETE FROM bill WHERE Bill_id = ?";
        const [result] = await connect.query(sqlQuery, [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Bill not found" });
        res.status(200).json({
            data: [],
            status: 200,
            deleted: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error deleting Bill", details: error.message});
    }
};
