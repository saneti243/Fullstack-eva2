import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import App from "../App";

const cambiar = (u, id, valor) => fireEvent.change(u.getByTestId(id), { target: { value: valor } });

const irA = (ruta) => window.history.pushState({}, "", ruta);

describe("Integración de la aplicación (App)", () => {
  beforeEach(() => {
    window.localStorage.clear();
    irA("/");
  });

  afterEach(() => window.localStorage.clear());

  it("agregar un producto desde el Home actualiza el badge del carrito y se persiste", () => {
    const u = render(<App />);
    fireEvent.click(u.getByTestId("btn-add-1"));
    fireEvent.click(u.getByTestId("btn-add-1"));
    expect(u.getByTestId("cart-badge").textContent).toBe("2");
    expect(JSON.parse(window.localStorage.getItem("carrito_tienda67"))[0].cantidad).toBe(2);
  });

  it("flujo completo: registro → login → panel admin → crear y eliminar producto → cerrar sesión", () => {
    spyOn(window, "confirm").and.returnValue(true);
    irA("/registro");
    const u = render(<App />);

    // Registro (rol administrador por palabra clave)
    cambiar(u, "input-nombre", "Ana Admin");
    cambiar(u, "input-run", "19011022K");
    cambiar(u, "input-correo", "ana.admin@duoc.cl");
    cambiar(u, "input-password", "1234");
    cambiar(u, "select-region", "Biobío");
    cambiar(u, "select-comuna", "Concepción");
    fireEvent.click(u.getByTestId("btn-submit-registro"));
    expect(u.getByTestId("login-registro-ok")).not.toBeNull();
    expect(JSON.parse(window.localStorage.getItem("usuarios_tienda67"))[0].rol).toBe("administrador");

    // Login
    cambiar(u, "login-correo", "ana.admin@duoc.cl");
    cambiar(u, "login-password", "1234");
    fireEvent.click(u.getByTestId("btn-login"));
    expect(u.getByTestId("nav-saludo").textContent).toContain("Ana Admin");
    expect(u.getByTestId("admin-form-titulo")).not.toBeNull();

    // Crear producto
    cambiar(u, "admin-nombre", "Mouse Gamer");
    cambiar(u, "admin-precio", "15990");
    fireEvent.click(u.getByTestId("admin-guardar"));
    expect(u.getByTestId("admin-success")).not.toBeNull();
    expect(u.getByText("Mouse Gamer")).not.toBeNull();
    const nuevo = JSON.parse(window.localStorage.getItem("productos_tienda67")).find((p) => p.nombre === "Mouse Gamer");

    // Eliminar producto
    fireEvent.click(u.getByTestId(`btn-eliminar-${nuevo.id}`));
    expect(u.queryByText("Mouse Gamer")).toBeNull();

    // Cerrar sesión
    fireEvent.click(u.getByTestId("btn-logout"));
    expect(u.getByTestId("nav-login")).not.toBeNull();
    expect(JSON.parse(window.localStorage.getItem("sesion_tienda67"))).toBeNull();
  });

  it("un invitado que entra a /admin es enviado al login con aviso de acceso denegado", () => {
    irA("/admin");
    const u = render(<App />);
    expect(u.getByTestId("login-acceso-denegado")).not.toBeNull();
  });

  it("un vendedor accede al panel de productos pero no a la gestión de usuarios", () => {
    window.localStorage.setItem("sesion_tienda67", JSON.stringify({ correo: "v@duoc.cl", nombre: "Vera", rol: "vendedor" }));
    irA("/admin/usuarios");
    const u = render(<App />);
    expect(u.getByTestId("admin-form-titulo")).not.toBeNull(); // redirigido a /admin
    expect(u.queryByText("Usuarios", { selector: "a" })).toBeNull();
  });

  it("registro con correo ya existente muestra error y no duplica el usuario", () => {
    window.localStorage.setItem("usuarios_tienda67", JSON.stringify([
      { run: "19011022K", nombre: "Ana", correo: "ana@gmail.com", password: "1234", region: "Biobío", comuna: "Concepción", rol: "cliente" }
    ]));
    irA("/registro");
    const u = render(<App />);
    cambiar(u, "input-nombre", "Ana Dos");
    cambiar(u, "input-run", "19011022K");
    cambiar(u, "input-correo", "ana@gmail.com");
    cambiar(u, "input-password", "1234");
    cambiar(u, "select-region", "Biobío");
    cambiar(u, "select-comuna", "Concepción");
    fireEvent.click(u.getByTestId("btn-submit-registro"));
    expect(u.getByTestId("form-error").textContent).toContain("ya está registrado");
    expect(JSON.parse(window.localStorage.getItem("usuarios_tienda67")).length).toBe(1);
  });

  it("pagar el carrito vacía el carrito persistido", () => {
    window.localStorage.setItem("carrito_tienda67", JSON.stringify([
      { id: 1, nombre: "Audífonos", categoria: "Tecnología", precio: 19990, cantidad: 1, imagen: "/x.jpg", descripcion: "" }
    ]));
    irA("/carrito");
    const u = render(<App />);
    cambiar(u, "pago-nombre", "Ana Pérez");
    cambiar(u, "pago-run", "19011022K");
    cambiar(u, "pago-direccion", "Av. Providencia 123");
    cambiar(u, "pago-tarjeta", "1234567812345678");
    cambiar(u, "pago-vencimiento", "1235");
    cambiar(u, "pago-cvv", "123");
    fireEvent.click(u.getByTestId("btn-pagar"));
    expect(u.getByTestId("pago-exitoso")).not.toBeNull();
    expect(JSON.parse(window.localStorage.getItem("carrito_tienda67")).length).toBe(0);
  });
});
