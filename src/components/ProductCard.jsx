import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ producto, onAgregar }) {
  return (
    <div className="col-12 col-sm-6 col-md-4 mb-4">
      <div className="card h-100 shadow-sm">
        <img
          src={producto.imagen}
          className="card-img-top"
          alt={producto.nombre}
          style={{ height: "220px", objectFit: "cover" }}
        />
        <div className="card-body d-flex flex-column">
          <span className="badge bg-secondary align-self-start mb-2">
            {producto.categoria}
          </span>
          <h5 className="card-title" data-testid="product-title">
            {producto.nombre}
          </h5>
          <p className="card-text text-muted small flex-grow-1">
            {producto.descripcion}
          </p>
          <p className="fw-bold fs-5 text-primary mb-3" data-testid="product-price">
            ${producto.precio.toLocaleString("es-CL")}
          </p>
          <Link
            to={`/productos/${producto.id}`}
            className="btn btn-outline-secondary w-100 mb-2"
            data-testid={`btn-detalle-${producto.id}`}
          >
            Ver detalle
          </Link>
          <button
            className="btn btn-primary w-100 mt-auto"
            data-testid={`btn-add-${producto.id}`}
            onClick={() => onAgregar(producto)}
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}