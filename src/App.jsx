import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Productos from "./pages/Productos";
import Carrito from "./pages/Carrito";
import Registro from "./pages/Registro";
import Nosotros from "./pages/Nosotros";
import { PRODUCTOS_INICIALES } from "./data/productosData";

export default function App() {
  const [productos] = useState(PRODUCTOS_INICIALES);
  const [carrito, setCarrito] = useState(() => {
    try {
      const guardado = localStorage.getItem("carrito_tienda67");
      return guardado ? JSON.parse(guardado) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("carrito_tienda67", JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === producto.id);
      if (existe) {
        return prev.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const eliminarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id));
  };

  const cambiarCantidad = (id, delta) => {
    setCarrito((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, cantidad: item.cantidad + delta } : item
        )
        .filter((item) => item.cantidad > 0)
    );
  };

  const vaciarCarrito = () => setCarrito([]);

  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <Router>
      <Navbar totalItems={totalItems} />
      <Routes>
        <Route
          path="/"
          element={
            <Productos
              productos={productos}
              onAgregarAlCarrito={agregarAlCarrito}
            />
          }
        />
        <Route
          path="/productos"
          element={
            <Productos
              productos={productos}
              onAgregarAlCarrito={agregarAlCarrito}
            />
          }
        />
        <Route
          path="/carrito"
          element={
            <Carrito
              carrito={carrito}
              onEliminar={eliminarDelCarrito}
              onVaciar={vaciarCarrito}
              onCambiarCantidad={cambiarCantidad}
            />
          }
        />
        <Route path="/registro" element={<Registro />} />
        <Route path="/nosotros" element={<Nosotros />} />
      </Routes>
    </Router>
  );
}