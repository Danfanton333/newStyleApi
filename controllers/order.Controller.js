import { connect } from '../config/database.js';


export const showOrder = async (req, res) => {
    try {
        let sqlQuery= "SELECT * FROM `order`";
        const [result] = await connect.query(sqlQuery);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Error fetching order", details: error.message });
    }
};

export const showOrderId = async (req, res) => {
    try {
        const [result] = await connect.query('SELECT * FROM `order` WHERE Order_id =? ', [req.params.id]);
        if (result.length === 0) return res.status(404).json({ error: "Order not found"});
        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({ error: "Error fetching Order", details: error.message });
    }
};

export const addOrder = async (req, res) => {
    try {
        const { OrderDate, OrderValueSales, UserId, StateOrderId } = req.body;
        if (!OrderDate|| !OrderValueSales || !UserId )  {
            return res.status(400).json({ error: "Missing required fields" });
        }
        let sqlQuery = "INSERT INTO `order` (Order_date, Order_value_sales, User_id, State_order_id) VALUES (?,?,?,?)";
        const [result] = await connect.query(sqlQuery, [ OrderDate, OrderValueSales, UserId, StateOrderId  ]);
        res.status(201).json({
            data: [{ id: result.insertId, OrderDate, OrderValueSales, UserId, StateOrderId }],
            status: 201
        });
    } catch (error) {
        res.status(500).json({ error: "Error adding order ", details: error.message });
    }
};

export const updateOrder = async (req, res) => {
    try {
        const { OrderDate, OrderValueSales, UserId, StateOrderId } = req.body;
        if ( !OrderDate|| !OrderValueSales || !UserId  ) {
            return res.status(400).json({ error: "Missing required fields "});
        }
        let sqlQuery = "UPDATE `order` SET Order_date=?, Order_value_sales=?, User_id=?, State_order_id=?  WHERE Order_id=?";
        const [result] = await connect.query(sqlQuery, [OrderDate, OrderValueSales, UserId, StateOrderId, req.params.id ]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Order not found"});
        res.status(200).json({
            data: [{OrderDate, OrderValueSales, UserId, StateOrderId}],
            status: 200,
            updated: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error updating Order", details: error.message });
    }
};

export const deleteOrder = async (req, res) => {
    try {
        let sqlQuery = "DELETE FROM `order` WHERE Order_id=?";
        const [result] = await connect.query(sqlQuery, [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Order not found" });
        res.status(200).json({
            data: [],
            status: 200,
            deleted: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error deleting Order", details: error.message});
    }
};
