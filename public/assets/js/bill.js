document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener todos los guerreros al cargar la página
    async function getAllBill() {
      try {
        const response = await fetch('http://localhost:3000/api_v1/bill');
        if (!response.ok) throw new Error('Error al obtener la factura');
        
        const data = await response.json();
        
        // Mostrar guerreros en #warriors-list
        const listElement = document.getElementById('bill-list');
        listElement.innerHTML = data.map(bill => `
          <div class="bill-card">
            <h3>${bill.Bill_date}</h3>
            <h3>${bill.Order_id}</h3>
          </div>
        `).join(''); // Usar map + join para mejor rendimiento
      } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al cargar las marcas');
      }
    }
    // Llamada inicial
    getAllBill(); 

})