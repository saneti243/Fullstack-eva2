import React from "react";

export default function Nosotros() {
  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Sobre Nosotros - Tienda67</h2>
      <p className="text-center text-muted mb-5">
        Somos una tienda online enfocada en tecnología, calzado urbano, libros y artículos exclusivos.
      </p>
      <div className="row justify-content-center g-4">
        <div className="col-12 col-sm-6 col-md-4 text-center">
          <div className="card p-3 shadow-sm h-100">
            <img
              src="/images/arturo.jpg"
              alt="Arturo"
              className="rounded-circle mx-auto mb-3"
              width="140"
              height="140"
              style={{ objectFit: "cover" }}
            />
            <h5>Arturo Cabello</h5>
            <p className="text-muted small">Desarrollador Fullstack</p>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-4 text-center">
          <div className="card p-3 shadow-sm h-100">
            <img
              src="/images/augusto.jpg"
              alt="Augusto"
              className="rounded-circle mx-auto mb-3"
              width="140"
              height="140"
              style={{ objectFit: "cover" }}
            />
            <h5>Augusto</h5>
            <p className="text-muted small">Desarrollador Fullstack</p>
          </div>
        </div>
      </div>
    </div>
  );
}