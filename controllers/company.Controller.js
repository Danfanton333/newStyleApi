import { connect } from '../config/database.js';

export const showCompany = async (req, res) => {
    try {
        let sqlQuery= "SELECT * FROM company";
        const [result] = await connect.query(sqlQuery);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Error fetching Company", details: error.message });
    }
};

export const showCompanyId = async (req, res) => {
    try {
        const [result] = await connect.query('SELECT * FROM company WHERE Company_id = ?', [req.params.id]);
        if (result.length === 0) return res.status(404).json({ error: "Company not found"});
        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({ error: "Error fetching Company", details: error.message });
    }
};

export const addCompany = async (req, res) => {
    try {
        const { CompanyName, CompanyAddress, CompanyPhone, CompanyEmail } = req.body;
        if (!CompanyName || !CompanyAddress || !CompanyPhone || !CompanyEmail ) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        let sqlQuery = "INSERT INTO company (Company_name, Company_Address, Company_phone, Company_mail) VALUES (?,?,?,?)";
        const [result] = await connect.query(sqlQuery, [CompanyName, CompanyAddress, CompanyPhone, CompanyEmail]);
        res.status(201).json({
            data: [{ id: result.insertId,CompanyName, CompanyAddress, CompanyPhone, CompanyEmail}],
            status: 201
        });
    } catch (error) {
        res.status(500).json({ error: "Error adding Company", details: error.message });
    }
};

export const updateCompany = async (req, res) => {
    try {
        const {CompanyName, CompanyAddress, CompanyPhone, CompanyEmail} = req.body;
        if (!CompanyName || !CompanyAddress) {
            return res.status(400).json({ error: "Missing required fields "});
        }
        let sqlQuery = "UPDATE company SET Company_name=?, Company_Address=?, Company_phone=?, Company_mail=? WHERE Company_id=?";
        const [result] = await connect.query(sqlQuery, [CompanyName, CompanyAddress, CompanyPhone, CompanyEmail, req.params.id ]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "company not found"});
        res.status(200).json({
            data: [{CompanyName, CompanyAddress, CompanyPhone, CompanyEmail}],
            status: 200,
            updated: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error updating Company", details: error.message });
    }
};

export const deleteCompany = async (req, res) => {
    try {
        let sqlQuery = "DELETE FROM company WHERE Company_id = ?";
        const [result] = await connect.query(sqlQuery, [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Company not found" });
        res.status(200).json({
            data: [],
            status: 200,
            deleted: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error deleting Company", details: error.message});
    }
};
