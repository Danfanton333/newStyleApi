import { connect } from '../config/database.js';

export const showCompanyProduct = async (req, res) => {
    try {
        let sqlQuery= "SELECT * FROM company_product";
        const [result] = await connect.query(sqlQuery);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Error fetching company_Products", details: error.message });
    }
};

export const showCompanyProductId = async (req, res) => {
    try {
        const [result] = await connect.query('SELECT * FROM company_product WHERE company_Product_id', [req.params.id]);
        if (result.length === 0) return res.status(404).json({ error: "company_Product not found"});
        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({ error: "Error fetching company_Product", details: error.message });
    }
};

export const addCompanyProduct = async (req, res) => {
    try {
        const { companyId, ProductId , IncomeId } = req.body;
        if (!companyId || !ProductId || !IncomeId) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        let sqlQuery = "INSERT INTO company_product (Company_id_fk, Product_id_fk, Income_id_fk ) VALUES (?,?,?)";
        const [result] = await connect.query(sqlQuery, [ companyId, ProductId , IncomeId ]);
        res.status(201).json({
            data: [{ id: result.insertId, companyId, ProductId , IncomeId }],
            status: 201
        });
    } catch (error) {
        res.status(500).json({ error: "Error adding company_Product", details: error.message });
    }
};

export const updateCompanyProduct = async (req, res) => {
    try {
        const { companyId, ProductId , IncomeId } = req.body;
        if ( !companyId || !ProductId || !IncomeId ) {
            return res.status(400).json({ error: "Missing required fields "});
        }
        let sqlQuery = "UPDATE company_product SET Company_id_fk=?, Product_id_fk=?, Income_id_fk=? WHERE Company_product_id=?";
        const [result] = await connect.query(sqlQuery, [companyId, ProductId , IncomeId, req.params.id ]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Company product not found"});
        res.status(200).json({
            data: [{ companyId, ProductId , IncomeId}],
            status: 200,
            updated: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error updating company_Product", details: error.message });
    }
};

export const deleteCompanyProduct = async (req, res) => {
    try {
        let sqlQuery = "DELETE FROM company_product WHERE Company_product_id=?";
        const [result] = await connect.query(sqlQuery, [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "company_Product not found" });
        res.status(200).json({
            data: [],
            status: 200,
            deleted: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error deleting company_Product", details: error.message});
    }
};
