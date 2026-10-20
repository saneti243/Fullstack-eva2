import React from "react";
import { Link } from "react-router-dom";
import { BLOGS } from "../data/blogsData";

export default function Blogs() {
  return (
    <div className="container py-4">
      <h2 className="text-center mb-2">Noticias y Datos Curiosos</h2>
      <p className="text-center text-muted mb-4">Entérate de las últimas novedades de nuestra tienda.</p>
      <div className="row g-4 justify-content-center">
        {BLOGS.map((b) => (
          <div key={b.id} className="col-12 col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm p-3">
              <h5>{b.resumenTitulo}</h5>
              <p className="text-muted small flex-grow-1">{b.resumen}</p>
              <Link to={`/blogs/${b.id}`} className="btn btn-primary" data-testid={`blog-leer-${b.id}`}>
                Leer más
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
