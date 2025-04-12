import { connect } from '../config/database.js';

//showPaymentMethod_OrderId
export const showPaymentMethod_Order = async (req, res) => {
    try {
        let sqlQuery= "SELECT * FROM paymentMethod_order";
        const [result] = await connect.query(sqlQuery);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Error fetching paymentMethod_order", details: error.message });
    }
};

export const showPaymentMethod_OrderId = async (req, res) => {
    try {
        const [result] = await connect.query('SELECT * FROM paymentMethod_order WHERE paymenmethod_order_id=?', [req.params.id]);
        if (result.length === 0) return res.status(404).json({ error: "payment method not found"});
        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({ error: "Error fetching paymentMethod_order by id", details: error.message });
    }
};

export const addPaymentMethod_Order = async (req, res) => {
    try {
        const { PaymentMethod, OrderId } = req.body;
        if (!PaymentMethod || !OrderId) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        let sqlQuery = "INSERT INTO paymentMethod_order (Payment_method_fk, Order_fk) VALUES (?,?)";
        const [result] = await connect.query(sqlQuery, [PaymentMethod, OrderId ]);
        res.status(201).json({
            data: [{ id: result.insertId, PaymentMethod, OrderId}],
            status: 201
        });
    } catch (error) {
        res.status(500).json({ error: "Error adding paymentMethod_order", details: error.message });
    }
};

export const updatePaymentMethod_Order = async (req, res) => {
    try {
        const { PaymentMethod, OrderId } = req.body;
        if ( !PaymentMethod || !OrderId) {
            return res.status(400).json({ error: "Missing required fields "});
        }
        let sqlQuery = "UPDATE paymentMethod_order SET Payment_method_fk=?, Order_fk=? WHERE Paymenmethod_order_id=?";
        const [result] = await connect.query(sqlQuery, [PaymentMethod, OrderId, req.params.id ]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "paymentMethod_order not found"});
        res.status(200).json({
            data: [{ PaymentMethod, OrderId }],
            status: 200,
            updated: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error updating paymentMethod_order", details: error.message });
    }
};

export const deletePaymentMethod_Order = async (req, res) => {
    try {
        let sqlQuery = "DELETE FROM paymentMethod_order WHERE Paymenmethod_order_id = ?";
        const [result] = await connect.query(sqlQuery, [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "paymentMethod_order not found" });
        res.status(200).json({
            data: [],
            status: 200,
            deleted: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error deleting paymentMethod_order", details: error.message});
    }
};
