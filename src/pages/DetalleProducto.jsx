import React from "react";
import { Link, useParams } from "react-router-dom";

export default function DetalleProducto({ productos = [], onAgregarAlCarrito }) {
  const { id } = useParams();
  const producto = productos.find((p) => String(p.id) === String(id));

  if (!producto) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning" data-testid="producto-no-encontrado">Producto no encontrado.</div>
        <Link to="/productos" className="btn btn-secondary">Volver al catálogo</Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="card shadow-sm p-4">
        <div className="row g-4">
          <div className="col-12 col-md-6">
            <img src={producto.imagen} alt={producto.nombre} className="img-fluid rounded w-100"
              style={{ maxHeight: 400, objectFit: "cover" }} />
          </div>
          <div className="col-12 col-md-6 d-flex flex-column justify-content-center">
            <h1 className="h3" data-testid="detalle-nombre">{producto.nombre}</h1>
            <p className="text-muted">Categoría: {producto.categoria}</p>
            <p className="fs-3 fw-bold" data-testid="detalle-precio">${producto.precio.toLocaleString("es-CL")}</p>
            <p>{producto.descripcion}</p>
            {producto.stock !== undefined && <p className="small text-muted">Stock disponible: {producto.stock}</p>}
            <button className="btn btn-primary mb-2" data-testid="detalle-agregar"
              onClick={() => onAgregarAlCarrito && onAgregarAlCarrito(producto)}>
              Añadir al carrito
            </button>
            <Link to="/productos" className="btn btn-outline-secondary">Volver al catálogo</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
