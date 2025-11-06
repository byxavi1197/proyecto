# Sistema Web para la Gestión y Control de Inventarios – Ferretería Martínez

**Asignatura:** Diseño de Sistemas de Internet  
**Grupo:** 5T2-SIS-S  
**Universidad:** Universidad Nacional de Ingeniería (UNI)  
**Lugar y fecha:** Managua, Nicaragua — Noviembre 2025

---

## Descripción del proyecto
La Ferretería Martínez (ubicada en el km 16.5 carretera a Xiloá, Managua) requiere fortalecer su control de inventarios. El sistema web propuesto busca reemplazar procedimientos manuales por una solución con actualización en tiempo real, reducción de errores y mejor atención al cliente.

---

## Objetivo general
Desarrollar un sistema web para gestionar y controlar el inventario, permitiendo **registrar, actualizar y monitorear en tiempo real** las existencias de productos.

### Objetivos específicos
1. Implementar autenticación con roles diferenciados (**Administrador** y **Empleado**).  
2. Diseñar un catálogo de productos con registro, edición y eliminación.  
3. Automatizar el control de **entradas** y **salidas** con alertas cuando el stock esté por debajo del mínimo.

---

## Requerimientos del sistema (resumen)

### Funcionales (RF)
- Inicio y cierre de sesión; gestión de **roles** (Administrador/Empleado).  
- **CRUD de productos**: código, nombre, categoría, precio, cantidad.  
- **Entradas y salidas** (venta, consumo interno, merma) con actualización automática del stock.  
- **Búsqueda y filtrado** por nombre, código o categoría.  
- **Alertas** de stock bajo y **reportes** de inventario.

### Reglas de negocio (ejemplos)
- No permitir salidas que dejen stock negativo.  
- Campos obligatorios según el motivo (venta, consumo interno, merma).  
- Auditoría: registrar usuario, fecha y hora en cada movimiento.

### No funcionales (RNF)
- Encriptación de contraseñas y control de accesos por rol.  
- Interfaz **intuitiva y responsive**.  
- Disponibilidad 24/7, respuesta < 3 s y soporte a usuarios concurrentes.  
- Arquitectura **modular y escalable** con posibilidad de integración futura.

### Actores
- **Administrador** (acceso completo).  
- **Empleado** (operaciones básicas sobre inventario y consultas).

---

## Arquitectura
Se adopta una **arquitectura en capas (N-Tier) con patrón MVC** dentro de un enfoque **Cliente-Servidor**, por su claridad, mantenibilidad, seguridad y escalabilidad para cumplir RF y RNF.

---

## Equipo
- **Javier Enrique Zamora Araica** — Carnet 2021-0341I  
- **Jason José Martínez Castro** — Carnet 2021-0074I  
- **Darling Aracely Gutiérrez Paz** — Carnet 2021-0865I  
**Docente:** Ing. Cristopher Alexander Chávez Larios

---






