const TOKEN_KEY = 'clasify.react.token'

export function leerToken() {
  if (typeof window === 'undefined') {
    return null
  }
  return window.sessionStorage.getItem(TOKEN_KEY)
}

export function guardarToken(token) {
  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem(TOKEN_KEY, token)
  }
}

export function borrarToken() {
  if (typeof window !== 'undefined') {
    window.sessionStorage.removeItem(TOKEN_KEY)
  }
}
