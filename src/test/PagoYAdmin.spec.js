import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Carrito from "../pages/Carrito";
import AdminProductos from "../pages/AdminProductos";
import AdminUsuarios from "../pages/AdminUsuarios";
import Contacto from "../pages/Contacto";
import Blogs from "../pages/Blogs";
import DetalleBlog from "../pages/DetalleBlog";
import DetalleProducto from "../pages/DetalleProducto";

const carritoMock = [{ id: 1, nombre: "Audífonos", categoria: "Tecnología", precio: 10000, cantidad: 2 }];
const productosMock = [
  { id: 1, nombre: "Audífonos", categoria: "Tecnología", precio: 19990, stock: 5, imagen: "/images/audifonos.jpg", descripcion: "d" }
];
const cambiar = (u, id, valor) => fireEvent.change(u.getByTestId(id), { target: { value: valor } });

describe("Checkout del carrito", () => {
  const renderCarrito = (onPagar = () => {}) =>
    render(<Carrito carrito={carritoMock} onEliminar={() => {}} onVaciar={() => {}} onCambiarCantidad={() => {}} onPagar={onPagar} />);

  it("muestra errores por campo al pagar con el formulario vacío y no llama a onPagar", () => {
    const onPagar = jasmine.createSpy("pagar");
    const u = renderCarrito(onPagar);
    fireEvent.click(u.getByTestId("btn-pagar"));
    expect(u.getByTestId("error-pago-tarjeta")).not.toBeNull();
    expect(u.getByTestId("error-pago-cvv")).not.toBeNull();
    expect(onPagar).not.toHaveBeenCalled();
  });

  it("aplica formato automático a la tarjeta y al vencimiento", () => {
    const u = renderCarrito();
    cambiar(u, "pago-tarjeta", "1234567812345678");
    cambiar(u, "pago-vencimiento", "1230");
    expect(u.getByTestId("pago-tarjeta").value).toBe("1234 5678 1234 5678");
    expect(u.getByTestId("pago-vencimiento").value).toBe("12/30");
  });

  it("rechaza una tarjeta vencida", () => {
    const u = renderCarrito();
    cambiar(u, "pago-nombre", "Ana Pérez");
    cambiar(u, "pago-run", "19011022K");
    cambiar(u, "pago-direccion", "Av. Providencia 123");
    cambiar(u, "pago-tarjeta", "1234567812345678");
    cambiar(u, "pago-vencimiento", "0120");
    cambiar(u, "pago-cvv", "123");
    fireEvent.click(u.getByTestId("btn-pagar"));
    expect(u.getByTestId("error-pago-vencimiento").textContent).toContain("vencida");
  });

  it("con datos válidos llama a onPagar y muestra la confirmación", () => {
    const onPagar = jasmine.createSpy("pagar");
    const u = renderCarrito(onPagar);
    cambiar(u, "pago-nombre", "Ana Pérez");
    cambiar(u, "pago-run", "19011022K");
    cambiar(u, "pago-direccion", "Av. Providencia 123");
    cambiar(u, "pago-tarjeta", "1234567812345678");
    cambiar(u, "pago-vencimiento", "1235");
    cambiar(u, "pago-cvv", "123");
    fireEvent.click(u.getByTestId("btn-pagar"));
    expect(onPagar).toHaveBeenCalledTimes(1);
    expect(onPagar.calls.mostRecent().args[0].total).toBe(20000);
    expect(u.getByTestId("pago-exitoso").textContent).toContain("Ana Pérez");
  });
});

describe("Paneles de administración", () => {
  beforeEach(() => spyOn(window, "confirm").and.returnValue(true));

  it("editar un producto carga el formulario y envía el producto modificado", () => {
    const onEditar = jasmine.createSpy("editar");
    const u = render(<MemoryRouter><AdminProductos productos={productosMock} onEditarProducto={onEditar} /></MemoryRouter>);
    fireEvent.click(u.getByTestId("btn-editar-1"));
    expect(u.getByTestId("admin-form-titulo").textContent).toContain("Modificar");
    cambiar(u, "admin-nombre", "Audífonos Gamer");
    fireEvent.click(u.getByTestId("admin-guardar"));
    expect(onEditar.calls.mostRecent().args[0].id).toBe(1);
    expect(onEditar.calls.mostRecent().args[0].nombre).toBe("Audífonos Gamer");
  });

  it("eliminar un producto pide confirmación y llama al callback", () => {
    const onEliminar = jasmine.createSpy("eliminar");
    const u = render(<MemoryRouter><AdminProductos productos={productosMock} onEliminarProducto={onEliminar} /></MemoryRouter>);
    fireEvent.click(u.getByTestId("btn-eliminar-1"));
    expect(window.confirm).toHaveBeenCalled();
    expect(onEliminar).toHaveBeenCalledWith(1);
  });

  it("AdminUsuarios crea un usuario con el rol elegido", () => {
    const onGuardar = jasmine.createSpy("guardar").and.returnValue({ ok: true });
    const u = render(<MemoryRouter><AdminUsuarios usuarios={[]} onGuardarUsuario={onGuardar} /></MemoryRouter>);
    cambiar(u, "usu-run", "19011022K");
    cambiar(u, "usu-nombre", "Pedro Soto");
    cambiar(u, "usu-correo", "pedro@duoc.cl");
    cambiar(u, "usu-password", "abcd");
    cambiar(u, "usu-rol", "vendedor");
    fireEvent.click(u.getByTestId("usu-guardar"));
    expect(onGuardar.calls.mostRecent().args[0].rol).toBe("vendedor");
    expect(u.getByTestId("usuarios-mensaje").textContent).toContain("creado");
  });

  it("AdminUsuarios no permite eliminar la cuenta con la sesión activa", () => {
    const onEliminar = jasmine.createSpy("eliminar");
    const usuarios = [{ run: "19011022K", nombre: "Ana", correo: "ana@duoc.cl", password: "1234", rol: "administrador" }];
    const u = render(
      <MemoryRouter>
        <AdminUsuarios usuarios={usuarios} correoSesion="ana@duoc.cl" onEliminarUsuario={onEliminar} />
      </MemoryRouter>
    );
    fireEvent.click(u.getByTestId("usu-eliminar-ana@duoc.cl"));
    expect(onEliminar).not.toHaveBeenCalled();
    expect(u.getByTestId("usuarios-mensaje").textContent).toContain("propia cuenta");
  });
});

describe("Páginas informativas", () => {
  it("Contacto valida campos y confirma el envío", () => {
    const onEnviar = jasmine.createSpy("enviar");
    const u = render(<Contacto onEnviar={onEnviar} />);
    fireEvent.click(u.getByTestId("contacto-enviar"));
    expect(u.getByTestId("error-contacto-nombre")).not.toBeNull();
    cambiar(u, "contacto-nombre", "Ana Pérez");
    cambiar(u, "contacto-correo", "ana@gmail.com");
    cambiar(u, "contacto-asunto", "Consulta");
    cambiar(u, "contacto-mensaje", "Hola, quisiera más información.");
    fireEvent.click(u.getByTestId("contacto-enviar"));
    expect(onEnviar).toHaveBeenCalledTimes(1);
    expect(u.getByTestId("contacto-exito")).not.toBeNull();
  });

  it("Blogs lista los artículos y DetalleBlog muestra el elegido por la URL", () => {
    const lista = render(<MemoryRouter><Blogs /></MemoryRouter>);
    expect(lista.getByTestId("blog-leer-1")).not.toBeNull();
    expect(lista.getByTestId("blog-leer-2")).not.toBeNull();
    lista.unmount();
    const det = render(
      <MemoryRouter initialEntries={["/blogs/2"]}>
        <Routes><Route path="/blogs/:id" element={<DetalleBlog />} /></Routes>
      </MemoryRouter>
    );
    expect(det.getByTestId("blog-titulo").textContent).toContain("Audio");
  });

  it("DetalleProducto muestra el producto de la URL y agrega al carrito", () => {
    const onAgregar = jasmine.createSpy("agregar");
    const u = render(
      <MemoryRouter initialEntries={["/productos/1"]}>
        <Routes>
          <Route path="/productos/:id" element={<DetalleProducto productos={productosMock} onAgregarAlCarrito={onAgregar} />} />
        </Routes>
      </MemoryRouter>
    );
    expect(u.getByTestId("detalle-precio").textContent).toContain("19.990");
    fireEvent.click(u.getByTestId("detalle-agregar"));
    expect(onAgregar).toHaveBeenCalledWith(productosMock[0]);
  });

  it("DetalleProducto muestra aviso si el producto no existe", () => {
    const u = render(
      <MemoryRouter initialEntries={["/productos/999"]}>
        <Routes><Route path="/productos/:id" element={<DetalleProducto productos={productosMock} />} /></Routes>
      </MemoryRouter>
    );
    expect(u.getByTestId("producto-no-encontrado")).not.toBeNull();
  });
});
