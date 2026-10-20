import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { validarCorreo, validarPassword } from "../utils/validaciones";

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [errores, setErrores] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevos = {};
    if (!validarCorreo(correo)) {
      nuevos.correo = "Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com";
    }
    if (!validarPassword(password)) {
      nuevos.password = "La contraseña debe tener entre 4 y 10 caracteres.";
    }
    if (Object.keys(nuevos).length > 0) {
      setErrores(nuevos);
      return;
    }

    const resultado = onLogin ? onLogin(correo.trim(), password) : { ok: false };
    if (!resultado.ok) {
      setErrores({ correo: "Correo o contraseña incorrectos." });
      return;
    }
    setErrores({});
    const rol = resultado.usuario.rol;
    navigate(rol === "administrador" || rol === "vendedor" ? "/admin" : "/");
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-5">
          <div className="card shadow-sm p-4">
            <h3 className="mb-3 text-center">Iniciar sesión</h3>

            {location.state?.registroExitoso && (
              <div className="alert alert-success" data-testid="login-registro-ok">
                ¡Registro exitoso! Ahora puedes iniciar sesión.
              </div>
            )}
            {location.state?.accesoDenegado && (
              <div className="alert alert-warning" data-testid="login-acceso-denegado">
                Acceso denegado. Esta sección es solo para personal autorizado.
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label" htmlFor="login-correo">Correo</label>
                <input
                  id="login-correo"
                  type="email"
                  className={`form-control ${errores.correo ? "is-invalid" : ""}`}
                  data-testid="login-correo"
                  autoComplete="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
                {errores.correo && (
                  <div className="invalid-feedback d-block" data-testid="error-login-correo">
                    {errores.correo}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="login-password">Contraseña</label>
                <input
                  id="login-password"
                  type="password"
                  className={`form-control ${errores.password ? "is-invalid" : ""}`}
                  data-testid="login-password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errores.password && (
                  <div className="invalid-feedback d-block" data-testid="error-login-password">
                    {errores.password}
                  </div>
                )}
              </div>

              <button type="submit" className="btn btn-primary w-100" data-testid="btn-login">
                Iniciar sesión
              </button>
            </form>

            <p className="text-center small mt-3 mb-0">
              ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
