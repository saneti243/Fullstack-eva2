export const validarCorreo = (correo) => {
  if (!correo || typeof correo !== "string") return false;
  const regex = /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
  return regex.test(correo.trim());
};

export const validarPassword = (password) => {
  if (!password || typeof password !== "string") return false;
  return password.trim().length >= 6;
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