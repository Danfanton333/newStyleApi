document.addEventListener("DOMContentLoaded", () => {
    const userTableBody = document.querySelector("#userTable tbody");
    const userModal = document.getElementById("userModal");
    const userForm = document.getElementById("userForm");
    const userIdInput = document.getElementById("userId");
    const userNameInput = document.getElementById("userName");
    const userEmailInput = document.getElementById("userEmail");
    const userPasswordInput = document.getElementById("userPassword");
    const roleIdInput = document.getElementById("roleId");
    const stateUserIdInput = document.getElementById("stateUserId");
    const companyIdInput = document.getElementById("CompanyId");

    async function loadUsers() {
        try {
            const response = await fetch("http://localhost:3000/api_v1/users");
            if (!response.ok) throw new Error(`Error en la consulta: ${response.statusText}`);

            const users = await response.json();
            if (!users || users.length === 0) return alert("No se encontraron usuarios.");

            userTableBody.innerHTML = "";
            users.forEach(user => {
                const row = `
                    <tr>
                        <td>${user.User_id || 'N/A'}</td>
                        <td>${user.User_name || 'N/A'}</td>
                        <td>${user.User_mail || 'N/A'}</td>
                        <td>${user.Role_id || 'N/A'}</td>
                        <td>
                            <button class="action-btn btn-show" data-id="${user.User_id}"><i class="fas fa-eye"></i></button>
                            <button class="action-btn btn-edit" data-id="${user.User_id}" data-bs-toggle="modal" data-bs-target="#userModal"><i class="fas fa-edit"></i></button>
                            <button class="action-btn btn-delete" data-id="${user.User_id}"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `;
                userTableBody.insertAdjacentHTML("beforeend", row);
            });

            userTableBody.addEventListener("click", async (e) => {
                const target = e.target.closest("button");
                if (!target) return;

                const userId = target.getAttribute("data-id");

                if (target.classList.contains("btn-show")) {
                    await handleShowUser(userId);
                } else if (target.classList.contains("btn-edit")) {
                    await handleEditUser(userId);
                } else if (target.classList.contains("btn-delete")) {
                    await handleDeleteUser(userId);
                }
            });

        } catch (error) {
            alert(`Error al cargar usuarios: ${error.message}`);
        }
    }

    userForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const userData = {
            userName: userNameInput.value.trim(),
            userEmail: userEmailInput.value.trim(),
            userPassword: userPasswordInput.value.trim(),
            roleId: parseInt(roleIdInput.value),
            stateUserId: stateUserIdInput.value ? parseInt(stateUserIdInput.value) : null,
            CompanyId: companyIdInput.value ? parseInt(companyIdInput.value) : null
        };

        const userId = userIdInput.value;
        const method = userId ? "PUT" : "POST";
        const url = userId
            ? `http://localhost:3000/api_v1/users/${userId}`
            : "http://localhost:3000/api_v1/users";

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData)
            });

            if (!response.ok) throw new Error("Error al guardar el usuario");

            bootstrap.Modal.getInstance(userModal).hide();
            userForm.reset();
            userIdInput.value = "";
            loadUsers();

        } catch (error) {
            alert(`Error al guardar el usuario: ${error.message}`);
        }
    });

    async function handleShowUser(userId) {
        try {
            const response = await fetch(`http://localhost:3000/api_v1/users/${userId}`);
            if (!response.ok) throw new Error("Error al obtener el usuario");

            const user = await response.json();
            if (!user) return alert("Usuario no encontrado.");

            alert(`Detalles del usuario:\nID: ${user.User_id}\nNombre: ${user.User_name}\nEmail: ${user.User_mail}\nRol: ${user.Role_id}`);

        } catch (error) {
            alert(`Error al mostrar usuario: ${error.message}`);
        }
    }

    async function handleEditUser(userId) {
        try {
            const response = await fetch(`http://localhost:3000/api_v1/users/${userId}`);
            if (!response.ok) throw new Error("Error al obtener el usuario");

            const user = await response.json();
            if (!user) return alert("Usuario no encontrado.");

            document.getElementById("userModalLabel").textContent = "Editar Usuario";
            userIdInput.value = user.User_id;
            userNameInput.value = user.User_name || "";
            userEmailInput.value = user.User_mail || "";
            userPasswordInput.value = ""; // no se muestra contraseña por seguridad
            roleIdInput.value = user.Role_id || "";
            stateUserIdInput.value = user.State_user_id || "";
            companyIdInput.value = user.Company_id || "";

        } catch (error) {
            alert(`Error al editar usuario: ${error.message}`);
        }
    }

    async function handleDeleteUser(userId) {
        if (!confirm("¿Estás seguro de eliminar este usuario?")) return;

        try {
            const response = await fetch(`http://localhost:3000/api_v1/users/${userId}`, {
                method: "DELETE"
            });

            if (!response.ok) throw new Error("Error al eliminar el usuario");

            loadUsers();

        } catch (error) {
            alert(`Error al eliminar el usuario: ${error.message}`);
        }
    }

    loadUsers();
});
