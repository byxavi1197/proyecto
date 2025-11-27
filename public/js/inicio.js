
const STRAPI_URL = "http://localhost:1337";
// Datos de ejemplo para las ventas
const ventasRecientes = [
  { id: "V001", producto: "Taladro Percutor", cantidad: 1, total: 1899, hora: "09:15" },
  { id: "V002", producto: 'Tornillos 2"', cantidad: 100, total: 250, hora: "09:45" },
  { id: "V003", producto: "Pintura Blanca 4L", cantidad: 3, total: 1047, hora: "10:20" },
  { id: "V004", producto: "Martillo de Uña", cantidad: 2, total: 398, hora: "11:00" },
  { id: "V005", producto: "Cinta Métrica 5m", cantidad: 5, total: 445, hora: "11:30" },
]

// Datos de productos con stock bajo
const productosStockBajo = [
  { producto: "Brocas para Concreto", categoria: "Herramientas Eléctricas", stock: 3, estado: "critico" },
  { producto: 'Llave Inglesa 12"', categoria: "Herramientas Manuales", stock: 5, estado: "bajo" },
  { producto: "Silicón Transparente", categoria: "Construcción", stock: 4, estado: "bajo" },
  { producto: "Interruptor Doble", categoria: "Electricidad", stock: 2, estado: "critico" },
  { producto: 'Manguera 1/2" 15m', categoria: "Jardinería", stock: 6, estado: "bajo" },
]

// Datos para el gráfico de ventas semanales
const ventasSemanales = {
  labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
  data: [12500, 15800, 14200, 18900, 21500, 25800, 8500],
}

// Datos para el gráfico de categorías
const ventasPorCategoria = {
  labels: ["Herramientas Manuales", "Herramientas Eléctricas", "Tornillería", "Pintura", "Plomería", "Electricidad"],
  data: [25, 30, 15, 12, 10, 8],
}


/* CODIGO ANTERIOR
// Variable para almacenar referencia al gráfico de ventas
let salesChartInstance = null

// Inicializar dashboard
document.addEventListener("DOMContentLoaded", () => {
  actualizarFecha()
  actualizarEstadisticas()
  renderizarTablaVentas()
  renderizarTablaStockBajo()
  inicializarGraficos()
  inicializarEventos()
})
*/

/* *************************CODIGO VIEJO 2.O ************************ */

/* *************************
// Variable para almacenar referencia al gráfico de ventas
let salesChartInstance = null

// Inicializar dashboard
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("jwt")

  // Si no hay sesión, mandamos a login
  if (!token) {
    window.location.href = "login.html"
    return
  }

  // Aquí podrías usar el token para traer datos reales de Strapi si quieres

  actualizarFecha()
  actualizarEstadisticas()
  renderizarTablaVentas()
  renderizarTablaStockBajo()
  inicializarGraficos()
  inicializarEventos()
})
CODIGO VIEJO 2.0  ************************ */

/* *************************CODIGO viejo 3.0 
// Variable para almacenar referencia al gráfico de ventas
let salesChartInstance = null

// Inicializar dashboard
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("jwt")

  // Si no hay sesión, mandamos a login
  if (!token) {
    window.location.href = "login.html"
    return
  }

  // Obtener info del usuario guardada en localStorage (del login)
  const userRaw = localStorage.getItem("user")
  let user = null

  try {
    user = userRaw ? JSON.parse(userRaw) : null
  } catch (e) {
    console.error("Error parseando user de localStorage:", e)
  }

  // Tomar nombre y rol (si no hay rol, ponemos por defecto)
  const userName = user?.username || user?.email || "Usuario"
  const userRole = user?.role?.name || "Administrador"

  // Rellenar texto en el header y dropdown
  const userNameSpan = document.getElementById("userName")
  const userRoleSpan = document.getElementById("userRole")
  const dropdownUserNameSpan = document.getElementById("dropdownUserName")
  const dropdownUserRoleSpan = document.getElementById("dropdownUserRole")

  if (userNameSpan) userNameSpan.textContent = userName
  if (userRoleSpan) userRoleSpan.textContent = userRole
  if (dropdownUserNameSpan) dropdownUserNameSpan.textContent = userName
  if (dropdownUserRoleSpan) dropdownUserRoleSpan.textContent = userRole

  // Lógica del desplegable
  const userMenuToggle = document.getElementById("userMenuToggle")
  const userMenuDropdown = document.getElementById("userMenuDropdown")
  const logoutButton = document.getElementById("logoutButton")

  if (userMenuToggle && userMenuDropdown) {
    userMenuToggle.addEventListener("click", (e) => {
      e.stopPropagation()
      userMenuDropdown.classList.toggle("open")
    })

    // Cerrar dropdown al hacer click fuera
    document.addEventListener("click", () => {
      userMenuDropdown.classList.remove("open")
    })

    // Evitar que un click dentro cierre inmediatamente
    userMenuDropdown.addEventListener("click", (e) => {
      e.stopPropagation()
    })
  }

  // Cerrar sesión
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      // Limpiar almacenamiento
      localStorage.removeItem("jwt")
      localStorage.removeItem("user")
      localStorage.removeItem("remember_user")

      // Redirigir a login
      window.location.href = "login.html"
    })
  }

  // Inicializar el resto del dashboard
  actualizarFecha()
  actualizarEstadisticas()
  renderizarTablaVentas()
  renderizarTablaStockBajo()
  inicializarGraficos()
  inicializarEventos()
})
************************ */



/* *************************CODIGO VIEJO 4.O ************************ 

// Variable para almacenar referencia al gráfico de ventas
let salesChartInstance = null

// Inicializar dashboard
document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("jwt")

  // Si no hay sesión, mandamos a login
  if (!token) {
    window.location.href = "login.html"
    return
  }

  // ============================
  // 1. PEDIR DATOS DEL USUARIO A STRAPI
  // ============================
  let user = null

  try {
    const res = await fetch(`${STRAPI_URL}/api/users/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      console.error("Error obteniendo /users/me:", res.status)
      // Si el token ya no sirve, limpiamos y mandamos a login
      localStorage.removeItem("jwt")
      localStorage.removeItem("user")
      window.location.href = "login.html"
      return
    }

    user = await res.json()
    // Opcional: guardar el usuario completo actualizado en localStorage
    localStorage.setItem("user", JSON.stringify(user))
  } catch (err) {
    console.error("Error llamando a /users/me:", err)
    window.location.href = "login.html"
    return
  }

  // ============================
  // 2. ARMAR NOMBRE, ROL E INICIAL
  // ============================

  // Nombre: primero username, luego email, luego "Usuario"
  const userName = user?.username || user?.email || "Usuario"

  // Rol: usamos el campo "role" que ves en Strapi (texto: "administrador")
  const userRole = user?.role || "Sin rol"

  // Inicial para el avatar: primera letra del nombre
  const avatarInitial = userName.charAt(0).toUpperCase()

  // ============================
  // 3. PINTAR EN EL MENÚ DE USUARIO
  // ============================

  const userNameSpan = document.getElementById("userName")
  const userRoleSpan = document.getElementById("userRole")
  const dropdownUserNameSpan = document.getElementById("dropdownUserName")
  const dropdownUserRoleSpan = document.getElementById("dropdownUserRole")
  const userAvatarSpan = document.getElementById("userAvatar")

  if (userNameSpan) userNameSpan.textContent = userName
  if (userRoleSpan) userRoleSpan.textContent = userRole
  if (dropdownUserNameSpan) dropdownUserNameSpan.textContent = userName
  if (dropdownUserRoleSpan) dropdownUserRoleSpan.textContent = userRole
  if (userAvatarSpan) userAvatarSpan.textContent = avatarInitial

  // ============================
  // 4. LÓGICA DEL DESPLEGABLE
  // ============================

  const userMenuToggle = document.getElementById("userMenuToggle")
  const userMenuDropdown = document.getElementById("userMenuDropdown")
  const logoutButton = document.getElementById("logoutButton")

  if (userMenuToggle && userMenuDropdown) {
    userMenuToggle.addEventListener("click", (e) => {
      e.stopPropagation()
      userMenuDropdown.classList.toggle("open")
    })

    // Cerrar dropdown al hacer click fuera
    document.addEventListener("click", () => {
      userMenuDropdown.classList.remove("open")
    })

    // Evitar que un click dentro cierre inmediatamente
    userMenuDropdown.addEventListener("click", (e) => {
      e.stopPropagation()
    })
  }

  // Cerrar sesión
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("jwt")
      localStorage.removeItem("user")
      localStorage.removeItem("remember_user")
      window.location.href = "login.html"
    })
  }

  // ============================
  // 5. INICIALIZAR EL RESTO DEL DASHBOARD
  // ============================

  actualizarFecha()
  actualizarEstadisticas()
  renderizarTablaVentas()
  renderizarTablaStockBajo()
  inicializarGraficos()
  inicializarEventos()
})

*/
/* *************************CODIGO nuevo 5.O ************************ */

// Variable para almacenar referencia al gráfico de ventas
let salesChartInstance = null;

// Inicializar dashboard
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("jwt");

  // Si no hay sesión, mandamos a login
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  // Leer usuario desde localStorage (el que guardamos después del login)
  const userRaw = localStorage.getItem("user");
  let user = null;

  try {
    user = userRaw ? JSON.parse(userRaw) : null;
  } catch (e) {
    console.error("Error parseando user de localStorage:", e);
  }

  // Nombre del usuario
  const userName = user?.username || user?.email || "Usuario";

  // 👉 Rol dinámico desde Strapi
  const userRole = user?.role || "Sin rol";

  // Inicial del avatar
  const avatarInitial = userName.charAt(0).toUpperCase();

  // Poner datos en el header y dropdown
  const userNameSpan = document.getElementById("userName");
  const userRoleSpan = document.getElementById("userRole");
  const dropdownUserNameSpan = document.getElementById("dropdownUserName");
  const dropdownUserRoleSpan = document.getElementById("dropdownUserRole");
  const userAvatarSpan = document.getElementById("userAvatar");

  if (userNameSpan) userNameSpan.textContent = userName;
  if (userRoleSpan) userRoleSpan.textContent = userRole;
  if (dropdownUserNameSpan) dropdownUserNameSpan.textContent = userName;
  if (dropdownUserRoleSpan) dropdownUserRoleSpan.textContent = userRole;
  if (userAvatarSpan) userAvatarSpan.textContent = avatarInitial;

  // Lógica del desplegable
  const userMenuToggle = document.getElementById("userMenuToggle");
  const userMenuDropdown = document.getElementById("userMenuDropdown");
  const logoutButton = document.getElementById("logoutButton");

  if (userMenuToggle && userMenuDropdown) {
    userMenuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      userMenuDropdown.classList.toggle("open");
    });

    document.addEventListener("click", () => {
      userMenuDropdown.classList.remove("open");
    });

    userMenuDropdown.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  // Cerrar sesión
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("jwt");
      localStorage.removeItem("user");
      localStorage.removeItem("remember_user");
      window.location.href = "login.html";
    });
  }

  // Inicializar el resto del dashboard
  actualizarFecha();
  actualizarEstadisticas();
  renderizarTablaVentas();
  renderizarTablaStockBajo();
  inicializarGraficos();
  inicializarEventos();
});
















// Actualizar fecha actual
function actualizarFecha() {
  const opciones = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
  const fecha = new Date().toLocaleDateString("es-ES", opciones)
  document.getElementById("currentDate").textContent = fecha.charAt(0).toUpperCase() + fecha.slice(1)
}

// Actualizar estadísticas
function actualizarEstadisticas() {
  const ventasDia = ventasRecientes.reduce((sum, v) => sum + v.total, 0)
  const productosVendidos = ventasRecientes.reduce((sum, v) => sum + v.cantidad, 0)
  const clientesAtendidos = ventasRecientes.length
  const stockBajo = productosStockBajo.length

  document.getElementById("ventasDia").textContent = "$" + ventasDia.toLocaleString("es-MX")
  document.getElementById("productosVendidos").textContent = productosVendidos
  document.getElementById("clientesAtendidos").textContent = clientesAtendidos
  document.getElementById("stockBajo").textContent = stockBajo
}

// Renderizar tabla de ventas recientes
function renderizarTablaVentas() {
  const tbody = document.getElementById("salesTableBody")
  tbody.innerHTML = ventasRecientes
    .map(
      (venta) => `
        <tr>
            <td>${venta.id}</td>
            <td>${venta.producto}</td>
            <td>${venta.cantidad}</td>
            <td>$${venta.total.toLocaleString("es-MX")}</td>
            <td>${venta.hora}</td>
        </tr>
    `,
    )
    .join("")
}

// Renderizar tabla de stock bajo
function renderizarTablaStockBajo() {
  const tbody = document.getElementById("lowStockTableBody")
  tbody.innerHTML = productosStockBajo
    .map(
      (producto) => `
        <tr>
            <td>${producto.producto}</td>
            <td>${producto.categoria}</td>
            <td>${producto.stock}</td>
            <td><span class="status-badge ${producto.estado}">${producto.estado === "critico" ? "Crítico" : "Bajo"}</span></td>
        </tr>
    `,
    )
    .join("")
}

// Inicializar gráficos
function inicializarGraficos() {
  // Gráfico de ventas semanales
  const salesCtx = document.getElementById("salesChart").getContext("2d")
  salesChartInstance = new Chart(salesCtx, {
    type: "bar",
    data: {
      labels: ventasSemanales.labels,
      datasets: [
        {
          label: "Ventas ($)",
          data: ventasSemanales.data,
          backgroundColor: "rgba(234, 88, 12, 0.8)",
          borderColor: "rgba(234, 88, 12, 1)",
          borderWidth: 1,
          borderRadius: 8,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => "$" + value.toLocaleString("es-MX"),
          },
          grid: {
            color: "rgba(0, 0, 0, 0.05)",
          },
        },
        x: {
          grid: {
            display: false,
          },
        },
      },
    },
  })

  // Gráfico de categorías (dona)
  const categoryCtx = document.getElementById("categoryChart").getContext("2d")
  new Chart(categoryCtx, {
    type: "doughnut",
    data: {
      labels: ventasPorCategoria.labels,
      datasets: [
        {
          data: ventasPorCategoria.data,
          backgroundColor: [
            "rgba(234, 88, 12, 0.9)",
            "rgba(251, 146, 60, 0.9)",
            "rgba(194, 65, 12, 0.9)",
            "rgba(249, 115, 22, 0.9)",
            "rgba(253, 186, 116, 0.9)",
            "rgba(154, 52, 18, 0.9)",
          ],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            padding: 15,
            usePointStyle: true,
            font: {
              size: 11,
            },
          },
        },
      },
      cutout: "65%",
    },
  })
}

// Inicializar eventos
function inicializarEventos() {
  // Cambio de período en gráfico de ventas
  document.getElementById("chartPeriod").addEventListener("change", (e) => {
    const periodo = e.target.value
    let nuevosLabels, nuevosDatos

    switch (periodo) {
      case "mes":
        nuevosLabels = ["Sem 1", "Sem 2", "Sem 3", "Sem 4"]
        nuevosDatos = [85000, 92000, 78000, 105000]
        break
      case "año":
        nuevosLabels = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
        nuevosDatos = [320000, 280000, 350000, 310000, 390000, 420000, 380000, 400000, 450000, 480000, 520000, 600000]
        break
      default:
        nuevosLabels = ventasSemanales.labels
        nuevosDatos = ventasSemanales.data
    }

    salesChartInstance.data.labels = nuevosLabels
    salesChartInstance.data.datasets[0].data = nuevosDatos
    salesChartInstance.update()
  })
}
