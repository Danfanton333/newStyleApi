import { connect } from '../config/database.js';


export const showIncome = async (req, res) => {
    try {
        let sqlQuery= "SELECT * FROM income";
        const [result] = await connect.query(sqlQuery);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Error fetching income", details: error.message });
    }
};

export const showIncomeId = async (req, res) => {
    try {
        const [result] = await connect.query('SELECT * FROM income WHERE Income_id =? ', [req.params.id]);
        if (result.length === 0) return res.status(404).json({ error: "income not found"});
        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({ error: "Error fetching income", details: error.message });
    }
};

//Error por postman
export const addIncome = async (req, res) => {
    try {
        const { income_date, income_amount, income_value_sale, Company_id, Product_id } = req.body;
        if (!income_date || !income_amount || !income_value_sale || !Company_id || !Product_id)  {
            return res.status(400).json({ error: "Missing required fields" });
        }
        let sqlQuery = "INSERT INTO income (income_date, income_amount, income_value_sale, Company_id) VALUES (?,?,?,?,?)";
        const [result] = await connect.query(sqlQuery, [income_date, income_amount, income_value_sale, Company_id, Product_id]);
        res.status(201).json({
            data: [{ id: result.insertId, income_date, income_amount, income_value_sale, Company_id, Product_id }],
            status: 201
        });
    } catch (error) {
        res.status(500).json({ error: "Error adding income ", details: error.message });
    }
};

export const updateIncome = async (req, res) => {
    try {
        const {income_date, income_amount, income_value_sale, Company_id} = req.body;
        if (!income_date || !income_amount  ||!income_value_sale || !Company_id || !Product_id ) {
            return res.status(400).json({ error: "Missing required fields "});
        }
        let sqlQuery = "UPDATE income SET income_date=?, income_amount=?, income_value_sale=?, Company_id=?, Product_id WHERE Income_id=?";
        const [result] = await connect.query(sqlQuery, [income_date, income_amount, income_value_sale, Company_id, Product_id, req.params.id ]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "income not found"});
        res.status(200).json({
            data: [{ income_date, income_amount, income_value_sale, Company_id, Product_id }],
            status: 200,
            updated: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error updating income", details: error.message });
    }
};

export const deleteIncome = async (req, res) => {
    try {
        let sqlQuery = "DELETE FROM income WHERE income_id = ?";
        const [result] = await connect.query(sqlQuery, [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "income not found" });
        res.status(200).json({
            data: [],
            status: 200,
            deleted: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error deleting income", details: error.message});
    }
};
