export const loginUser = async (userEmail, userPassword) => {
    try {
        console.log('Iniciando solicitud de inicio de sesión...');
        console.log('Datos enviados:', { userEmail, userPassword });

        const response = await fetch('http://localhost:3000/api_v1/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userEmail,
                userPassword
            })
        });

        console.log('Estado de la respuesta:', response.status);
        console.log('OK:', response.ok);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error en la respuesta del servidor:', errorData);
            return { success: false, message: errorData.error || 'Error en la solicitud al servidor' };
        }

        const data = await response.json();
        console.log('Datos recibidos:', data);

        if (data.error) {
            console.error('Error:', data.error);
            return { success: false, message: data.error };
        }

        console.log('Inicio de sesión exitoso:', data.user);
        console.log('Token JWT generado:', data.token);

        // Almacenar el token JWT en localStorage
        localStorage.setItem('authToken', data.token);

        // Retornar el resultado con el rol del usuario
        return { success: true, user: data.user, token: data.token };
    } catch (error) {
        console.error('Error en la solicitud:', error);
        return { success: false, message: 'Error en la solicitud al servidor' };
    }
};

// Capturar el formulario y manejar el evento de envío
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessageElement = document.getElementById('error-message');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evitar que el formulario se envíe de forma predeterminada

        // Obtener los valores de los campos
        const userEmail = document.getElementById('email').value;
        const userPassword = document.getElementById('password').value;

        // Llamar a la función loginUser
        const result = await loginUser(userEmail, userPassword);

        if (result.success) {
            console.log('Usuario autenticado:', result.user);

            // Redirigir según el nombre del rol del usuario
            switch (result.user.roleName) {
                case "Admin": // Rol de Administrador
                    window.location.href = '../../views/dashboard/dashboard.html';
                    break;
                case "Cliente": // Rol de Cliente
                    window.location.href = '../../views/logeado/logeado.html';
                    break;
                default:
                    console.error('Rol desconocido:', result.user.roleName);
                    errorMessageElement.style.display = 'block';
                    errorMessageElement.textContent = 'Rol de usuario desconocido';
            }
        } else {
            console.error('Error de autenticación:', result.message);
            // Mostrar el mensaje de error en la interfaz
            errorMessageElement.style.display = 'block';
            errorMessageElement.textContent = result.message;
        }
    });
});