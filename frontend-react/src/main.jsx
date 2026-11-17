import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { configurarHttp } from '../../shared/api/http.js'
import { esErrorDeSesion } from '../../shared/api/errors.js'
import { borrarToken, leerToken } from './services/sesion.js'
import './styles.css'

const apiUrl = import.meta.env.VITE_API_URL

if (!apiUrl) {
  throw new Error('Falta VITE_API_URL. Copia frontend-react/.env.example a frontend-react/.env')
}

if (!apiUrl.includes('/clasify_api')) {
  throw new Error('VITE_API_URL debe incluir la ruta /clasify_api')
}

configurarHttp({
  baseUrl: apiUrl,
  getToken: () => leerToken(),
  onUnauthorized: (error) => {
    if (!esErrorDeSesion(error.codigo)) {
      return
    }
    borrarToken()
    window.dispatchEvent(new Event('clasify:unauthorized'))
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
