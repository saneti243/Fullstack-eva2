import React, { useState } from "react";
import { validarCorreo } from "../utils/validaciones";

export default function Contacto({ onEnviar }) {
  const vacio = { nombre: "", correo: "", asunto: "", mensaje: "" };
  const [form, setForm] = useState(vacio);
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  const cambiar = (campo) => (e) => setForm((p) => ({ ...p, [campo]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setEnviado(false);
    const nuevos = {};
    if (form.nombre.trim().length < 3) nuevos.nombre = "Ingrese su nombre completo.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo.trim()) && !validarCorreo(form.correo)) {
      nuevos.correo = "Ingrese un correo electrónico válido.";
    }
    if (!form.asunto.trim()) nuevos.asunto = "El asunto es obligatorio.";
    if (form.mensaje.trim().length < 10) nuevos.mensaje = "El mensaje debe tener al menos 10 caracteres.";
    setErrores(nuevos);
    if (Object.keys(nuevos).length) return;
    if (onEnviar) onEnviar(form);
    setEnviado(true);
    setForm(vacio);
  };

  const cls = (c) => `form-control ${errores[c] ? "is-invalid" : ""}`;
  const err = (c) => errores[c] && <div className="invalid-feedback" data-testid={`error-contacto-${c}`}>{errores[c]}</div>;

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card shadow-sm p-4">
            <h3 className="text-center mb-2">Contáctanos</h3>
            <p className="text-center text-muted small mb-4">
              ¿Tienes alguna duda o sugerencia? Déjanos un mensaje y te responderemos a la brevedad.
            </p>
            {enviado && (
              <div className="alert alert-success" data-testid="contacto-exito">
                ¡Mensaje enviado! Te responderemos pronto.
              </div>
            )}
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label">Nombre completo</label>
                <input className={cls("nombre")} data-testid="contacto-nombre" value={form.nombre} onChange={cambiar("nombre")} />
                {err("nombre")}
              </div>
              <div className="mb-3">
                <label className="form-label">Correo electrónico</label>
                <input type="email" className={cls("correo")} data-testid="contacto-correo" value={form.correo} onChange={cambiar("correo")} />
                {err("correo")}
              </div>
              <div className="mb-3">
                <label className="form-label">Asunto</label>
                <input className={cls("asunto")} data-testid="contacto-asunto" value={form.asunto} onChange={cambiar("asunto")} />
                {err("asunto")}
              </div>
              <div className="mb-3">
                <label className="form-label">Mensaje</label>
                <textarea rows="5" className={cls("mensaje")} data-testid="contacto-mensaje" value={form.mensaje} onChange={cambiar("mensaje")} />
                {err("mensaje")}
              </div>
              <button type="submit" className="btn btn-primary w-100" data-testid="contacto-enviar">Enviar mensaje</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
