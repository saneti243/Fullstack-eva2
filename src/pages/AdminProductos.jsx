import React, { useState } from "react";
import { validarProductoNuevo } from "../utils/validaciones";

export default function AdminProductos({
  productos = [],
  onAgregarProducto,
  onEliminarProducto
}) {
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("Tecnología");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState(10);
  const [imagen, setImagen] = useState("/images/audifonos.jpg");
  const [descripcion, setDescripcion] = useState("");
  const [errores, setErrores] = useState({});
  const [mensajeExito, setMensajeExito] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setMensajeExito("");

    const validacion = validarProductoNuevo({
      nombre,
      precio: Number(precio),
      categoria
    });

    if (!validacion.esValido) {
      setErrores(validacion.errores);
      return;
    }

    const nuevoProducto = {
      id: Date.now(),
      nombre: nombre.trim(),
      categoria,
      precio: Number(precio),
      stock: Number(stock) || 1,
      imagen: imagen.trim() || "/images/tienda67.jpg",
      descripcion: descripcion.trim() || "Producto disponible en Tienda67."
    };

    if (onAgregarProducto) {
      onAgregarProducto(nuevoProducto);
    }

    setErrores({});
    setMensajeExito("Producto agregado correctamente al catálogo.");
    setNombre("");
    setPrecio("");
    setDescripcion("");
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">Panel de Administración - Gestión de Productos</h2>

      <div className="row g-4">
        {}
        <div className="col-12 col-lg-5">
          <div className="card shadow-sm p-4">
            <h4 className="mb-3">Agregar Nuevo Producto</h4>

            {mensajeExito && (
              <div className="alert alert-success py-2" data-testid="admin-success">
                {mensajeExito}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label">Nombre del Producto</label>
                <input
                  type="text"
                  className="form-control"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Audífonos Gamer"
                />
                {errores.nombre && (
                  <small className="text-danger">{errores.nombre}</small>
                )}
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label">Precio ($ CLP)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    placeholder="19990"
                  />
                  {errores.precio && (
                    <small className="text-danger d-block">{errores.precio}</small>
                  )}
                </div>

                <div className="col-6">
                  <label className="form-label">Stock</label>
                  <input
                    type="number"
                    className="form-control"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Categoría</label>
                <select
                  className="form-select"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                >
                  <option value="Tecnología">Tecnología</option>
                  <option value="Calzado">Calzado</option>
                  <option value="Libros">Libros</option>
                  <option value="Coleccionables">Coleccionables</option>
                  <option value="Hogar">Hogar</option>
                </select>
                {errores.categoria && (
                  <small className="text-danger">{errores.categoria}</small>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Imagen disponible</label>
                <select
                  className="form-select"
                  value={imagen}
                  onChange={(e) => setImagen(e.target.value)}
                >
                  <option value="/images/audifonos.jpg">Audífonos (audifonos.jpg)</option>
                  <option value="/images/retro 1.jpg">Retro 1 (retro 1.jpg)</option>
                  <option value="/images/zapatillas.jpg">Zapatillas (zapatillas.jpg)</option>
                  <option value="/images/verity.jpg">Libro Verity (verity.jpg)</option>
                  <option value="/images/requiem.jpg">Requiem (requiem.jpg)</option>
                  <option value="/images/sabanas.jpg">Sábanas (sabanas.jpg)</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Descripción breve del producto..."
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Guardar Producto
              </button>
            </form>
          </div>
        </div>

        {/* Tabla de Inventario Actual (Columna Derecha en Desktop) */}
        <div className="col-12 col-lg-7">
          <div className="card shadow-sm p-4">
            <h4 className="mb-3">Inventario Actual ({productos.length})</h4>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <img
                          src={p.imagen}
                          alt={p.nombre}
                          width="45"
                          height="45"
                          className="rounded"
                          style={{ objectFit: "cover" }}
                        />
                      </td>
                      <td className="fw-semibold">{p.nombre}</td>
                      <td>
                        <span className="badge bg-secondary">{p.categoria}</span>
                      </td>
                      <td>${p.precio.toLocaleString("es-CL")}</td>
                      <td>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => onEliminarProducto && onEliminarProducto(p.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}