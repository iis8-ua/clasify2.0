import { useEffect, useRef, useState } from 'react'
import { authService } from '../../shared/api/authService.js'
import { anunciosService } from '../../shared/api/anunciosService.js'
import { categoriasService } from '../../shared/api/categoriasService.js'
import { esErrorDeSesion } from '../../shared/api/errors.js'
import LoginForm from './components/LoginForm'
import ListaAnuncios from './components/ListaAnuncios'
import Paginacion from './components/Paginacion'
import EstadoListado from './components/EstadoListado'
import ConfirmarBorrado from './components/ConfirmarBorrado'
import { borrarToken, guardarToken, leerToken } from './services/sesion'

const PAGINACION_INICIAL = { pagina: 1, limite: 20, total: 0, paginas: 0 }

export default function App() {
  const [token, setToken] = useState(() => leerToken())
  const [usuario, setUsuario] = useState(null)
  const [comprobandoSesion, setComprobandoSesion] = useState(Boolean(leerToken()))
  const [errorSesion, setErrorSesion] = useState('')
  const [motivoSesion, setMotivoSesion] = useState('')
  const [autenticando, setAutenticando] = useState(false)
  const [errorLogin, setErrorLogin] = useState('')
  const [pagina, setPagina] = useState(1)
  const [recarga, setRecarga] = useState(0)
  const [anuncios, setAnuncios] = useState([])
  const [paginacion, setPaginacion] = useState(PAGINACION_INICIAL)
  const [estadoListado, setEstadoListado] = useState('loading')
  const [errorListado, setErrorListado] = useState('')
  const [categorias, setCategorias] = useState({})
  const [confirmacion, setConfirmacion] = useState(null)
  const [eliminando, setEliminando] = useState(false)
  const [errorBorrado, setErrorBorrado] = useState('')
  const [mensajeExito, setMensajeExito] = useState('')
  const focoBorrado = useRef(null)

  async function recuperarSesion() {
    if (!token) {
      setComprobandoSesion(false)
      return
    }

    setComprobandoSesion(true)
    setErrorSesion('')

    try {
      const usuarioActual = await authService.obtenerUsuarioActual()
      setUsuario(usuarioActual)
      setMotivoSesion('')
    } catch (error) {
      if (esErrorDeSesion(error.codigo)) {
        borrarToken()
        setToken(null)
        setUsuario(null)
        setMotivoSesion('Tu sesión ha caducado. Inicia sesión de nuevo.')
      } else {
        setErrorSesion('No se pudo comprobar la sesión.')
      }
    } finally {
      setComprobandoSesion(false)
    }
  }

  useEffect(() => {
    recuperarSesion()
  }, [token])

  useEffect(() => {
    function manejarSesionCaducada() {
      borrarToken()
      setToken(null)
      setUsuario(null)
      setMotivoSesion('Tu sesión ha caducado. Inicia sesión de nuevo.')
      setConfirmacion(null)
      setErrorBorrado('')
    }

    window.addEventListener('clasify:unauthorized', manejarSesionCaducada)
    return () => window.removeEventListener('clasify:unauthorized', manejarSesionCaducada)
  }, [])

  useEffect(() => {
    let activo = true

    async function cargarCategorias() {
      try {
        const mapa = {}
        let paginaCategorias = 1
        let paginasCategorias = 1

        do {
          const respuesta = await categoriasService.listar({
            pagina: paginaCategorias,
            limite: 100
          })
          respuesta.datos.forEach((categoria) => {
            mapa[categoria.id] = categoria.nombre
          })
          paginasCategorias = respuesta.paginacion.paginas
          paginaCategorias += 1
        } while (paginaCategorias <= paginasCategorias)

        if (activo) {
          setCategorias(mapa)
        }
      } catch {
        if (activo) {
          setCategorias({})
        }
      }
    }

    cargarCategorias()
    return () => {
      activo = false
    }
  }, [])

  useEffect(() => {
    let activo = true

    async function cargarListado() {
      setEstadoListado('loading')
      setErrorListado('')

      try {
        const respuesta = await anunciosService.listar({ pagina, limite: 20 })
        if (!activo) {
          return
        }

        if (pagina > 1 && respuesta.paginacion.paginas < pagina) {
          setPagina(respuesta.paginacion.paginas > 0 ? respuesta.paginacion.paginas : 1)
          return
        }

        setAnuncios(respuesta.datos)
        setPaginacion(respuesta.paginacion)
        setEstadoListado(respuesta.datos.length === 0 ? 'empty' : 'success')
      } catch (error) {
        if (!activo) {
          return
        }
        setErrorListado(error.mensaje ?? 'No se pudieron cargar los anuncios.')
        setEstadoListado('error')
      }
    }

    cargarListado()
    return () => {
      activo = false
    }
  }, [pagina, recarga])

  async function iniciarSesion(credenciales) {
    setAutenticando(true)
    setErrorLogin('')

    try {
      const sesion = await authService.iniciarSesion(credenciales)
      guardarToken(sesion.token)
      setToken(sesion.token)
      setUsuario(sesion.usuario)
      setMotivoSesion('')
      setErrorSesion('')
    } catch (error) {
      setErrorLogin(error.mensaje ?? 'No se pudo iniciar sesión.')
    } finally {
      setAutenticando(false)
    }
  }

  function cerrarSesion() {
    borrarToken()
    setToken(null)
    setUsuario(null)
    setErrorLogin('')
    setErrorSesion('')
    setMotivoSesion('')
    setConfirmacion(null)
    setErrorBorrado('')
  }

  function cambiarPagina(nuevaPagina) {
    setMensajeExito('')
    setPagina(nuevaPagina)
  }

  function solicitarBorrado(anuncio, event) {
    focoBorrado.current = event?.currentTarget ?? null
    setErrorBorrado('')
    setMensajeExito('')
    setConfirmacion(anuncio)
  }

  function cancelarBorrado() {
    setConfirmacion(null)
    setErrorBorrado('')
    requestAnimationFrame(() => focoBorrado.current?.focus())
  }

  async function confirmarBorrado() {
    if (!confirmacion || eliminando) {
      return
    }

    setEliminando(true)
    setErrorBorrado('')

    try {
      await anunciosService.eliminar(confirmacion.id)
      setConfirmacion(null)
      setMensajeExito('Anuncio eliminado correctamente.')
      setRecarga((valor) => valor + 1)
      requestAnimationFrame(() => document.getElementById('titulo-anuncios')?.focus())
    } catch (error) {
      if (error.estado === 404) {
        setConfirmacion(null)
        setMensajeExito('El anuncio ya no existe.')
        setRecarga((valor) => valor + 1)
      } else {
        setErrorBorrado(error.mensaje ?? 'No se pudo eliminar el anuncio.')
      }
    } finally {
      setEliminando(false)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <a className="marca" href="/">
          Clasify React
        </a>
        <div className="sesion">
          {comprobandoSesion ? (
            <span>Comprobando sesión…</span>
          ) : usuario ? (
            <>
              <span>Hola, {usuario.nombre}</span>
              <button type="button" className="button button--secondary" onClick={cerrarSesion}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <span>Estás como visitante</span>
          )}
        </div>
      </header>

      <main className="contenido">
        {motivoSesion ? (
          <p className="aviso" role="status">
            {motivoSesion}
          </p>
        ) : null}

        {errorSesion ? (
          <div className="aviso aviso--error" role="alert">
            <p>{errorSesion}</p>
            <button type="button" className="button button--secondary" onClick={recuperarSesion}>
              Reintentar
            </button>
          </div>
        ) : null}

        {!comprobandoSesion && !usuario ? (
          <LoginForm onLogin={iniciarSesion} cargando={autenticando} error={errorLogin} />
        ) : null}

        <section className="listado" aria-labelledby="titulo-anuncios">
          <h1 id="titulo-anuncios" tabIndex="-1">
            Anuncios
          </h1>

          <EstadoListado
            estado={estadoListado}
            error={errorListado}
            onReintentar={() => setRecarga((valor) => valor + 1)}
          />

          {estadoListado === 'success' ? (
            <>
              <ListaAnuncios
                anuncios={anuncios}
                usuario={usuario}
                categorias={categorias}
                onSolicitarBorrado={solicitarBorrado}
              />
              <Paginacion
                pagina={paginacion.pagina}
                paginas={paginacion.paginas}
                onCambiar={cambiarPagina}
              />
            </>
          ) : null}

          {mensajeExito ? (
            <p className="aviso aviso--exito" role="status">
              {mensajeExito}
            </p>
          ) : null}
        </section>
      </main>

      {confirmacion ? (
        <ConfirmarBorrado
          anuncio={confirmacion}
          eliminando={eliminando}
          error={errorBorrado}
          onConfirmar={confirmarBorrado}
          onCancelar={cancelarBorrado}
        />
      ) : null}
    </div>
  )
}
