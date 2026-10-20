import React, { useState } from "react";
import { REGIONES } from "../data/regionesData";
import { formatearRun, validarRegistro, asignarRol } from "../utils/validaciones";

// onRegistrarUsuario(usuario) puede devolver { ok, error }. onExito se ejecuta tras un registro correcto.
export default function Registro({ onRegistrarUsuario, onExito }) {
  const [nombre, setNombre] = useState("");
  const [run, setRun] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [region, setRegion] = useState("");
  const [comuna, setComuna] = useState("");
  const [error, setError] = useState("");
  const [erroresCampo, setErroresCampo] = useState({});
  const [exito, setExito] = useState(false);

  const comunas = REGIONES[region] || [];

  const handleRegion = (e) => {
    setRegion(e.target.value);
    setComuna("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setExito(false);

    const validacion = validarRegistro({ nombre, run, correo, password, region, comuna });
    if (!validacion.esValido) {
      setErroresCampo(validacion.errores);
      // Mensaje general: primer error encontrado (nombre → correo → contraseña → resto)
      const orden = ["nombre", "correo", "password", "run", "region", "comuna"];
      const primero = orden.find((campo) => validacion.errores[campo]);
      setError(validacion.errores[primero]);
      return;
    }
    setErroresCampo({});

    const usuario = {
      run: run.trim().toUpperCase(),
      nombre: nombre.trim(),
      correo: correo.trim(),
      password,
      region,
      comuna,
      rol: asignarRol(correo)
    };

    if (onRegistrarUsuario) {
      const resultado = onRegistrarUsuario(usuario);
      if (resultado && resultado.ok === false) {
        setErroresCampo({ correo: resultado.error });
        setError(resultado.error);
        return;
      }
    }

    setExito(true);
    setNombre("");
    setRun("");
    setCorreo("");
    setPassword("");
    setRegion("");
    setComuna("");
    if (onExito) onExito(usuario);
  };

  const clase = (campo) => `form-control ${erroresCampo[campo] ? "is-invalid" : ""}`;

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
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
                  className={clase("nombre")}
                  data-testid="input-nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">RUN</label>
                <input
                  type="text"
                  className={clase("run")}
                  data-testid="input-run"
                  placeholder="Ej: 19011022K (sin puntos ni guion)"
                  maxLength={9}
                  value={run}
                  onChange={(e) => setRun(formatearRun(e.target.value))}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Correo Electrónico</label>
                <input
                  type="email"
                  className={clase("correo")}
                  data-testid="input-correo"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  className={clase("password")}
                  data-testid="input-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="form-text">Entre 4 y 10 caracteres.</div>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-12 col-sm-6">
                  <label className="form-label">Región</label>
                  <select
                    className={`form-select ${erroresCampo.region ? "is-invalid" : ""}`}
                    data-testid="select-region"
                    value={region}
                    onChange={handleRegion}
                  >
                    <option value="">Seleccione una región...</option>
                    {Object.keys(REGIONES).map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-sm-6">
                  <label className="form-label">Comuna</label>
                  <select
                    className={`form-select ${erroresCampo.comuna ? "is-invalid" : ""}`}
                    data-testid="select-comuna"
                    value={comuna}
                    onChange={(e) => setComuna(e.target.value)}
                  >
                    <option value="">Seleccione una comuna...</option>
                    {comunas.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
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
