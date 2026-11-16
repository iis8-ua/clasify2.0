export default function EstadoListado({ estado, error, onReintentar }) {
  if (estado === 'loading') {
    return (
      <p className="estado" role="status">
        Cargando anuncios…
      </p>
    )
  }

  if (estado === 'empty') {
    return (
      <p className="estado" role="status">
        No hay anuncios disponibles.
      </p>
    )
  }

  if (estado === 'error') {
    return (
      <div className="estado estado--error" role="alert">
        <p>{error || 'No se pudieron cargar los anuncios.'}</p>
        <button type="button" className="button button--secondary" onClick={onReintentar}>
          Reintentar
        </button>
      </div>
    )
  }

  return null
}
