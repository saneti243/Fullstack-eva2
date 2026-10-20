import React from "react";
import { Link, useParams } from "react-router-dom";
import { BLOGS } from "../data/blogsData";

export default function DetalleBlog() {
  const { id } = useParams();
  const blog = BLOGS.find((b) => b.id === Number(id));

  if (!blog) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning" data-testid="blog-no-encontrado">Artículo no encontrado.</div>
        <Link to="/blogs" className="btn btn-secondary">Volver a los blogs</Link>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: 800 }}>
      <div className="card shadow-sm p-4">
        <h1 className="h3 mb-2" data-testid="blog-titulo">{blog.titulo}</h1>
        <p className="text-muted small">Publicado el {blog.fecha}</p>
        {blog.parrafos.map((p, i) => (
          <p key={i} style={{ lineHeight: 1.8 }}>{p}</p>
        ))}
        <Link to="/blogs" className="btn btn-secondary align-self-start">Volver a los blogs</Link>
      </div>
    </div>
  );
}
