import { connect } from '../config/database.js';


export const showUpdateExit = async (req, res) => {
    try {
        let sqlQuery= "SELECT * FROM update_exit";
        const [result] = await connect.query(sqlQuery);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Error fetching update_exit", details: error.message });
    }
};

export const showUpdateExitId = async (req, res) => {
    try {
        const [result] = await connect.query('SELECT * FROM update_exit WHERE Update_exit_id = ?', [req.params.id]);
        if (result.length === 0) return res.status(404).json({ error: "update_exit by id not found"});
        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({ error: "Error fetching update_exit  ", details: error.message });
    }
};

export const addUpdateExit = async (req, res) => {
    try {
        const { UpdateExitDate, UpdateExitAmount, CompanyProductFk } = req.body;
        if (!UpdateExitDate || !UpdateExitAmount || !CompanyProductFk) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        let sqlQuery = "INSERT INTO update_exit (Update_exit_date, Update_exit_amount, Company_product_fk) VALUES (?,?,?)";
        const [result] = await connect.query(sqlQuery, [ UpdateExitDate, UpdateExitAmount, CompanyProductFk ]);
        res.status(201).json({
            data: [{ id: result.insertId, UpdateExitDate, UpdateExitAmount, CompanyProductFk}],
            status: 201
        });
    } catch (error) {
        res.status(500).json({ error: "Error adding update_exit", details: error.message });
    }
};

// export const updateUpdateExit = async (req, res) => {
//     try {
//         const { UpdateExitDate, UpdateExitAmount, CompanyProductFk } = req.body;
//         if ( !UpdateExitDate || !UpdateExitAmount || !CompanyProductFk ) {
//             return res.status(400).json({ error: "Missing required fields "});
//         }
//         let sqlQuery = "UPDATE update_exit SET  Update_exit_date = ?, Update_exit_amount = ?, Company_product_fk = ? WHERE Update_exit_id=?";
//         const [result] = await connect.query(sqlQuery, [UpdateExitDate, UpdateExitAmount, CompanyProductFk ]);
//         if (result.affectedRows === 0) return res.status(404).json({ error: "update_exit not found"});
//         res.status(200).json({
//             data: [{ UpdateExitDate, UpdateExitAmount, CompanyProductFk}],
//             status: 200,
//             updated: result.affectedRows
//         });
//     } catch (error) {
//         res.status(500).json({ error: "Error updating update exit", details: error.message });
//     }
// };
export const updateUpdateExit = async (req, res) => {
    try {
        const { UpdateExitDate, UpdateExitAmount, CompanyProductFk } = req.body;
        const { id } = req.params;

        if (!UpdateExitDate || !UpdateExitAmount || !CompanyProductFk) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const sqlQuery = `
            UPDATE update_exit 
            SET Update_exit_date = ?, Update_exit_amount = ?, Company_product_fk = ? 
            WHERE Update_exit_id = ?
        `;

        const values = [UpdateExitDate, UpdateExitAmount, CompanyProductFk, id];

        const [result] = await connect.query(sqlQuery, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "update_exit not found" });
        }

        res.status(200).json({
            message: "update_exit updated successfully",
            data: { UpdateExitDate, UpdateExitAmount, CompanyProductFk },
            updated: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error updating update exit", details: error.message });
    }
};




export const deleteUpdateExit = async (req, res) => {
    try {
        let sqlQuery = "DELETE FROM update_exit WHERE Update_exit_id= ?";
        const [result] = await connect.query(sqlQuery, [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "update_exit not found" });
        res.status(200).json({
            data: [],
            status: 200,
            deleted: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error deleting update_exit", details: error.message});
    }
};
