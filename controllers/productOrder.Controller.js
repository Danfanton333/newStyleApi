import { connect } from '../config/database.js';


export const showProductOrder = async (req, res) => {
    try {
        let sqlQuery= "SELECT * FROM product_order";
        const [result] = await connect.query(sqlQuery);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Error fetching product_order", details: error.message });
    }
};

export const showProductOrderId = async (req, res) => {
    try {
        const [result] = await connect.query('SELECT * FROM product_order WHERE product_order=?', [req.params.id]); //cambiar a product_order_id
        if (result.length === 0) return res.status(404).json({ error: "product_order Not found"});
        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({ error: "Error fetching product_order", details: error.message });
    }
};

export const addProductOrder = async (req, res) => {
    try {
        const { productFk, OrderFk } = req.body;
        if ( !productFk || !OrderFk )  {
            return res.status(400).json({ error: "Missing required fields" });
        }
        let sqlQuery = "INSERT INTO product_order (Product_fk, Order_fk) VALUES (?,?)";
        const [result] = await connect.query(sqlQuery, [productFk, OrderFk ]);
        res.status(201).json({
            data: [{ id: result.insertId, productFk, OrderFk }],
            status: 201
        });
    } catch (error) {
        res.status(500).json({ error: "Error adding product_order ", details: error.message });
    }
};

export const updateProductOrder = async (req, res) => {
    try {
        const { productFk, OrderFk} = req.body;
        if (!productFk || !OrderFk) {
            return res.status(400).json({ error: "Missing required fields "});
        }
        let sqlQuery = "UPDATE product_order SET Product_fk=?, Order_fk=? WHERE Product_order=?";
        const [result] = await connect.query(sqlQuery, [productFk, OrderFk, req.params.id ]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "product_order not found"});
        res.status(200).json({
            data: [{productFk, OrderFk}],
            status: 200,
            updated: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error updating product_order", details: error.message });
    }
};

export const deleteProductOrder = async (req, res) => {
    try {
        let sqlQuery = "DELETE FROM product_order WHERE Product_order=?";
        const [result] = await connect.query(sqlQuery, [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "product_order not found" });
        res.status(200).json({
            data: [],
            status: 200,
            deleted: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error deleting product_order", details: error.message});
    }
};
