import React from "react";
import { calcularTotalCarrito } from "../utils/validaciones";

export default function Carrito({
  carrito,
  onEliminar,
  onVaciar,
  onCambiarCantidad
}) {
  const total = calcularTotalCarrito(carrito);

  return (
    <div className="container py-4">
      <h2 className="mb-4">Tu Carrito de Compras</h2>

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
        </>
      )}
    </div>
  );
}