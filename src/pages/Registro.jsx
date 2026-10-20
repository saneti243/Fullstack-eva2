import React, { useState } from "react";
import { validarCorreo, validarPassword } from "../utils/validaciones";

export default function Registro({ onRegistrarUsuario }) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setExito(false);

    if (nombre.trim().length < 3) {
      setError("El nombre debe tener al menos 3 caracteres.");
      return;
    }
    if (!validarCorreo(correo)) {
      setError("Ingrese un correo válido (@duoc.cl, @profesor.duoc.cl o @gmail.com).");
      return;
    }
    if (!validarPassword(password)) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (onRegistrarUsuario) {
      onRegistrarUsuario({ nombre, correo });
    }
    setExito(true);
    setNombre("");
    setCorreo("");
    setPassword("");
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6">
          <div className="card shadow-sm p-4">
            <h3 className="mb-3 text-center">Registro de Usuario</h3>

            {error && (
              <div className="alert alert-danger" data-testid="form-error">
                {error}
              </div>
            )}
            {exito && (
              <div className="alert alert-success" data-testid="form-success">
                ¡Usuario registrado exitosamente!
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label">Nombre Completo</label>
                <input
                  type="text"
                  className="form-control"
                  data-testid="input-nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Correo Electrónico</label>
                <input
                  type="email"
                  className="form-control"
                  data-testid="input-correo"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  data-testid="input-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-success w-100"
                data-testid="btn-submit-registro"
              >
                Registrarse
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}