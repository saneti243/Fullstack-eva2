import React from "react";
import { Navigate } from "react-router-dom";

// Protege rutas según el rol de la sesión (equivale al "Acceso denegado" del Archivador).
export default function RutaProtegida({ sesion, rolesPermitidos, redirigirA = "/", children }) {
  if (!sesion) {
    return <Navigate to="/login" replace state={{ accesoDenegado: true }} />;
  }
  if (!rolesPermitidos.includes(sesion.rol)) {
    return <Navigate to={redirigirA} replace />;
  }
  return children;
}
