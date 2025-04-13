document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('register-form');

    async function registerUser(userData) {
        try {
            const response = await fetch('http://localhost:3000/api_v1/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al registrar');
            }

            const result = await response.json();
            alert('Usuario registrado con ID: ' + result.data[0].id);
            // getAllUsers(); // Actualiza la lista si es necesario
        } catch (error) {
            alert(error.message);
        }
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Obtener los valores del formulario
        const userData = {
            userName: document.getElementById('userName').value,
            userEmail: document.getElementById('userEmail').value,
            userPassword: document.getElementById('userPassword').value,
            roleId: parseInt(document.getElementById('roleId').value), // Asegúrate de tener un campo para el rol

        };

       
        registerUser(userData);
    });
});