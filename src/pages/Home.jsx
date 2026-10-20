import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";

export default function Home({ productos = [], onAgregarAlCarrito }) {
  const destacados = productos.slice(0, 3);

  return (
    <div className="container py-4">
      {}
      <div className="hero-tienda67 p-4 p-md-5 mb-5 shadow">
        <div className="row align-items-center gy-4">
          <div className="col-12 col-md-7">
            <span className="badge bg-warning text-dark mb-2">Nueva Temporada</span>
            <h1 className="display-5 fw-bold mb-3">Bienvenido a Tienda67</h1>
            <p className="lead text-light opacity-75 mb-4">
              Encuentra lo mejor en audífonos, zapatillas urbanas, libros bestseller y artículos de colección con envío a todo Chile.
            </p>
            <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-md-start">
              <Link to="/productos" className="btn btn-primary btn-lg px-4">
                Ver Catálogo Completo
              </Link>
              <Link to="/registro" className="btn btn-outline-light btn-lg px-4">
                Crear Cuenta
              </Link>
            </div>
          </div>

          <div className="col-12 col-md-5 text-center">
            <img
              src="/images/tienda67.jpg"
              alt="Banner Tienda67"
              className="img-fluid rounded-4 shadow-lg"
              style={{ maxHeight: "260px", objectFit: "cover" }}
            />
          </div>
        </div>
      </div>

      {}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Productos Destacados</h2>
        <Link to="/productos" className="btn btn-outline-dark btn-sm">
          Ver todos →
        </Link>
      </div>

      <div className="row">
        {destacados.map((producto) => (
          <ProductCard
            key={producto.id}
            producto={producto}
            onAgregar={onAgregarAlCarrito}
          />
        ))}
      </div>
    </div>
  );
}