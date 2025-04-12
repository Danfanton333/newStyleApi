import { connect } from '../config/database.js';


export const showProfile = async (req, res) => {
    try {
        let sqlQuery= "SELECT * FROM profile";
        const [result] = await connect.query(sqlQuery);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Error fetching Profile", details: error.message });
    }
};

export const showProfileId = async (req, res) => {
    try {
        const [result] = await connect.query('SELECT * FROM profile WHERE Profile_id =? ', [req.params.id]);
        if (result.length === 0) return res.status(404).json({ error: "Profile not found"});
        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({ error: "Error fetching Profile", details: error.message });
    }
};

export const addProfile = async (req, res) => {
    try {
        const { ProfileName, ProfileName2, ProfileLastName, ProfileLastName2, ProfileDocument, ProfileEmail, ProfilePhone, ProfilePassword, ProfileNumberDocument, UserId } = req.body;
        if (!UserId)  {
            return res.status(400).json({ error: "Missing required fields" });
        }
        let sqlQuery = "INSERT INTO profile (Profile_name, Profile_name_2, Profile_lastname, Profile_lastname_2, Profile_document, Profile_mail, Profile_phone, Profile_password, Profile_number_document, User_id) VALUES (?,?,?,?,?,?,?,?,?,?)";
        const [result] = await connect.query(sqlQuery, [ ProfileName, ProfileName2, ProfileLastName, ProfileLastName2, ProfileDocument, ProfileEmail, ProfilePhone, ProfilePassword, ProfileNumberDocument, UserId ]);
        res.status(201).json({
            data: [{ id: result.insertId, ProfileName, ProfileName2, ProfileLastName, ProfileLastName2, ProfileDocument, ProfileEmail, ProfilePhone, ProfilePassword, ProfileNumberDocument, UserId }],
            status: 201
        });
    } catch (error) {
        res.status(500).json({ error: "Error adding Profile ", details: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { ProfileName, ProfileName2, ProfileLastName, ProfileLastName2, ProfileDocument, ProfileEmail, ProfilePhone, ProfilePassword, ProfileNumberDocument, UserId } = req.body;
        if (!ProfileName || !ProfileName2 || !ProfileLastName || !ProfileLastName2 || !ProfileDocument ||!ProfileEmail || !ProfilePassword || !UserId) {
            return res.status(400).json({ error: "Missing required fields "});
        }
        let sqlQuery = "UPDATE profile SET Profile_name=?, Profile_name_2=?, Profile_lastname=?, Profile_lastname_2=?, Profile_document=?, Profile_mail=?, Profile_phone=?, Profile_password=?, Profile_number_document=?, User_id=?  WHERE Profile_id=?";
        const [result] = await connect.query(sqlQuery, [ProfileName, ProfileName2, ProfileLastName, ProfileLastName2, ProfileDocument, ProfileEmail, ProfilePhone, ProfilePassword, ProfileNumberDocument, UserId, req.params.id ]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Profile not found"});
        res.status(200).json({
            data: [{ProfileName, ProfileName2, ProfileLastName, ProfileLastName2, ProfileDocument, ProfileEmail, ProfilePhone, ProfilePassword, ProfileNumberDocument, UserId}],
            status: 200,
            updated: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error updating profile", details: error.message });
    }
};

export const deleteProfile = async (req, res) => {
    try {
        let sqlQuery = "DELETE FROM profile WHERE Profile_id = ?";
        const [result] = await connect.query(sqlQuery, [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Profile not found" });
        res.status(200).json({
            data: [],
            status: 200,
            deleted: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error deleting Profile", details: error.message});
    }
};
