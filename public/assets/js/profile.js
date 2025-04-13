 // perfil.Models.js

/// Función para habilitar/deshabilitar un campo específico
 function toggleEdit(fieldId) {
  const field = document.getElementById(fieldId);
  const editButton = document.querySelector(`[onclick="toggleEdit('${fieldId}')"]`);

   if (field.readOnly || field.disabled) {
       // Habilitar el campo y cambiar el botón a "Guardar"
      field.readOnly = false;
       field.disabled = false;
      field.style.backgroundColor = "#fff"; // Cambia el fondo a blanco para indicar edición
      field.style.color = "#000"; // Cambia el texto a negro
     editButton.textContent = "Guardar";
  } else {
       // Deshabilitar el campo y cambiar el botón a "Editar"
      field.readOnly = true;
      field.disabled = true;
     field.style.backgroundColor = "#212529"; // Restaura el fondo oscuro
     field.style.color = "#fff"; // Restaura el texto blanco
      editButton.textContent = "Editar";
 }
}