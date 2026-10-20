import {
  validarCorreo, validarPassword, validarRun, formatearRun, formatearNombre,
  formatearTarjeta, validarTarjeta, formatearVencimiento, validarVencimiento,
  validarCvv, asignarRol, validarRegistro, validarPago
} from "../utils/validaciones";
import { leerStorage, guardarStorage } from "../utils/storage";

describe("Utilidades migradas desde el Archivador", () => {
  const hoy = new Date(2026, 9, 20); // octubre 2026

  it("validarPassword acepta 4 a 10 caracteres y rechaza el resto", () => {
    expect(validarPassword("abc")).toBeFalse();
    expect(validarPassword("abcd")).toBeTrue();
    expect(validarPassword("1234567890")).toBeTrue();
    expect(validarPassword("12345678901")).toBeFalse();
  });

  it("validarRun exige 7-9 caracteres entre dígitos y K", () => {
    expect(validarRun("19011022K")).toBeTrue();
    expect(validarRun("1234567")).toBeTrue();
    expect(validarRun("123456")).toBeFalse();
    expect(validarRun("12.345.678")).toBeFalse();
  });

  it("formatearRun y formatearNombre limpian caracteres no permitidos", () => {
    expect(formatearRun("19.011.022-k")).toBe("19011022K");
    expect(formatearNombre("Ar7turo 3")).toBe("Arturo ");
  });

  it("formatearTarjeta agrupa en bloques de 4 y limita a 16 dígitos", () => {
    expect(formatearTarjeta("1234567812345678999")).toBe("1234 5678 1234 5678");
    expect(validarTarjeta("1234 5678 1234 5678")).toBeTrue();
    expect(validarTarjeta("1234")).toBeFalse();
  });

  it("formatearVencimiento inserta la barra MM/AA", () => {
    expect(formatearVencimiento("1228")).toBe("12/28");
    expect(formatearVencimiento("1")).toBe("1");
  });

  it("validarVencimiento detecta formato, mes inválido y tarjeta vencida", () => {
    expect(validarVencimiento("1228", hoy)).toContain("Formato");
    expect(validarVencimiento("13/28", hoy)).toContain("mes");
    expect(validarVencimiento("09/26", hoy)).toContain("vencida");
    expect(validarVencimiento("10/26", hoy)).toBe("");
    expect(validarVencimiento("01/30", hoy)).toBe("");
  });

  it("validarCvv acepta solo 3 dígitos", () => {
    expect(validarCvv("123")).toBeTrue();
    expect(validarCvv("12")).toBeFalse();
    expect(validarCvv("abc")).toBeFalse();
  });

  it("asignarRol detecta palabras clave en el correo", () => {
    expect(asignarRol("juan.admin@gmail.com")).toBe("administrador");
    expect(asignarRol("ventas.vendedor@duoc.cl")).toBe("vendedor");
    expect(asignarRol("cliente@gmail.com")).toBe("cliente");
  });

  it("validarCorreo solo admite los dominios permitidos", () => {
    expect(validarCorreo("a@duoc.cl")).toBeTrue();
    expect(validarCorreo("a@profesor.duoc.cl")).toBeTrue();
    expect(validarCorreo("a@hotmail.com")).toBeFalse();
  });

  it("validarRegistro entrega un error por cada campo inválido", () => {
    const r = validarRegistro({ nombre: "", run: "1", correo: "x", password: "1", region: "", comuna: "" });
    expect(r.esValido).toBeFalse();
    expect(Object.keys(r.errores).sort()).toEqual(
      ["comuna", "correo", "nombre", "password", "region", "run"]
    );
  });

  it("validarPago aprueba datos correctos y marca los incorrectos", () => {
    const ok = validarPago(
      { nombre: "Ana Pérez", run: "19011022K", direccion: "Av. Providencia 123",
        tarjeta: "1234 5678 1234 5678", vencimiento: "12/30", cvv: "123" }, hoy);
    expect(ok.esValido).toBeTrue();
    const mal = validarPago({ nombre: "", run: "", direccion: "", tarjeta: "", vencimiento: "", cvv: "" }, hoy);
    expect(Object.keys(mal.errores).length).toBe(6);
  });

  it("storage: guardar y leer JSON, con valor por defecto si no existe o está corrupto", () => {
    guardarStorage("test_clave", { a: 1 });
    expect(leerStorage("test_clave", null)).toEqual({ a: 1 });
    window.localStorage.setItem("test_corrupto", "{no-json");
    expect(leerStorage("test_corrupto", "defecto")).toBe("defecto");
    expect(leerStorage("no_existe", 5)).toBe(5);
    window.localStorage.removeItem("test_clave");
    window.localStorage.removeItem("test_corrupto");
  });
});
