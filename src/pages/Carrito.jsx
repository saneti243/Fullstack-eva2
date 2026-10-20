import React, { useState } from "react";
import {
  calcularTotalCarrito,
  formatearNombre,
  formatearRun,
  formatearTarjeta,
  formatearVencimiento,
  validarPago
} from "../utils/validaciones";

const FORM_VACIO = {
  nombre: "",
  run: "",
  direccion: "",
  tarjeta: "",
  vencimiento: "",
  cvv: ""
};

export default function Carrito({
  carrito,
  onEliminar,
  onVaciar,
  onCambiarCantidad,
  onPagar
}) {
  const total = calcularTotalCarrito(carrito);
  const [pago, setPago] = useState(FORM_VACIO);
  const [errores, setErrores] = useState({});
  const [compra, setCompra] = useState(null);

  const cambiar = (campo, formateador = (v) => v) => (e) => {
    setPago((prev) => ({ ...prev, [campo]: formateador(e.target.value) }));
  };

  const handlePagar = (e) => {
    e.preventDefault();
    if (carrito.length === 0) return;

    const validacion = validarPago(pago);
    if (!validacion.esValido) {
      setErrores(validacion.errores);
      return;
    }

    setErrores({});
    setCompra({ nombre: pago.nombre.trim(), total });
    // Los datos de la tarjeta nunca se guardan: solo se avisa que el pago fue autorizado.
    if (onPagar) onPagar({ nombre: pago.nombre.trim(), direccion: pago.direccion.trim(), total });
    setPago(FORM_VACIO);
  };

  const claseInput = (campo) => `form-control ${errores[campo] ? "is-invalid" : ""}`;
  const mensaje = (campo) =>
    errores[campo] && (
      <div className="invalid-feedback" data-testid={`error-pago-${campo}`}>
        {errores[campo]}
      </div>
    );

  return (
    <div className="container py-4">
      <h2 className="mb-4">Tu Carrito de Compras</h2>

      {compra && (
        <div className="alert alert-success" data-testid="pago-exitoso">
          <strong>¡Pago autorizado!</strong> Gracias por tu compra, {compra.nombre}. Hemos
          enviado los detalles del pedido y la boleta a tu correo electrónico registrado.
        </div>
      )}

      {carrito.length === 0 ? (
        <div className="alert alert-info" data-testid="empty-cart-msg">
          El carrito está vacío actualmente.
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {carrito.map((item) => (
                  <tr key={item.id} data-testid={`cart-row-${item.id}`}>
                    <td>{item.nombre}</td>
                    <td>${item.precio.toLocaleString("es-CL")}</td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => onCambiarCantidad(item.id, -1)}
                        >
                          -
                        </button>
                        <span className="btn btn-light disabled">
                          {item.cantidad}
                        </span>
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => onCambiarCantidad(item.id, 1)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>
                      ${(item.precio * item.cantidad).toLocaleString("es-CL")}
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        data-testid={`btn-remove-${item.id}`}
                        onClick={() => onEliminar(item.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4 p-3 bg-light rounded border">
            <button
              className="btn btn-outline-danger mb-2 mb-md-0"
              data-testid="btn-clear-cart"
              onClick={onVaciar}
            >
              Vaciar Carrito
            </button>
            <h4 className="mb-0" data-testid="cart-total">
              Total: ${total.toLocaleString("es-CL")}
            </h4>
          </div>

          <div className="card shadow-sm p-4 mt-4" data-testid="checkout-section">
            <h4 className="mb-3">Datos de Facturación y Envío</h4>
            <form onSubmit={handlePagar} noValidate data-testid="form-pago">
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label">Nombre completo</label>
                  <input
                    type="text"
                    className={claseInput("nombre")}
                    data-testid="pago-nombre"
                    placeholder="Ej: Arturo Ignacio Cabello"
                    value={pago.nombre}
                    onChange={cambiar("nombre", formatearNombre)}
                  />
                  {mensaje("nombre")}
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">RUN</label>
                  <input
                    type="text"
                    className={claseInput("run")}
                    data-testid="pago-run"
                    placeholder="Ej: 19011022K"
                    maxLength={9}
                    value={pago.run}
                    onChange={cambiar("run", formatearRun)}
                  />
                  {mensaje("run")}
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">Dirección de envío</label>
                  <input
                    type="text"
                    className={claseInput("direccion")}
                    data-testid="pago-direccion"
                    placeholder="Ej: Av. Providencia 1234, Santiago"
                    value={pago.direccion}
                    onChange={cambiar("direccion")}
                  />
                  {mensaje("direccion")}
                </div>
              </div>

              <h5 className="mt-4 mb-3">Método de Pago</h5>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label">Número de tarjeta</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    className={claseInput("tarjeta")}
                    data-testid="pago-tarjeta"
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    value={pago.tarjeta}
                    onChange={cambiar("tarjeta", formatearTarjeta)}
                  />
                  {mensaje("tarjeta")}
                </div>
                <div className="col-6">
                  <label className="form-label">Vencimiento</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    className={claseInput("vencimiento")}
                    data-testid="pago-vencimiento"
                    placeholder="MM/AA"
                    maxLength={5}
                    value={pago.vencimiento}
                    onChange={cambiar("vencimiento", formatearVencimiento)}
                  />
                  {mensaje("vencimiento")}
                </div>
                <div className="col-6">
                  <label className="form-label">CVV</label>
                  <input
                    type="password"
                    inputMode="numeric"
                    className={claseInput("cvv")}
                    data-testid="pago-cvv"
                    placeholder="123"
                    maxLength={3}
                    value={pago.cvv}
                    onChange={cambiar("cvv", (v) => v.replace(/\D/g, ""))}
                  />
                  {mensaje("cvv")}
                </div>
              </div>

              <div className="text-end mt-4">
                <button type="submit" className="btn btn-success px-4" data-testid="btn-pagar">
                  Confirmar y Pagar
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}