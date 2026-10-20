import React from "react";
import { NavLink } from "react-router-dom";

export default function AdminNav({ rol }) {
  const clase = ({ isActive }) => `nav-link ${isActive ? "active fw-bold" : ""}`;
  return (
    <ul className="nav nav-pills mb-4" data-testid="admin-nav">
      <li className="nav-item">
        <NavLink end to="/admin" className={clase}>Productos</NavLink>
      </li>
      {rol === "administrador" && (
        <li className="nav-item">
          <NavLink to="/admin/usuarios" className={clase}>Usuarios</NavLink>
        </li>
      )}
      <li className="nav-item">
        <NavLink to="/" className="nav-link">Ver Tienda</NavLink>
      </li>
    </ul>
  );
}
