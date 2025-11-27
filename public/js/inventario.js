// Categorías de productos
// URL del backend Strapi
const STRAPI_URL = "http://localhost:1337";

const categories = [
  { id: "herramientas-manuales", name: "Herramientas Manuales", icon: "🔨" },
  { id: "herramientas-electricas", name: "Herramientas Eléctricas", icon: "🔌" },
  { id: "tornilleria", name: "Tornillería", icon: "🔩" },
  { id: "pintura", name: "Pintura", icon: "🎨" },
  { id: "plomeria", name: "Plomería", icon: "🚿" },
  { id: "electricidad", name: "Electricidad", icon: "💡" },
  { id: "jardineria", name: "Jardinería", icon: "🌱" },
  { id: "construccion", name: "Construcción", icon: "🧱" },
]

// Productos - ahora vacío, se cargarán desde Strapi
let products = [];

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("jwt")

  // Si no hay sesión, mandamos a login
  if (!token) {
    window.location.href = "login.html"
    return
  }

  populateCategorySelects()
  loadProductsFromStrapi() // Nueva función para cargar productos desde Strapi
  updateStats()

  document.getElementById("searchInput").addEventListener("input", renderProducts)
  document.getElementById("categoryFilter").addEventListener("change", renderProducts)

  // Cerrar modal al hacer clic fuera
  document.getElementById("modalOverlay").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeModal()
  })
})

// Función para cargar productos desde Strapi
async function loadProductsFromStrapi() {
  try {
    const response = await fetch(`${STRAPI_URL}/api/productos`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Error al cargar productos');
    }
    
    const data = await response.json();
    
    // Transformar los datos de Strapi al formato que espera nuestra aplicación
    products = data.data.map(item => ({
      id: item.id,
      documentId: item.documentId,
      name: item.name,
      sku: item.SKU || 'N/A',
      category: item.categoria || 'sin-categoria',
      price: item.precio || 0,
      stock: item.cantidad || 0,
      minStock: item.stockMin || 10,
      description: item.description || '',
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));
    
    renderProducts();
    updateStats();
    
  } catch (error) {
    console.error('Error:', error);
    alert('Error al cargar los productos');
  }
}

// Poblar selectores de categorías
function populateCategorySelects() {
  const filterSelect = document.getElementById("categoryFilter")
  const formSelect = document.getElementById("productCategory")

  // Limpiar selects primero
  filterSelect.innerHTML = '<option value="">Todas las categorías</option>'
  formSelect.innerHTML = ''

  categories.forEach((cat) => {
    filterSelect.innerHTML += `<option value="${cat.id}">${cat.icon} ${cat.name}</option>`
    formSelect.innerHTML += `<option value="${cat.id}">${cat.icon} ${cat.name}</option>`
  })
}

// Obtener productos filtrados
function getFilteredProducts() {
  const search = document.getElementById("searchInput").value.toLowerCase()
  const category = document.getElementById("categoryFilter").value

  return products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search) || 
                         p.sku.toLowerCase().includes(search) ||
                         (p.description && p.description.toLowerCase().includes(search))
    const matchesCategory = !category || p.category === category
    return matchesSearch && matchesCategory
  })
}

// Renderizar productos - AHORA INCLUYE LA TABLA
function renderProducts() {
  const grid = document.getElementById("productsGrid")
  const tableBody = document.getElementById("productsTableBody")
  const emptyState = document.getElementById("emptyState")
  const filtered = getFilteredProducts()

  if (filtered.length === 0) {
    grid.innerHTML = ""
    tableBody.innerHTML = ""
    emptyState.style.display = "block"
    return
  }

  emptyState.style.display = "none"
  
  // Renderizar tabla
  tableBody.innerHTML = filtered
    .map((product) => {
      const category = categories.find((c) => c.id === product.category) || { name: "Sin categoría" }
      const stockStatus =
        product.stock <= product.minStock * 0.5 ? "critical" : product.stock <= product.minStock ? "low" : "ok"
      const stockClass =
        stockStatus === "critical" ? "stock-critical" : stockStatus === "low" ? "stock-low" : "stock-ok"
      const stockText = stockStatus === "critical" ? "Crítico" : stockStatus === "low" ? "Bajo" : "Disponible"

      return `
      <tr>
        <td>${product.sku}</td>
        <td>${product.name}</td>
        <td>${category.name}</td>
        <td><span class="${stockClass}">${product.stock}</span></td>
        <td>$${product.price.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</td>
        <td>${product.minStock}</td>
        <td>${product.description || 'Sin descripción'}</td>
        <td class="actions">
          <button class="btn btn-secondary" onclick="editProduct(${product.id})">Editar</button>
          <button class="btn btn-danger" onclick="deleteProduct(${product.id})">Eliminar</button>
        </td>
      </tr>
    `
    })
    .join("")

  // Renderizar cards (opcional, puedes eliminar esta parte si solo quieres la tabla)
  grid.innerHTML = filtered
    .map((product) => {
      const category = categories.find((c) => c.id === product.category)
      const stockStatus =
        product.stock <= product.minStock * 0.5 ? "critical" : product.stock <= product.minStock ? "low" : "ok"
      const stockClass =
        stockStatus === "critical" ? "stock-critical" : stockStatus === "low" ? "stock-low" : "stock-ok"
      const stockText = stockStatus === "critical" ? "Crítico" : stockStatus === "low" ? "Bajo" : "Disponible"

      return `
      <div class="product-card">
        <div class="product-image">${category?.icon || "📦"}</div>
        <div class="product-content">
          <span class="product-category">${category?.name || "Sin categoría"}</span>
          <h3 class="product-name">${product.name}</h3>
          <p class="product-sku">SKU: ${product.sku}</p>
          <div class="product-details">
            <span class="product-price">$${product.price.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</span>
            <span class="product-stock ${stockClass}">${product.stock} uds - ${stockText}</span>
          </div>
          <div class="product-actions">
            <button class="btn btn-secondary" onclick="editProduct(${product.id})">Editar</button>
            <button class="btn btn-danger" onclick="deleteProduct(${product.id})">Eliminar</button>
          </div>
        </div>
      </div>
    `
    })
    .join("")
}

// Actualizar estadísticas
function updateStats() {
  document.getElementById("totalProducts").textContent = products.length
  document.getElementById("inStock").textContent = products.filter((p) => p.stock > p.minStock).length
  document.getElementById("lowStock").textContent = products.filter((p) => p.stock <= p.minStock).length

  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0)
  document.getElementById("totalValue").textContent =
    "$" + totalValue.toLocaleString("es-MX", { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

// Abrir modal
function openModal(product = null) {
  document.getElementById("modalOverlay").classList.add("active")
  document.getElementById("modalTitle").textContent = product ? "Editar Producto" : "Agregar Producto"

  if (product) {
    document.getElementById("productId").value = product.id
    document.getElementById("productName").value = product.name
    document.getElementById("productSku").value = product.sku
    document.getElementById("productCategory").value = product.category
    document.getElementById("productPrice").value = product.price
    document.getElementById("productStock").value = product.stock
    document.getElementById("productMinStock").value = product.minStock
    document.getElementById("productDescription").value = product.description || ''
  } else {
    document.getElementById("productForm").reset()
    document.getElementById("productId").value = ""
  }
}

// Cerrar modal
function closeModal() {
  document.getElementById("modalOverlay").classList.remove("active")
}


// Guardar producto - VERSIÓN CORREGIDA
async function saveProduct() {
  const form = document.getElementById("productForm")
  if (!form.checkValidity()) {
    form.reportValidity()
    return
  }

  const id = document.getElementById("productId").value
  const productData = {
    data: {
      name: document.getElementById("productName").value,
      stockMin: Number.parseInt(document.getElementById("productMinStock").value) || 10,
      description: document.getElementById("productDescription").value || '',
      // Campos que pueden ser null en tu Strapi
      SKU: document.getElementById("productSku").value || null,
      categoria: document.getElementById("productCategory").value || null,
      cantidad: Number.parseInt(document.getElementById("productStock").value) || null,
      precio: Number.parseFloat(document.getElementById("productPrice").value) || null,
    }
  }

  try {
    let response;
    
    if (id) {
      // Actualizar producto existente
      response = await fetch(`${STRAPI_URL}/api/productos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        body: JSON.stringify(productData)
      });
    } else {
      // Crear nuevo producto
      response = await fetch(`${STRAPI_URL}/api/productos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        body: JSON.stringify(productData)
      });
    }

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error del servidor:', errorData);
      throw new Error('Error al guardar producto');
    }

    closeModal()
    await loadProductsFromStrapi()
    
  } catch (error) {
    console.error('Error:', error);
    alert('Error al guardar el producto. Revisa la consola para más detalles.');
  }
}

// Editar producto
function editProduct(id) {
  const product = products.find((p) => p.id === id)
  if (product) openModal(product)
}

// Eliminar producto
async function deleteProduct(id) {
  if (!confirm("¿Estás seguro de eliminar este producto?")) {
    return;
  }

  try {
    const response = await fetch(`${STRAPI_URL}/api/productos/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      }
    });

    if (!response.ok) {
      throw new Error('Error al eliminar producto');
    }

    await loadProductsFromStrapi()
    
  } catch (error) {
    console.error('Error:', error);
    alert('Error al eliminar el producto');
  }
}