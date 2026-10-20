import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import Productos from "../pages/Productos";
import Carrito from "../pages/Carrito";
import Registro from "../pages/Registro";
import {
  validarCorreo,
  validarProductoNuevo,
  calcularTotalCarrito
} from "../utils/validaciones";

describe("Suite de Pruebas Unitarias - Tienda67 (10 Pruebas)", () => {
  const productoMock = {
    id: 1,
    nombre: "Audífonos In-Ear Pro",
    categoria: "Tecnología",
    precio: 19990,
    imagen: "/images/audifonos.jpg",
    descripcion: "Audífonos de alta fidelidad"
  };

  it("1. Debe renderizar correctamente el nombre y precio del producto recibido por props en ProductCard", () => {
    const { getByTestId } = render(
      <ProductCard producto={productoMock} onAgregar={() => {}} />
    );
    expect(getByTestId("product-title").textContent).toBe("Audífonos In-Ear Pro");
    expect(getByTestId("product-price").textContent).toContain("19.990");
  });

  it("2. Debe ejecutar la función callback (Mock Spy) con el producto correcto al hacer clic en 'Agregar al carrito'", () => {
    const onAgregarSpy = jasmine.createSpy("onAgregarSpy");
    const { getByTestId } = render(
      <ProductCard producto={productoMock} onAgregar={onAgregarSpy} />
    );

    fireEvent.click(getByTestId("btn-add-1"));
    expect(onAgregarSpy).toHaveBeenCalledTimes(1);
    expect(onAgregarSpy).toHaveBeenCalledWith(productoMock);
  });


  it("3. Debe mostrar en el badge del Navbar la cantidad exacta de productos recibida por props", () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <Navbar totalItems={5} />
      </MemoryRouter>
    );
    expect(getByTestId("cart-badge").textContent).toBe("5");
  });

  it("4. Debe filtrar los productos en el DOM cuando el usuario escribe en la barra de búsqueda", () => {
    const listaMock = [
      productoMock,
      {
        id: 2,
        nombre: "Zapatillas Retro 1",
        categoria: "Calzado",
        precio: 89990,
        imagen: "/images/retro 1.jpg",
        descripcion: "Calzado urbano"
      }
    ];

    const { getByTestId, queryByText } = render(
      <Productos productos={listaMock} onAgregarAlCarrito={() => {}} />
    );

    const inputBusqueda = getByTestId("search-input");
    fireEvent.change(inputBusqueda, { target: { value: "Zapatillas" } });

    expect(queryByText("Zapatillas Retro 1")).not.toBeNull();
    expect(queryByText("Audífonos In-Ear Pro")).toBeNull();
  });

  it("5. Debe mostrar un mensaje de alerta cuando el carrito está vacío", () => {
    const { getByTestId } = render(
      <Carrito
        carrito={[]}
        onEliminar={() => {}}
        onVaciar={() => {}}
        onCambiarCantidad={() => {}}
      />
    );
    expect(getByTestId("empty-cart-msg").textContent).toContain(
      "El carrito está vacío"
    );
  });

  it("6. Debe calcular y mostrar correctamente el monto total del carrito con múltiples productos", () => {
    const carritoMock = [
      { id: 1, nombre: "Audífonos", precio: 10000, cantidad: 2 },
      { id: 2, nombre: "Libro Verity", precio: 15000, cantidad: 1 }
    ];

    const { getByTestId } = render(
      <Carrito
        carrito={carritoMock}
        onEliminar={() => {}}
        onVaciar={() => {}}
        onCambiarCantidad={() => {}}
      />
    );

    expect(calcularTotalCarrito(carritoMock)).toBe(35000);
    expect(getByTestId("cart-total").textContent).toContain("35.000");
  });

  it("7. Debe llamar al Mock onEliminar con el ID del producto cuando se presiona el botón Eliminar", () => {
    const onEliminarSpy = jasmine.createSpy("onEliminarSpy");
    const carritoMock = [
      { id: 99, nombre: "Edición Requiem", precio: 29990, cantidad: 1 }
    ];

    const { getByTestId } = render(
      <Carrito
        carrito={carritoMock}
        onEliminar={onEliminarSpy}
        onVaciar={() => {}}
        onCambiarCantidad={() => {}}
      />
    );

    fireEvent.click(getByTestId("btn-remove-99"));
    expect(onEliminarSpy).toHaveBeenCalledWith(99);
  });

  it("8. Debe mostrar un mensaje de error en el DOM si se intenta registrar un correo con dominio inválido", () => {
    const { getByTestId } = render(<Registro />);

    fireEvent.change(getByTestId("input-nombre"), {
      target: { value: "Arturo Cabello" }
    });
    fireEvent.change(getByTestId("input-correo"), {
      target: { value: "arturo@dominiofalso.com" }
    });
    fireEvent.change(getByTestId("input-password"), {
      target: { value: "123456" }
    });

    fireEvent.click(getByTestId("btn-submit-registro"));

    expect(getByTestId("form-error").textContent).toContain(
      "Ingrese un correo válido"
    );
  });

  it("9. Debe invocar el Mock onRegistrarUsuario y mostrar mensaje de éxito cuando los datos son válidos", () => {
    const registroSpy = jasmine.createSpy("registroSpy");
    const { getByTestId } = render(
      <Registro onRegistrarUsuario={registroSpy} />
    );

    fireEvent.change(getByTestId("input-nombre"), {
      target: { value: "Arturo Cabello" }
    });
    fireEvent.change(getByTestId("input-correo"), {
      target: { value: "arturo@duoc.cl" }
    });
    fireEvent.change(getByTestId("input-password"), {
      target: { value: "secreto123" }
    });

    fireEvent.click(getByTestId("btn-submit-registro"));

    expect(registroSpy).toHaveBeenCalledWith({
      nombre: "Arturo Cabello",
      correo: "arturo@duoc.cl"
    });
    expect(getByTestId("form-success").textContent).toContain(
      "¡Usuario registrado exitosamente!"
    );
  });

  it("10. Debe validar la creación de un producto nuevo y simular el guardado en localStorage mediante spyOn", () => {
    spyOn(window.localStorage, "setItem");

    const nuevoProd = {
      nombre: "Sábanas King",
      precio: 24990,
      categoria: "Hogar"
    };
    const resultado = validarProductoNuevo(nuevoProd);

    expect(resultado.esValido).toBeTrue();
    window.localStorage.setItem("nuevo_producto", JSON.stringify(nuevoProd));
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "nuevo_producto",
      JSON.stringify(nuevoProd)
    );
  });
});