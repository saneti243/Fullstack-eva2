export const validarCorreo = (correo) => {
  if (!correo || typeof correo !== "string") return false;
  const regex = /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
  return regex.test(correo.trim());
};

export const validarPassword = (password) => {
  if (!password || typeof password !== "string") return false;
  const largo = password.trim().length;
  return largo >= 4 && largo <= 10;
};

export const validarProductoNuevo = ({ nombre, precio, categoria }) => {
  const errores = {};
  if (!nombre || nombre.trim().length < 3) {
    errores.nombre = "El nombre debe tener al menos 3 caracteres.";
  }
  if (precio === undefined || Number(precio) <= 0 || isNaN(Number(precio))) {
    errores.precio = "El precio debe ser un número mayor a 0.";
  }
  if (!categoria || categoria.trim() === "") {
    errores.categoria = "La categoría es obligatoria.";
  }
  return {
    esValido: Object.keys(errores).length === 0,
    errores
  };
};

export const calcularTotalCarrito = (carrito) => {
  if (!Array.isArray(carrito)) return 0;
  return carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
};

// ---------- Funciones migradas desde el Archivador (HTML/JS) ----------

// RUN sin puntos ni guion: 7 a 9 caracteres, solo dígitos y K.
export const validarRun = (run) => {
  if (!run || typeof run !== "string") return false;
  return /^[0-9K]{7,9}$/.test(run.trim().toUpperCase());
};

export const formatearRun = (valor = "") =>
  String(valor).replace(/[^0-9kK]/g, "").toUpperCase();

export const formatearNombre = (valor = "") => String(valor).replace(/[0-9]/g, "");

// 0000 0000 0000 0000
export const formatearTarjeta = (valor = "") => {
  const digitos = String(valor).replace(/\D/g, "").slice(0, 16);
  return digitos.match(/.{1,4}/g)?.join(" ") ?? "";
};

export const validarTarjeta = (tarjeta) => /^\d{4} \d{4} \d{4} \d{4}$/.test(tarjeta || "");

// MM/AA
export const formatearVencimiento = (valor = "") => {
  const digitos = String(valor).replace(/\D/g, "").slice(0, 4);
  return digitos.length > 2 ? `${digitos.slice(0, 2)}/${digitos.slice(2)}` : digitos;
};

// Devuelve "" si es válido, o el mensaje de error. `hoy` es inyectable para poder testear.
export const validarVencimiento = (vencimiento, hoy = new Date()) => {
  const partes = (vencimiento || "").split("/");
  if (partes.length !== 2 || partes[0].length !== 2 || partes[1].length !== 2) {
    return "Formato de fecha de vencimiento inválido. Use MM/AA.";
  }
  const mes = parseInt(partes[0], 10);
  const anio = parseInt(partes[1], 10);
  if (isNaN(mes) || isNaN(anio) || mes < 1 || mes > 12) {
    return "El mes de vencimiento debe estar entre 01 y 12.";
  }
  const mesActual = hoy.getMonth() + 1;
  const anioActual = hoy.getFullYear() % 100;
  if (anio < anioActual || (anio === anioActual && mes < mesActual)) {
    return "No se puede procesar el pago: La tarjeta está vencida.";
  }
  return "";
};

export const validarCvv = (cvv) => /^\d{3}$/.test(cvv || "");

// Rol según palabras clave en el correo (README del Archivador).
export const asignarRol = (correo = "") => {
  const c = correo.toLowerCase();
  if (c.includes("vendedor")) return "vendedor";
  if (c.includes("admin")) return "administrador";
  return "cliente";
};

export const validarRegistro = ({ nombre, run, correo, password, region, comuna }) => {
  const errores = {};
  if (!nombre || nombre.trim().length < 3) {
    errores.nombre = "El nombre debe tener al menos 3 caracteres.";
  }
  if (!validarRun(run)) {
    errores.run = "RUN inválido. Use entre 7 y 9 caracteres, sin puntos ni guiones (Ej: 19011022K).";
  }
  if (!validarCorreo(correo)) {
    errores.correo = "Ingrese un correo válido (@duoc.cl, @profesor.duoc.cl o @gmail.com).";
  }
  if (!validarPassword(password)) {
    errores.password = "La contraseña debe tener entre 4 y 10 caracteres.";
  }
  if (!region) errores.region = "Seleccione una región.";
  if (!comuna) errores.comuna = "Seleccione una comuna.";
  return { esValido: Object.keys(errores).length === 0, errores };
};

export const validarPago = ({ nombre, run, direccion, tarjeta, vencimiento, cvv }, hoy = new Date()) => {
  const errores = {};
  if (!nombre || nombre.trim().length < 3) errores.nombre = "Ingrese su nombre completo.";
  if (!validarRun(run)) errores.run = "El RUN debe tener entre 7 y 9 caracteres, sin puntos ni guiones.";
  if (!direccion || direccion.trim().length < 5) errores.direccion = "Ingrese una dirección de envío válida.";
  if (!validarTarjeta(tarjeta)) errores.tarjeta = "Ingrese los 16 dígitos de la tarjeta.";
  const errVenc = validarVencimiento(vencimiento, hoy);
  if (errVenc) errores.vencimiento = errVenc;
  if (!validarCvv(cvv)) errores.cvv = "El CVV debe tener 3 dígitos.";
  return { esValido: Object.keys(errores).length === 0, errores };
};
