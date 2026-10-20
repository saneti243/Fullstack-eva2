import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import RutaProtegida from "./components/RutaProtegida";
import Home from "./pages/Home";
import Productos from "./pages/Productos";
import DetalleProducto from "./pages/DetalleProducto";
import Carrito from "./pages/Carrito";
import Registro from "./pages/Registro";
import Login from "./pages/Login";
import Nosotros from "./pages/Nosotros";
import Blogs from "./pages/Blogs";
import DetalleBlog from "./pages/DetalleBlog";
import Contacto from "./pages/Contacto";
import AdminProductos from "./pages/AdminProductos";
import AdminUsuarios from "./pages/AdminUsuarios";
import useLocalStorage from "./hooks/useLocalStorage";
import { PRODUCTOS_INICIALES } from "./data/productosData";

function RegistroRoute({ onRegistrarUsuario }) {
  const navigate = useNavigate();
  return (
    <Registro
      onRegistrarUsuario={onRegistrarUsuario}
      onExito={() => navigate("/login", { state: { registroExitoso: true } })}
    />
  );
}

export default function App() {
  const [productos, setProductos] = useLocalStorage("productos_tienda67", PRODUCTOS_INICIALES);
  const [carrito, setCarrito] = useLocalStorage("carrito_tienda67", []);
  const [usuarios, setUsuarios] = useLocalStorage("usuarios_tienda67", []);
  const [sesion, setSesion] = useLocalStorage("sesion_tienda67", null);

  // ---------- Carrito ----------
  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === producto.id);
      if (existe) {
        return prev.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const eliminarDelCarrito = (id) => setCarrito((prev) => prev.filter((item) => item.id !== id));

  const cambiarCantidad = (id, delta) => {
    setCarrito((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, cantidad: item.cantidad + delta } : item))
        .filter((item) => item.cantidad > 0)
    );
  };

  const vaciarCarrito = () => setCarrito([]);

  // ---------- Catálogo ----------
  const agregarProductoCatalogo = (nuevoProd) => setProductos((prev) => [...prev, nuevoProd]);
  const eliminarProductoCatalogo = (id) => setProductos((prev) => prev.filter((p) => p.id !== id));
  const editarProductoCatalogo = (editado) =>
    setProductos((prev) => prev.map((p) => (p.id === editado.id ? { ...p, ...editado } : p)));

  // ---------- Usuarios y sesión ----------
  const registrarUsuario = (usuario) => {
    if (usuarios.some((u) => u.correo === usuario.correo)) {
      return { ok: false, error: "Este correo ya está registrado." };
    }
    setUsuarios((prev) => [...prev, usuario]);
    return { ok: true };
  };

  const iniciarSesion = (correo, password) => {
    const usuario = usuarios.find((u) => u.correo === correo && u.password === password);
    if (!usuario) return { ok: false };
    setSesion({ correo: usuario.correo, nombre: usuario.nombre, rol: usuario.rol });
    return { ok: true, usuario };
  };

  const cerrarSesion = () => setSesion(null);

  // Alta/edición desde el panel admin. correoOriginal != null => edición.
  const guardarUsuarioAdmin = (datos, correoOriginal) => {
    if (correoOriginal) {
      setUsuarios((prev) =>
        prev.map((u) => (u.correo === correoOriginal ? { ...u, ...datos, correo: correoOriginal } : u))
      );
      if (sesion && sesion.correo === correoOriginal) {
        setSesion({ ...sesion, nombre: datos.nombre, rol: datos.rol });
      }
      return { ok: true };
    }
    if (usuarios.some((u) => u.correo === datos.correo)) {
      return { ok: false, error: "Este correo ya está registrado en el sistema." };
    }
    setUsuarios((prev) => [
      ...prev,
      { ...datos, region: "Asignada por Admin", comuna: "Asignada por Admin" }
    ]);
    return { ok: true };
  };

  const eliminarUsuario = (correo) => setUsuarios((prev) => prev.filter((u) => u.correo !== correo));

  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const puedeAdministrar = !!sesion && (sesion.rol === "administrador" || sesion.rol === "vendedor");

  return (
    <Router>
      <Navbar totalItems={totalItems} sesion={sesion} onCerrarSesion={cerrarSesion} />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home productos={productos} onAgregarAlCarrito={agregarAlCarrito} />} />
          <Route path="/productos" element={<Productos productos={productos} onAgregarAlCarrito={agregarAlCarrito} />} />
          <Route
            path="/productos/:id"
            element={<DetalleProducto productos={productos} onAgregarAlCarrito={agregarAlCarrito} />}
          />
          <Route
            path="/carrito"
            element={
              <Carrito
                carrito={carrito}
                onEliminar={eliminarDelCarrito}
                onVaciar={vaciarCarrito}
                onCambiarCantidad={cambiarCantidad}
                onPagar={vaciarCarrito}
              />
            }
          />
          <Route path="/registro" element={<RegistroRoute onRegistrarUsuario={registrarUsuario} />} />
          <Route path="/login" element={<Login onLogin={iniciarSesion} />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:id" element={<DetalleBlog />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route
            path="/admin"
            element={
              <RutaProtegida sesion={sesion} rolesPermitidos={["administrador", "vendedor"]}>
                <AdminProductos
                  productos={productos}
                  rol={sesion?.rol}
                  onAgregarProducto={agregarProductoCatalogo}
                  onEliminarProducto={eliminarProductoCatalogo}
                  onEditarProducto={editarProductoCatalogo}
                />
              </RutaProtegida>
            }
          />
          <Route
            path="/admin/usuarios"
            element={
              <RutaProtegida sesion={sesion} rolesPermitidos={["administrador"]} redirigirA="/admin">
                <AdminUsuarios
                  usuarios={usuarios}
                  correoSesion={sesion?.correo}
                  onGuardarUsuario={guardarUsuarioAdmin}
                  onEliminarUsuario={eliminarUsuario}
                />
              </RutaProtegida>
            }
          />
        </Routes>
      </main>
      <Footer nombreTienda="Tienda67" anio={2026} puedeAdministrar={puedeAdministrar} />
    </Router>
  );
}
