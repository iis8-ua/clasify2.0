import { useEffect, useRef } from 'react'

export default function ConfirmarBorrado({ anuncio, eliminando, error, onConfirmar, onCancelar }) {
  const cancelarRef = useRef(null)

  useEffect(() => {
    cancelarRef.current?.focus()
  }, [])

  function alPulsarTecla(event) {
    if (event.key === 'Escape' && !eliminando) {
      onCancelar()
    }
  }

  return (
    <div className="confirmacion-fondo">
      <div
        className="confirmacion"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmar-titulo"
        onKeyDown={alPulsarTecla}
      >
        <h2 id="confirmar-titulo">Eliminar anuncio</h2>
        <p>
          ¿Seguro que quieres eliminar <strong>{anuncio.titulo}</strong>? Esta acción no se puede
          deshacer.
        </p>

        {error ? (
          <p className="mensaje-error" role="alert">
            {error}
          </p>
        ) : null}

        <div className="confirmacion__acciones">
          <button
            ref={cancelarRef}
            type="button"
            className="button button--secondary"
            onClick={onCancelar}
            disabled={eliminando}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="button button--danger"
            onClick={onConfirmar}
            disabled={eliminando}
          >
            {eliminando ? 'Eliminando…' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  )
}
