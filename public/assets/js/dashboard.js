function navigateTo(path) {
    if (!path) {
        window.location.href = '/'; // Redirige al inicio
    } else {
        window.location.href = path; // Redirige a la ruta especificada
    }
}