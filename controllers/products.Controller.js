import { connect } from '../config/database.js';


export const showProducts = async (req, res) => {
    try {
        let sqlQuery= "SELECT * FROM product";
        const [result] = await connect.query(sqlQuery);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Error fetching producto", details: error.message });
    }
};

export const showProductsId = async (req, res) => {
    try {
        const [result] = await connect.query('SELECT * FROM product WHERE Product_id =? ', [req.params.id]);
        if (result.length === 0) return res.status(404).json({ error: "Producto not found"});
        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({ error: "Error fetching producto", details: error.message });
    }
};

export const addProducts = async (req, res) => {
    try {
        const { Name, Amount, category, description, image, Brand, ColorId, sizeId } = req.body;
        if ( !Name || !Amount || !category || !description || !Brand  ||!ColorId || !sizeId )  {
            return res.status(400).json({ error: "Missing required fields" });
        }
        let sqlQuery = "INSERT INTO product (Product_name, Product_amount, Product_category, Product_description, Product_image, Brand_id, Color_id, Size_id) VALUES (?,?,?,?,?,?,?,?)";
        const [result] = await connect.query(sqlQuery, [Name, Amount, category, description, image, Brand, ColorId, sizeId ]);
        res.status(201).json({
            data: [{ id: result.insertId, Name, Amount, category, description, image, Brand, ColorId, sizeId  }],
            status: 201
        });
    } catch (error) {
        res.status(500).json({ error: "Error adding product ", details: error.message });
    }
};

export const updateProducts = async (req, res) => {
    try {
        const { Name, Amount, category, description, image, Brand, ColorId, sizeId  } = req.body;
        if ( !Name || !Amount || !category || !description) {
            return res.status(400).json({ error: "Missing required fields "});
        }
        let sqlQuery = "UPDATE product SET Product_name=?, Product_amount=?, Product_category=?, Product_description=?, Product_image=?, Brand_id=?, Color_id=?, Size_id=? WHERE Product_id=?";
        const [result] = await connect.query(sqlQuery, [ Name, Amount, category, description, image, Brand, ColorId, sizeId, req.params.id ]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Producto not found"});
        res.status(200).json({
            data: [{Name, Amount, category, description, image, Brand, ColorId, sizeId}],
            status: 200,
            updated: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error updating producto", details: error.message });
    }
};

export const deleteProducts = async (req, res) => {
    try {
        let sqlQuery = "DELETE FROM product WHERE Product_id = ?";
        const [result] = await connect.query(sqlQuery, [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Producto not found" });
        res.status(200).json({
            data: [],
            status: 200,
            deleted: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error deleting producto", details: error.message});
    }
};
