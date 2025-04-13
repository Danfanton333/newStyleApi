document.addEventListener("DOMContentLoaded", () => {
    const productTableBody = document.querySelector("#productTable tbody");
    const productModal = document.getElementById("productModal");
    const productForm = document.getElementById("productForm");
    const productNameInput = document.getElementById("productName");
    const productAmountInput = document.getElementById("productAmount");
    const productCategoryInput = document.getElementById("productCategory");
    const productDescriptionInput = document.getElementById("productDescription");
    const productImageInput = document.getElementById("productImage");
    const productBrandInput = document.getElementById("productBrand");
    const productColorInput = document.getElementById("productColor");
    const productSizeInput = document.getElementById("productSize");
    const productIdInput = document.getElementById("productId");

    async function loadProducts() {
        try {
            const response = await fetch("http://localhost:3000/api_v1/products");
            if (!response.ok) throw new Error("Error al obtener productos");
            const products = await response.json();
            productTableBody.innerHTML = "";
            products.forEach(product => {
                const row = `
                    <tr>
                        <td>${product.Product_id}</td>
                        <td>${product.Product_name}</td>
                        <td>${product.Product_amount}</td>
                        <td>${product.Product_category}</td>
                        <td>${product.Brand_id}</td>
                        <td>${product.Color_id}</td>
                        <td>${product.Size_id}</td>
                        <td>
                            <button class="action-btn btn-show" data-id="${product.Product_id}"><i class="fas fa-eye"></i></button>
                            <button class="action-btn btn-edit" data-id="${product.Product_id}"><i class="fas fa-edit"></i></button>
                            <button class="action-btn btn-delete" data-id="${product.Product_id}"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `;
                productTableBody.insertAdjacentHTML("beforeend", row);
            });
        } catch (error) {
            console.error("Error al cargar productos:", error);
            alert("Error al cargar productos: " + error.message);
        }
    }

    document.querySelector('[data-bs-target="#productModal"]').addEventListener("click", () => {
        document.getElementById("productModalLabel").textContent = "Agregar Nuevo Producto";
        productNameInput.value = "";
        productAmountInput.value = "";
        productCategoryInput.value = "";
        productDescriptionInput.value = "";
        productImageInput.value = "";
        productBrandInput.value = "";
        productColorInput.value = "";
        productSizeInput.value = "";
        productIdInput.value = "";
    });

    productForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const productName = productNameInput.value.trim();
        const productAmount = parseInt(productAmountInput.value);
        const productCategory = productCategoryInput.value.trim();
        const productDescription = productDescriptionInput.value.trim();
        const productImage = productImageInput.value.trim();
        const productBrand = parseInt(productBrandInput.value);
        const productColor = parseInt(productColorInput.value);
        const productSize = parseInt(productSizeInput.value);
        const productId = productIdInput.value;

        // Validar campos
        if (!productName || !productCategory || !productDescription) {
            alert("Por favor, completa todos los campos de texto requeridos.");
            return;
        }
        if (isNaN(productAmount) || productAmount <= 0) {
            alert("La cantidad debe ser un número positivo.");
            return;
        }
        if (isNaN(productBrand) || productBrand <= 0) {
            alert("La marca debe ser un ID válido (número positivo).");
            return;
        }
        if (isNaN(productColor) || productColor <= 0) {
            alert("El color debe ser un ID válido (número positivo).");
            return;
        }
        if (isNaN(productSize) || productSize <= 0) {
            alert("El tamaño debe ser un ID válido (número positivo).");
            return;
        }

        const method = productId ? "PUT" : "POST";
        const url = productId ? `http://localhost:3000/api_v1/products/${productId}` : "http://localhost:3000/api_v1/products";

        try {
            console.log("Enviando datos:", {
                Name: productName,
                Amount: productAmount,
                category: productCategory,
                description: productDescription,
                image: productImage,
                Brand: productBrand,
                ColorId: productColor,
                sizeId: productSize
            });
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    Name: productName,
                    Amount: productAmount,
                    category: productCategory,
                    description: productDescription,
                    image: productImage || null, // Enviar null si está vacío
                    Brand: productBrand,
                    ColorId: productColor,
                    sizeId: productSize
                })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || errorData.error || "Error al guardar el producto");
            }
            const modalInstance = bootstrap.Modal.getInstance(productModal);
            if (modalInstance) {
                modalInstance.hide();
            }
            loadProducts();
        } catch (error) {
            console.error("Error:", error);
            alert("Error al guardar el producto: " + error.message);
        }
    });

    async function handleShowProduct(e) {
        const productId = e.target.closest("button").getAttribute("data-id");
        try {
            const response = await fetch(`http://localhost:3000/api_v1/products/${productId}`);
            if (!response.ok) throw new Error("Error al obtener el producto");
            const product = await response.json();
            alert(`
                Detalles del producto:\n
                ID: ${product.Product_id}\n
                Nombre: ${product.Product_name}\n
                Cantidad: ${product.Product_amount}\n
                Categoría: ${product.Product_category}\n
                Descripción: ${product.Product_description}\n
                Imagen: ${product.Product_image || "N/A"}\n
                Marca: ${product.Brand_id}\n
                Color: ${product.Color_id}\n
                Tamaño: ${product.Size_id}
            `);
        } catch (error) {
            console.error("Error al cargar el producto:", error);
            alert("Error al cargar el producto: " + error.message);
        }
    }

    async function handleEditProduct(e) {
        const button = e.target.closest("button.btn-edit");
        if (!button) return;
        const productId = button.getAttribute("data-id");

        try {
            console.log("Cargando producto con ID:", productId);
            const response = await fetch(`http://localhost:3000/api_v1/products/${productId}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || errorData.error || "Error al obtener el producto");
            }
            const product = await response.json();
            console.log("Producto recibido:", product);

            document.getElementById("productModalLabel").textContent = "Editar Producto";
            productNameInput.value = product.Product_name || "";
            productAmountInput.value = product.Product_amount || "";
            productCategoryInput.value = product.Product_category || "";
            productDescriptionInput.value = product.Product_description || "";
            productImageInput.value = product.Product_image || "";
            productBrandInput.value = product.Brand_id || "";
            productColorInput.value = product.Color_id || "";
            productSizeInput.value = product.Size_id || "";
            productIdInput.value = product.Product_id || "";

            const modalInstance = new bootstrap.Modal(document.getElementById("productModal"));
            modalInstance.show();
        } catch (error) {
            console.error("Error al cargar el producto:", error);
            alert("Error al cargar el producto: " + error.message);
        }
    }

    async function handleDeleteProduct(e) {
        const productId = e.target.closest("button").getAttribute("data-id");
        if (!confirm("¿Estás seguro de eliminar este producto?")) return;

        try {
            const response = await fetch(`http://localhost:3000/api_v1/products/${productId}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Error al eliminar el producto");
            loadProducts();
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            alert("Error al eliminar el producto: " + error.message);
        }
    }

    productTableBody.addEventListener("click", async (e) => {
        const target = e.target.closest("button");
        if (!target) return;

        const productId = target.getAttribute("data-id");
        if (!productId) {
            console.error("No se encontró el ID del producto.");
            return;
        }

        try {
            if (target.classList.contains("btn-show")) {
                await handleShowProduct({ target });
            } else if (target.classList.contains("btn-edit")) {
                await handleEditProduct({ target });
            } else if (target.classList.contains("btn-delete")) {
                await handleDeleteProduct({ target });
            }
        } catch (error) {
            console.error("Error en la acción:", error);
            alert("Error al procesar la acción: " + error.message);
        }
    });

    loadProducts();
});