import React, { useState } from "react";
import ProductCard from "../components/ProductCard";

export default function Productos({ productos, onAgregarAlCarrito }) {
  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");

  const categorias = ["Todas", ...new Set(productos.map((p) => p.categoria))];

  const productosFiltrados = productos.filter((prod) => {
    const coincideTexto = prod.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    const coincideCat =
      categoriaSeleccionada === "Todas" ||
      prod.categoria === categoriaSeleccionada;
    return coincideTexto && coincideCat;
  });

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center">Catálogo de Productos</h2>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar producto por nombre..."
            data-testid="search-input"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="col-12 col-md-4">
          <select
            className="form-select"
            data-testid="category-select"
            value={categoriaSeleccionada}
            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
          >
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="row" data-testid="products-grid">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((producto) => (
            <ProductCard
              key={producto.id}
              producto={producto}
              onAgregar={onAgregarAlCarrito}
            />
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <p className="text-muted fs-5" data-testid="empty-search">
              No se encontraron productos que coincidan con tu búsqueda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}