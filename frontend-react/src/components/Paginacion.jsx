export default function Paginacion({ pagina, paginas, onCambiar }) {
  if (paginas <= 0) {
    return null
  }

  return (
    <nav className="paginacion" aria-label="Paginación de anuncios">
      <button
        type="button"
        className="button button--secondary"
        disabled={pagina <= 1}
        onClick={() => onCambiar(pagina - 1)}
      >
        Anterior
      </button>
      <span aria-live="polite">
        Página {pagina} de {paginas}
      </span>
      <button
        type="button"
        className="button button--secondary"
        disabled={pagina >= paginas}
        onClick={() => onCambiar(pagina + 1)}
      >
        Siguiente
      </button>
    </nav>
  )
}
