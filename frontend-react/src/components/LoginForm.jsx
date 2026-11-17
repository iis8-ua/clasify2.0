import { useState } from 'react'

export default function LoginForm({ onLogin, cargando, error }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorLocal, setErrorLocal] = useState('')

  async function enviar(event) {
    event.preventDefault()
    const emailLimpio = email.trim()

    if (!emailLimpio) {
      setErrorLocal('El email es obligatorio.')
      return
    }
    if (!/^\S+@\S+\.\S+$/.test(emailLimpio)) {
      setErrorLocal('El email no tiene un formato válido.')
      return
    }
    if (!password) {
      setErrorLocal('La contraseña es obligatoria.')
      return
    }

    setErrorLocal('')
    await onLogin({ email: emailLimpio, password })
  }

  const mensajeError = errorLocal || error

  return (
    <section className="panel" aria-labelledby="titulo-login">
      <h2 id="titulo-login">Iniciar sesión</h2>
      <p className="texto-ayuda">Accede para poder eliminar tus propios anuncios.</p>

      <form className="formulario" onSubmit={enviar} noValidate>
        <div className="campo">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              setErrorLocal('')
            }}
            aria-invalid={Boolean(mensajeError)}
            aria-describedby={mensajeError ? 'login-error' : undefined}
          />
        </div>

        <div className="campo">
          <label htmlFor="login-password">Contraseña</label>
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
              setErrorLocal('')
            }}
            aria-invalid={Boolean(mensajeError)}
            aria-describedby={mensajeError ? 'login-error' : undefined}
          />
        </div>

        {mensajeError ? (
          <p id="login-error" className="mensaje-error" role="alert">
            {mensajeError}
          </p>
        ) : null}

        <button type="submit" className="button" disabled={cargando}>
          {cargando ? 'Iniciando sesión…' : 'Iniciar sesión'}
        </button>
      </form>
    </section>
  )
}
