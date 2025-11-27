// ===============================
// CONFIGURACIÓN STRAPI
// ===============================
const STRAPI_URL = "http://localhost:1337"; // cámbiala si usas Render

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  if (!loginForm) return;

  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const remember = document.getElementById("remember").checked;
    const submitBtn = loginForm.querySelector("button[type='submit']");

    const username = usernameInput.value;
    const password = passwordInput.value;

    // Validación básica
    if (username.trim() === "" || password.trim() === "") {
      alert("Por favor, completa todos los campos");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Ingresando...";

    try {
      // Llamada al endpoint de autenticación de Strapi
      const response = await fetch(`${STRAPI_URL}/api/auth/local`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: username, // usuario o correo
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const message =
          data?.error?.message || "Usuario o contraseña incorrectos.";
        alert(message);
        submitBtn.disabled = false;
        submitBtn.textContent = "Iniciar Sesión";
        return;
      }

      // ✅ Login exitoso: guardar token y usuario básico
      localStorage.setItem("jwt", data.jwt);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (remember) {
        localStorage.setItem("remember_user", username);
      } else {
        localStorage.removeItem("remember_user");
      }

      alert("Login exitoso! Bienvenido " + (data.user.username || username));

      // Redirigir al dashboard / inicio
      window.location.href = "inicio.html";
    } catch (error) {
      console.error("Error en login:", error);
      alert(
        "No se pudo conectar con el servidor. Verifica que Strapi esté encendido."
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Iniciar Sesión";
    }
  });

  // Animación inputs
  const inputs = document.querySelectorAll(".form-group input");

  inputs.forEach((input) => {
    input.addEventListener("focus", function () {
      this.parentElement.parentElement.classList.add("focused");
    });

    input.addEventListener("blur", function () {
      if (this.value === "") {
        this.parentElement.parentElement.classList.remove("focused");
      }
    });
  });

  // Enlace "¿Olvidaste tu contraseña?"
  const forgotPassword = document.querySelector(".forgot-password");

  if (forgotPassword) {
    forgotPassword.addEventListener("click", function (e) {
      e.preventDefault();
      alert("Funcionalidad de recuperación de contraseña en desarrollo");
    });
  }
});
