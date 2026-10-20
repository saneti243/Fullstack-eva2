import React from "react";
import { Link } from "react-router-dom";

export default function Navbar({ totalItems, sesion = null, onCerrarSesion }) {
  const puedeAdministrar =
    sesion && (sesion.rol === "administrador" || sesion.rol === "vendedor");

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/">
          <img
            src="/images/tienda67.jpg"
            alt="Logo Tienda67"
            width="36"
            height="36"
            className="rounded-circle"
          />
          <span>Tienda67</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#menuTienda"
          aria-controls="menuTienda"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="menuTienda">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">Inicio</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/productos">Productos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/nosotros">Nosotros</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/blogs">Blogs</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contacto">Contacto</Link>
            </li>
            {puedeAdministrar && (
              <li className="nav-item">
                <Link className="nav-link text-warning" to="/admin" data-testid="nav-panel">
                  {sesion.rol === "administrador" ? "⚙️ Panel Admin" : "📋 Panel Vendedor"}
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-2">
            {sesion ? (
              <>
                <span className="text-info fw-semibold" data-testid="nav-saludo">
                  👤 Hola, {sesion.nombre}
                </span>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  data-testid="btn-logout"
                  onClick={onCerrarSesion}
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link className="btn btn-outline-light btn-sm" to="/login" data-testid="nav-login">
                  Iniciar sesión
                </Link>
                <Link className="btn btn-light btn-sm" to="/registro" data-testid="nav-registro">
                  Registrarse
                </Link>
              </>
            )}
            <Link to="/carrito" className="btn btn-outline-light position-relative">
              🛒 Carrito
              <span
                data-testid="cart-badge"
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              >
                {totalItems}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}