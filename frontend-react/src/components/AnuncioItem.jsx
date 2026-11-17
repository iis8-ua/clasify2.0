import { useState } from 'react'
import { urlImagen } from '../services/media'

function formatearPrecio(valor) {
  const numero = Number(valor)
  if (!Number.isFinite(numero)) {
    return String(valor ?? '')
  }
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(numero)
}

function formatearFecha(valor) {
  if (!valor) {
    return ''
  }
  const fecha = new Date(valor)
  if (Number.isNaN(fecha.getTime())) {
    return ''
  }
  return new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium' }).format(fecha)
}

export default function AnuncioItem({ anuncio, usuario, categorias, onSolicitarBorrado }) {
  const [imagenFallida, setImagenFallida] = useState(false)
  const imagen = imagenFallida ? null : urlImagen(anuncio.imagen)
  const esPropio = Boolean(usuario && anuncio.id_autor === usuario.id)
  const categoria = categorias[anuncio.id_categoria] ?? 'Categoría no disponible'
  const estado = anuncio.estado === 'vendido' ? 'Vendido' : 'Disponible'
  const fecha = formatearFecha(anuncio.fecha_creacion)

  return (
    <article className="anuncio-card">
      <div className="anuncio-card__media">
        {imagen ? (
          <img
            src={imagen}
            alt={`Imagen de ${anuncio.titulo}`}
            loading="lazy"
            onError={() => setImagenFallida(true)}
          />
        ) : (
          <div className="anuncio-card__sin-imagen" role="img" aria-label="Imagen no disponible">
            Sin imagen
          </div>
        )}
      </div>

      <div className="anuncio-card__contenido">
        <h2 className="anuncio-card__titulo">{anuncio.titulo}</h2>
        <p className="anuncio-card__precio">{formatearPrecio(anuncio.precio)}</p>
        <p className="anuncio-card__meta">{categoria}</p>
        <p className="anuncio-card__meta">
          <span className={`badge badge--${anuncio.estado}`}>{estado}</span>
          {fecha ? (
            <time dateTime={anuncio.fecha_creacion}>{fecha}</time>
          ) : null}
        </p>

        {esPropio ? (
          <button
            id={`borrar-${anuncio.id}`}
            type="button"
            className="button button--danger"
            aria-label={`Eliminar ${anuncio.titulo}`}
            onClick={(event) => onSolicitarBorrado(anuncio, event)}
          >
            Eliminar
          </button>
        ) : null}
      </div>
    </article>
  )
}
