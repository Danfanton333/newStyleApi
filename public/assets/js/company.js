document.addEventListener("DOMContentLoaded", () => {
    const companiesTableBody = document.querySelector("#companiesTable tbody");
    const companyModal = document.getElementById("companyModal");
    const companyForm = document.getElementById("companyForm");
    const companyNameInput = document.getElementById("companyName");
    const companyAddressInput = document.getElementById("companyAddress");
    const companyPhoneInput = document.getElementById("companyPhone");
    const companyEmailInput = document.getElementById("companyEmail"); // Nuevo campo
    const companyIdInput = document.getElementById("companyId");

    // Cargar empresas
    async function loadCompanies() {
        try {
            const response = await fetch("http://localhost:3000/api_v1/company");
            if (!response.ok) throw new Error("Error al obtener empresas");
            const companies = await response.json();
            companiesTableBody.innerHTML = "";
            companies.forEach(company => {
                const row = `
                    <tr>
                        <td>${company.Company_id}</td>
                        <td>${company.Company_name}</td>
                        <td>${company.Company_address}</td>
                        <td>${company.Company_phone}</td>
                        <td>${company.Company_email}</td> <!-- Nueva columna -->
                        <td>
                            <button class="action-btn btn-show" data-id="${company.Company_id}"><i class="fas fa-eye"></i></button>
                            <button class="action-btn btn-edit" data-id="${company.Company_id}" data-bs-toggle="modal" data-bs-target="#companyModal"><i class="fas fa-edit"></i></button>
                            <button class="action-btn btn-delete" data-id="${company.Company_id}"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `;
                companiesTableBody.insertAdjacentHTML("beforeend", row);
            });

            document.querySelectorAll(".btn-show").forEach(button => button.addEventListener("click", handleShowCompany));
            document.querySelectorAll(".btn-edit").forEach(button => button.addEventListener("click", handleEditCompany));
            document.querySelectorAll(".btn-delete").forEach(button => button.addEventListener("click", handleDeleteCompany));
        } catch (error) {
            alert("Error al cargar empresas: " + error.message);
        }
    }

    // Abrir modal para agregar una nueva empresa
    document.querySelector('[data-bs-target="#companyModal"]').addEventListener("click", () => {
        document.getElementById("companyModalLabel").textContent = "Agregar Nueva Empresa";
        companyNameInput.value = "";
        companyAddressInput.value = "";
        companyPhoneInput.value = "";
        companyEmailInput.value = ""; // Limpiar el campo de email
        companyIdInput.value = "";
    });

    // Guardar empresa (agregar o editar)
    companyForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const companyName = companyNameInput.value.trim();
        const companyAddress = companyAddressInput.value.trim();
        const companyPhone = companyPhoneInput.value.trim();
        const companyEmail = companyEmailInput.value.trim(); // Capturar el email
        const companyId = companyIdInput.value;
        const method = companyId ? "PUT" : "POST";
        const url = companyId ? `http://localhost:3000/api_v1/company/${companyId}` : "http://localhost:3000/api_v1/company";

        try {
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    CompanyName: companyName, 
                    CompanyAddress: companyAddress, 
                    CompanyPhone: companyPhone, 
                    CompanyEmail: companyEmail // Agregar el email
                })
            });
            if (!response.ok) throw new Error("Error al guardar la empresa");
            bootstrap.Modal.getInstance(companyModal).hide();
            loadCompanies();
        } catch (error) {
            alert("Error al guardar la empresa: " + error.message);
        }
    });

    // Ver detalles de una empresa
    async function handleShowCompany(e) {
        const companyId = e.target.closest("button").getAttribute("data-id");
        try {
            const response = await fetch(`http://localhost:3000/api_v1/company/${companyId}`);
            if (!response.ok) throw new Error("Error al obtener la empresa");
            const company = await response.json();
            alert(`Detalles de la empresa:\nID: ${company.Company_id}\nNombre: ${company.Company_name}\nDirección: ${company.Company_address}\nTeléfono: ${company.Company_phone}\nEmail: ${company.Company_email}`);
        } catch (error) {
            alert("Error al cargar la empresa: " + error.message);
        }
    }

    // Editar una empresa
    async function handleEditCompany(e) {
        const companyId = e.target.closest("button").getAttribute("data-id");
        try {
            const response = await fetch(`http://localhost:3000/api_v1/company/${companyId}`);
            if (!response.ok) throw new Error("Error al obtener la empresa");
            const company = await response.json();
            document.getElementById("companyModalLabel").textContent = "Editar Empresa";
            companyNameInput.value = company.Company_name;
            companyAddressInput.value = company.Company_address;
            companyPhoneInput.value = company.Company_phone;
            companyEmailInput.value = company.Company_email; // Rellenar el campo de email
            companyIdInput.value = company.Company_id;
        } catch (error) {
            alert("Error al cargar la empresa: " + error.message);
        }
    }

    // Eliminar una empresa
    async function handleDeleteCompany(e) {
        const companyId = e.target.closest("button").getAttribute("data-id");
        if (!confirm("¿Estás seguro de eliminar esta empresa?")) return;

        try {
            const response = await fetch(`http://localhost:3000/api_v1/company/${companyId}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Error al eliminar la empresa");
            loadCompanies();
        } catch (error) {
            alert("Error al eliminar la empresa: " + error.message);
        }
    }

    loadCompanies();
});