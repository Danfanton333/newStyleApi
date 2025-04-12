import jwt from 'jsonwebtoken';
import { connect } from '../config/database.js';
import { createUser, findUserByEmail } from '../models/usuario.Models.js';
import bcrypt from 'bcrypt';

// Función auxiliar para verificar si un Role_id existe
async function validateRole(roleId) {
    try {
        const sqlQuery = "SELECT * FROM role WHERE Role_id = ?";
        const [rows] = await connect.query(sqlQuery, [roleId]);

        if (rows.length === 0) {
            return false; // El rol no existe
        }

        return true; // El rol existe
    } catch (error) {
        console.error('Error al verificar el rol:', error);
        throw error;
    }
}

// Función para mostrar todos los usuarios
export const showUsers = async (req, res) => {
    try {
        let sqlQuery = "SELECT * FROM users";
        const [result] = await connect.query(sqlQuery);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Error fetching users", details: error.message });
    }
};

// Función para mostrar un usuario por ID
export const showUsersId = async (req, res) => {
    try {
        const [result] = await connect.query('SELECT * FROM users WHERE User_id = ?', [req.params.id]);
        if (result.length === 0) return res.status(404).json({ error: "User not found" });
        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({ error: "Error fetching user", details: error.message });
    }
};

// Función para agregar un nuevo usuario (CRUD)
export const addUsers = async (req, res) => {
    try {
        const { userName, userEmail, userPassword, roleId, stateUserId, CompanyId } = req.body;

        // Validar campos obligatorios
        if (!userName || !userEmail || !userPassword || !roleId) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Verificar si el Role_id existe
        const roleExists = await validateRole(roleId);
        if (!roleExists) {
            return res.status(400).json({ error: "Invalid Role ID" });
        }

        // Hashear la contraseña antes de guardarla
        const trimmedPassword = userPassword.trim(); // Eliminar espacios en blanco
        const hashedPassword = await bcrypt.hash(trimmedPassword, 10);

        // Insertar el nuevo usuario en la base de datos
        const sqlQuery = `
            INSERT INTO users (User_name, User_mail, User_password, Role_id, State_user_id, Company_id)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await connect.query(sqlQuery, [
            userName,
            userEmail,
            hashedPassword,
            roleId,
            stateUserId,
            CompanyId
        ]);

        // Respuesta exitosa
        res.status(201).json({
            data: {
                id: result.insertId,
                userName,
                userEmail,
                roleId,
                stateUserId,
                CompanyId
            },
            status: 201
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error adding user", details: error.message });
    }
};

// Función para actualizar un usuario existente
export const updateUsers = async (req, res) => {
    try {
        const { userName, userEmail, userPassword, roleId, stateUserId, CompanyId } = req.body;

        // Si se proporciona una nueva contraseña, hashearla antes de guardarla
        let hashedPassword = null;
        if (userPassword) {
            const trimmedPassword = userPassword.trim();
            hashedPassword = await bcrypt.hash(trimmedPassword, 10);
        }

        // Actualizar el usuario en la base de datos
        let sqlQuery = "UPDATE users SET User_Name=?, User_mail=?, User_password=?, Role_id=?, State_user_id=?, Company_id=? WHERE User_id=?";
        const [result] = await connect.query(sqlQuery, [
            userName,
            userEmail,
            hashedPassword || null, // Solo actualiza si se proporciona una nueva contraseña
            roleId,
            stateUserId,
            CompanyId,
            req.params.id
        ]);

        if (result.affectedRows === 0) return res.status(404).json({ error: "User not found" });

        // Respuesta exitosa
        res.status(200).json({
            data: [{ userName, userEmail, roleId, stateUserId, CompanyId }],
            status: 200,
            updated: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error updating user", details: error.message });
    }
};

// Función para eliminar un usuario
export const deleteUsers = async (req, res) => {
    try {
        let sqlQuery = "DELETE FROM users WHERE User_id = ?";
        const [result] = await connect.query(sqlQuery, [req.params.id]);

        if (result.affectedRows === 0) return res.status(404).json({ error: "User not found" });

        // Respuesta exitosa
        res.status(200).json({
            data: [],
            status: 200,
            deleted: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error deleting user", details: error.message });
    }
};

// Función para manejar el inicio de sesión
export const loginUser = async (req, res) => {
    try {
        // Extraer userEmail y userPassword del cuerpo de la solicitud
        const { userEmail, userPassword } = req.body;

        // Validar campos obligatorios
        if (!userEmail || !userPassword) {
            return res.status(400).json({ error: "Correo electrónico y contraseña son obligatorios" });
        }

        // Buscar al usuario en la base de datos
        let sqlQuery = "SELECT * FROM users WHERE User_mail = ?";
        const [rows] = await connect.query(sqlQuery, [userEmail]);

        if (rows.length === 0) {
            console.log('Usuario no encontrado');
            return res.status(401).json({ error: "Credenciales incorrectas" });
        }

        const user = rows[0];
        console.log('Usuario encontrado:', user);

        // Comparar la contraseña hasheada con la contraseña proporcionada
        console.log('Comparando contraseñas...');
        const isPasswordValid = await bcrypt.compare(userPassword, user.User_password);
        if (!isPasswordValid) {
            console.log('Contraseña incorrecta');
            return res.status(401).json({ error: "Credenciales incorrectas" });
        }

        // Obtener el nombre del rol desde la tabla `role`
        const roleQuery = "SELECT Role_name FROM role WHERE Role_id = ?";
        const [roleRows] = await connect.query(roleQuery, [user.Role_id]);

        if (roleRows.length === 0) {
            console.log('Rol no encontrado');
            return res.status(500).json({ error: "Error al obtener el rol del usuario" });
        }

        const roleName = roleRows[0].Role_name; // Nombre del rol

        // Generar un token JWT
        console.log('Generando token JWT...');
        const token = jwt.sign(
            {
                id: user.User_id,
                userName: user.User_name,
                userEmail: user.User_mail,
                roleId: user.Role_id, // Incluir el Role_id en el token
                roleName: roleName   // Incluir el nombre del rol en el token
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Respuesta exitosa
        res.status(200).json({
            message: "Inicio de sesión exitoso",
            token,
            user: {
                id: user.User_id,
                userName: user.User_name,
                userEmail: user.User_mail,
                roleId: user.Role_id, // Incluir el Role_id en la respuesta
                roleName: roleName   // Incluir el nombre del rol en la respuesta
            }
        });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: "Error al iniciar sesión", details: error.message });
    }
};