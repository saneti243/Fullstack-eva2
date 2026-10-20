import React from "react";
import { Link } from "react-router-dom";

export default function Footer({ nombreTienda = "Tienda67", anio = 2026 }) {
  return (
    <footer className="bg-dark text-light mt-auto pt-4 pb-3 border-top border-secondary">
      <div className="container">
        <div className="row gy-3">
          <div className="col-12 col-md-4">
            <div className="d-flex align-items-center gap-2 mb-2">
              <img
                src="/images/tienda67.jpg"
                alt="Logo Tienda67"
                width="32"
                height="32"
                className="rounded-circle"
              />
              <h5 className="mb-0 fw-bold">{nombreTienda}</h5>
            </div>
            <p className="text-secondary small mb-0">
              Tu tienda online de tecnología, calzado urbano, libros y artículos de colección.
            </p>
          </div>

          <div className="col-12 col-sm-6 col-md-4">
            <h6 className="fw-bold text-uppercase mb-2">Navegación</h6>
            <ul className="list-unstyled small mb-0">
              <li className="mb-1">
                <Link to="/" className="text-secondary text-decoration-none">Inicio</Link>
              </li>
              <li className="mb-1">
                <Link to="/productos" className="text-secondary text-decoration-none">Catálogo de Productos</Link>
              </li>
              <li className="mb-1">
                <Link to="/nosotros" className="text-secondary text-decoration-none">Sobre Nosotros</Link>
              </li>
              <li className="mb-1">
                <Link to="/registro" className="text-secondary text-decoration-none">Registro de Usuario</Link>
              </li>
            </ul>
          </div>

          <div className="col-12 col-sm-6 col-md-4">
            <h6 className="fw-bold text-uppercase mb-2">Contacto y Gestión</h6>
            <p className="text-secondary small mb-1">📍 Santiago, Chile</p>
            <p className="text-secondary small mb-2">✉️ contacto@tienda67.cl</p>
            <Link to="/admin" className="btn btn-outline-warning btn-sm">
              Panel Administrador
            </Link>
          </div>
        </div>

        <hr className="border-secondary my-3" />

        <div className="text-center text-secondary small">
          © {anio} {nombreTienda} - Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}