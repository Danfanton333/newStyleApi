import { connect } from '../config/database.js';


export const showPaymentMethod = async (req, res) => {
    try {
        let sqlQuery= "SELECT * FROM payment_method";
        const [result] = await connect.query(sqlQuery);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Error fetching payment_method", details: error.message });
    }
};

export const showPaymentMethodId = async (req, res) => {
    try {
        const [result] = await connect.query('SELECT * FROM payment_method WHERE Payment_method_id = ?', [req.params.id]);
        if (result.length === 0) return res.status(404).json({ error: "payment method not found"});
        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({ error: "Error fetching payment_method", details: error.message });
    }
};

export const addPaymentMethod = async (req, res) => {
    try {
        const { PaymentMethodName } = req.body;
        if (! PaymentMethodName ) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        let sqlQuery = "INSERT INTO payment_method (payment_method_name ) VALUES (?)";
        const [result] = await connect.query(sqlQuery, [ PaymentMethodName ]);
        res.status(201).json({
            data: [{ id: result.insertId, PaymentMethodName }],
            status: 201
        });
    } catch (error) {
        res.status(500).json({ error: "Error adding payment_method", details: error.message });
    }
};

export const updatePaymentMethod = async (req, res) => {
    try {
        const { PaymentMethodName  } = req.body;
        if ( !PaymentMethodName ) {
            return res.status(400).json({ error: "Missing required fields "});
        }
        let sqlQuery = "UPDATE payment_method SET payment_method_name =? WHERE Payment_method_id=?";
        const [result] = await connect.query(sqlQuery, [PaymentMethodName, req.params.id ]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Direccion not found"});
        res.status(200).json({
            data: [{ PaymentMethodName  }],
            status: 200,
            updated: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error updating payment_method", details: error.message });
    }
};

export const deletePaymentMethod = async (req, res) => {
    try {
        let sqlQuery = "DELETE FROM payment_method WHERE payment_method_id  = ?";
        const [result] = await connect.query(sqlQuery, [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "payment_method not found" });
        res.status(200).json({
            data: [],
            status: 200,
            deleted: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error deleting payment_method", details: error.message});
    }
};
