import AnuncioItem from './AnuncioItem'

export default function ListaAnuncios({ anuncios, usuario, categorias, onSolicitarBorrado }) {
  return (
    <ul className="anuncios-lista">
      {anuncios.map((anuncio) => (
        <li key={anuncio.id}>
          <AnuncioItem
            anuncio={anuncio}
            usuario={usuario}
            categorias={categorias}
            onSolicitarBorrado={onSolicitarBorrado}
          />
        </li>
      ))}
    </ul>
  )
}
