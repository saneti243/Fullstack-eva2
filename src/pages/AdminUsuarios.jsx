import React, { useState } from "react";
import AdminNav from "../components/AdminNav";
import { formatearRun, validarCorreo, validarPassword, validarRun } from "../utils/validaciones";

const BADGES = { administrador: "bg-danger", vendedor: "bg-warning text-dark", cliente: "bg-secondary" };

export default function AdminUsuarios({
  usuarios = [],
  correoSesion,
  onGuardarUsuario,
  onEliminarUsuario
}) {
  const [run, setRun] = useState("");
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("cliente");
  const [correoEdicion, setCorreoEdicion] = useState(null);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState("");

  const limpiar = () => {
    setRun(""); setNombre(""); setCorreo(""); setPassword(""); setRol("cliente");
    setCorreoEdicion(null); setErrores({});
  };

  const handleEditar = (u) => {
    setCorreoEdicion(u.correo);
    setRun(u.run || "");
    setNombre(u.nombre);
    setCorreo(u.correo);
    setPassword(u.password);
    setRol(u.rol);
    setErrores({});
    setMensaje("");
  };

  const handleEliminar = (u) => {
    if (u.correo === correoSesion) {
      setMensaje("No puedes eliminar tu propia cuenta mientras estás en sesión.");
      return;
    }
    if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
      onEliminarUsuario && onEliminarUsuario(u.correo);
      if (correoEdicion === u.correo) limpiar();
      setMensaje("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMensaje("");
    const nuevos = {};
    if (!validarRun(run)) nuevos.run = "RUN inválido (7 a 9 caracteres, sin puntos ni guion).";
    if (nombre.trim().length < 3) nuevos.nombre = "El nombre debe tener al menos 3 caracteres.";
    if (!validarCorreo(correo)) nuevos.correo = "Correo inválido (@duoc.cl, @profesor.duoc.cl o @gmail.com).";
    if (!validarPassword(password)) nuevos.password = "La contraseña debe tener entre 4 y 10 caracteres.";
    if (Object.keys(nuevos).length) {
      setErrores(nuevos);
      return;
    }
    const resultado = onGuardarUsuario
      ? onGuardarUsuario(
          { run: run.trim().toUpperCase(), nombre: nombre.trim(), correo: correo.trim(), password, rol },
          correoEdicion
        )
      : { ok: true };
    if (resultado && resultado.ok === false) {
      setErrores({ correo: resultado.error });
      return;
    }
    setMensaje(correoEdicion ? "Usuario modificado correctamente." : "Nuevo usuario creado correctamente.");
    limpiar();
  };

  const cls = (c) => `form-control ${errores[c] ? "is-invalid" : ""}`;
  const err = (c) => errores[c] && <div className="invalid-feedback d-block">{errores[c]}</div>;

  return (
    <div className="container py-4">
      <h2 className="mb-3 fw-bold">Panel de Administración - Gestión de Usuarios</h2>
      <AdminNav rol="administrador" />

      <div className="row g-4">
        <div className="col-12 col-lg-5">
          <div className="card shadow-sm p-4">
            <h4 className="mb-3" data-testid="usuario-form-titulo">
              {correoEdicion ? "Modificar Usuario" : "Agregar Nuevo Usuario"}
            </h4>
            {mensaje && <div className="alert alert-info py-2" data-testid="usuarios-mensaje">{mensaje}</div>}
            <form onSubmit={handleSubmit} noValidate>
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label">RUN</label>
                  <input className={cls("run")} data-testid="usu-run" maxLength={9} value={run}
                    onChange={(e) => setRun(formatearRun(e.target.value))} />
                  {err("run")}
                </div>
                <div className="col-6">
                  <label className="form-label">Rol del sistema</label>
                  <select className="form-select" data-testid="usu-rol" value={rol}
                    onChange={(e) => setRol(e.target.value)}>
                    <option value="cliente">Cliente</option>
                    <option value="vendedor">Vendedor</option>
                    <option value="administrador">Administrador</option>
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Nombre completo</label>
                <input className={cls("nombre")} data-testid="usu-nombre" value={nombre}
                  onChange={(e) => setNombre(e.target.value)} />
                {err("nombre")}
              </div>
              <div className="mb-3">
                <label className="form-label">Correo</label>
                <input type="email" className={cls("correo")} data-testid="usu-correo" value={correo}
                  disabled={correoEdicion !== null} onChange={(e) => setCorreo(e.target.value)} />
                {err("correo")}
              </div>
              <div className="mb-3">
                <label className="form-label">Contraseña</label>
                <input type="password" className={cls("password")} data-testid="usu-password" value={password}
                  onChange={(e) => setPassword(e.target.value)} />
                {err("password")}
              </div>
              <button type="submit" className="btn btn-primary w-100" data-testid="usu-guardar">
                Guardar Usuario
              </button>
              {correoEdicion && (
                <button type="button" className="btn btn-outline-secondary w-100 mt-2" onClick={limpiar}>
                  Cancelar edición
                </button>
              )}
            </form>
          </div>
        </div>

        <div className="col-12 col-lg-7">
          <div className="card shadow-sm p-4">
            <h4 className="mb-3">Usuarios registrados ({usuarios.length})</h4>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-dark">
                  <tr><th>RUN</th><th>Nombre</th><th>Correo</th><th>Rol</th><th>Acciones</th></tr>
                </thead>
                <tbody>
                  {usuarios.length === 0 && (
                    <tr><td colSpan="5" className="text-center">No hay usuarios registrados.</td></tr>
                  )}
                  {usuarios.map((u) => (
                    <tr key={u.correo}>
                      <td>{u.run || "N/A"}</td>
                      <td>{u.nombre}</td>
                      <td>{u.correo}</td>
                      <td><span className={`badge ${BADGES[u.rol] || "bg-secondary"}`}>{u.rol.toUpperCase()}</span></td>
                      <td className="text-nowrap">
                        <button className="btn btn-outline-primary btn-sm me-1"
                          data-testid={`usu-editar-${u.correo}`} onClick={() => handleEditar(u)}>Editar</button>
                        <button className="btn btn-outline-danger btn-sm"
                          data-testid={`usu-eliminar-${u.correo}`} onClick={() => handleEliminar(u)}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
