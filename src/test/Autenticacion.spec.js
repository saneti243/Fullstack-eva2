import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Registro from "../pages/Registro";
import Navbar from "../components/Navbar";
import RutaProtegida from "../components/RutaProtegida";

describe("Autenticación y roles", () => {
  const llenarLogin = (utils, correo, password) => {
    fireEvent.change(utils.getByTestId("login-correo"), { target: { value: correo } });
    fireEvent.change(utils.getByTestId("login-password"), { target: { value: password } });
    fireEvent.click(utils.getByTestId("btn-login"));
  };

  it("Login muestra error de formato si el dominio del correo no está permitido", () => {
    const onLogin = jasmine.createSpy("onLogin");
    const u = render(<MemoryRouter><Login onLogin={onLogin} /></MemoryRouter>);
    llenarLogin(u, "x@hotmail.com", "1234");
    expect(u.getByTestId("error-login-correo").textContent).toContain("Solo se permiten correos");
    expect(onLogin).not.toHaveBeenCalled();
  });

  it("Login muestra error si la contraseña no tiene entre 4 y 10 caracteres", () => {
    const u = render(<MemoryRouter><Login onLogin={() => ({ ok: true })} /></MemoryRouter>);
    llenarLogin(u, "a@duoc.cl", "12");
    expect(u.getByTestId("error-login-password").textContent).toContain("entre 4 y 10");
  });

  it("Login muestra 'incorrectos' cuando las credenciales no existen", () => {
    const onLogin = jasmine.createSpy("onLogin").and.returnValue({ ok: false });
    const u = render(<MemoryRouter><Login onLogin={onLogin} /></MemoryRouter>);
    llenarLogin(u, "a@duoc.cl", "1234");
    expect(onLogin).toHaveBeenCalledWith("a@duoc.cl", "1234");
    expect(u.getByTestId("error-login-correo").textContent).toContain("incorrectos");
  });

  it("Login redirige a /admin cuando el rol es administrador", () => {
    const onLogin = () => ({ ok: true, usuario: { rol: "administrador" } });
    const u = render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<Login onLogin={onLogin} />} />
          <Route path="/admin" element={<p data-testid="pagina-admin">ADMIN</p>} />
          <Route path="/" element={<p>HOME</p>} />
        </Routes>
      </MemoryRouter>
    );
    llenarLogin(u, "admin@duoc.cl", "1234");
    expect(u.getByTestId("pagina-admin")).not.toBeNull();
  });

  it("Registro rechaza un correo duplicado devuelto por el callback", () => {
    const onRegistrar = jasmine.createSpy("reg").and.returnValue({ ok: false, error: "Este correo ya está registrado." });
    const u = render(<Registro onRegistrarUsuario={onRegistrar} />);
    fireEvent.change(u.getByTestId("input-nombre"), { target: { value: "Ana Pérez" } });
    fireEvent.change(u.getByTestId("input-run"), { target: { value: "19011022K" } });
    fireEvent.change(u.getByTestId("input-correo"), { target: { value: "ana@gmail.com" } });
    fireEvent.change(u.getByTestId("input-password"), { target: { value: "1234" } });
    fireEvent.change(u.getByTestId("select-region"), { target: { value: "Biobío" } });
    fireEvent.change(u.getByTestId("select-comuna"), { target: { value: "Concepción" } });
    fireEvent.click(u.getByTestId("btn-submit-registro"));
    expect(u.getByTestId("form-error").textContent).toContain("ya está registrado");
  });

  it("Registro asigna rol administrador si el correo contiene 'admin'", () => {
    const onRegistrar = jasmine.createSpy("reg");
    const u = render(<Registro onRegistrarUsuario={onRegistrar} />);
    fireEvent.change(u.getByTestId("input-nombre"), { target: { value: "Ana Pérez" } });
    fireEvent.change(u.getByTestId("input-run"), { target: { value: "19011022K" } });
    fireEvent.change(u.getByTestId("input-correo"), { target: { value: "ana.admin@duoc.cl" } });
    fireEvent.change(u.getByTestId("input-password"), { target: { value: "1234" } });
    fireEvent.change(u.getByTestId("select-region"), { target: { value: "Biobío" } });
    fireEvent.change(u.getByTestId("select-comuna"), { target: { value: "Concepción" } });
    fireEvent.click(u.getByTestId("btn-submit-registro"));
    expect(onRegistrar.calls.mostRecent().args[0].rol).toBe("administrador");
  });

  it("Registro limita las comunas a la región elegida", () => {
    const u = render(<Registro />);
    fireEvent.change(u.getByTestId("select-region"), { target: { value: "Valparaíso" } });
    const opciones = Array.from(u.getByTestId("select-comuna").options).map((o) => o.value);
    expect(opciones).toContain("Viña del Mar");
    expect(opciones).not.toContain("Santiago");
  });

  it("Navbar muestra saludo, panel y cerrar sesión para un administrador", () => {
    const onCerrar = jasmine.createSpy("cerrar");
    const u = render(
      <MemoryRouter>
        <Navbar totalItems={0} sesion={{ nombre: "Ana", rol: "administrador" }} onCerrarSesion={onCerrar} />
      </MemoryRouter>
    );
    expect(u.getByTestId("nav-saludo").textContent).toContain("Ana");
    expect(u.getByTestId("nav-panel").textContent).toContain("Panel Admin");
    fireEvent.click(u.getByTestId("btn-logout"));
    expect(onCerrar).toHaveBeenCalledTimes(1);
  });

  it("Navbar oculta el panel a los clientes y muestra login a los invitados", () => {
    const cliente = render(
      <MemoryRouter><Navbar totalItems={0} sesion={{ nombre: "Luis", rol: "cliente" }} /></MemoryRouter>
    );
    expect(cliente.queryByTestId("nav-panel")).toBeNull();
    cliente.unmount();
    const invitado = render(<MemoryRouter><Navbar totalItems={0} /></MemoryRouter>);
    expect(invitado.getByTestId("nav-login")).not.toBeNull();
  });

  it("RutaProtegida bloquea a invitados y a roles no permitidos", () => {
    const app = (sesion) => (
      <MemoryRouter initialEntries={["/secreto"]}>
        <Routes>
          <Route path="/secreto" element={
            <RutaProtegida sesion={sesion} rolesPermitidos={["administrador"]}>
              <p data-testid="contenido">SECRETO</p>
            </RutaProtegida>} />
          <Route path="/login" element={<p data-testid="login">LOGIN</p>} />
          <Route path="/" element={<p data-testid="home">HOME</p>} />
        </Routes>
      </MemoryRouter>
    );
    const a = render(app(null));
    expect(a.getByTestId("login")).not.toBeNull();
    a.unmount();
    const b = render(app({ rol: "cliente" }));
    expect(b.getByTestId("home")).not.toBeNull();
    b.unmount();
    const c = render(app({ rol: "administrador" }));
    expect(c.getByTestId("contenido")).not.toBeNull();
  });
});
