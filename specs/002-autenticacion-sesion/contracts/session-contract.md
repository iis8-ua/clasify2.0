# Session Contract: Sesión de presentación

**Feature**: `002-autenticacion-sesion`  
**Date**: 2026-11-10

## 1. Storage

| Aspecto | Valor |
|---|---|
| Mecanismo | `sessionStorage` |
| Clave | `clasify.session.token` |
| Contenido | Solo el token |
| Usuario | En memoria, nunca persistido |
| Contraseña | Nunca persistida |
| Sincronización entre pestañas | No incluida |

Rules:

- Un token ausente implica visitante.
- Un token presente se comprueba con `/auth/yo` antes de considerarse sesión válida.
- El token se elimina al cerrar sesión.
- No se usa `localStorage`.

## 2. Session Store

`useSessionStore` es la única fuente de sesión del frontend.

State:

| Campo | Tipo | Meaning |
|---|---|---|
| `token` | string \| null | Token actual |
| `usuario` | `UsuarioSesion` \| null | Identidad en memoria |
| `estado` | `inicial` \| `comprobando` \| `autenticado` \| `visitante` \| `error` | Estado de sesión |
| `error` | `ErrorAutenticacion` \| null | Último error de sesión |
| `sessionVersion` | number | Cambia al iniciar y cerrar sesión |

Getters:

| Getter | Tipo | Meaning |
|---|---|---|
| `estaAutenticado` | boolean | `estado === "autenticado"` |
| `estaComprobando` | boolean | `estado === "comprobando"` |
| `puedeCrear` | boolean | Derivado de `estaAutenticado` |
| `nombreVisible` | string \| null | Nombre para la cabecera |

Actions:

| Action | Responsibility |
|---|---|
| `registrar(datos)` | Crear cuenta, guardar token y usuario, pasar a autenticado |
| `iniciarSesion(credenciales)` | Acceder, guardar token y usuario, pasar a autenticado |
| `restaurarSesion()` | Si hay token, comprobar `/auth/yo`; resolver autenticado, visitante o error |
| `cerrarSesion()` | Borrar token, usuario y datos privados; pasar a visitante |
| `establecerSesion(token, usuario)` | Guardar una sesión recibida del backend |
| `limpiarSesion()` | Limpiar estado y almacenamiento sin navegar |
| `reintentarRestauracion()` | Volver a comprobar el token tras un error de red |

Rules:

- `registrar` y `iniciarSesion` no escriben el usuario en `sessionStorage`.
- `cerrarSesion` incrementa `sessionVersion`.
- `establecerSesion` incrementa `sessionVersion`.
- Una sesión inválida limpia token, usuario y datos privados.
- Un error de red durante la restauración conserva el token y ofrece reintento.

## 3. Session Transitions

```text
inicial
  -> comprobando          (token presente)
  -> visitante            (sin token)

comprobando
  -> autenticado          (usuario recuperado)
  -> visitante            (sesión inválida)
  -> error                (fallo de conexión)

visitante
  -> comprobando          (registro o acceso en curso)
  -> autenticado          (respuesta correcta)

autenticado
  -> visitante            (logout o sesión inválida)

error
  -> comprobando          (reintento)
```

Rules:

- `comprobando` no habilita acciones privadas.
- `error` no se considera autenticado.
- `visitante` no conserva datos privados.
- `autenticado` actualiza la cabecera y las guardas.

## 4. HTTP Integration

The HTTP layer from 001 provides:

```text
configureHttp({
  baseUrl,
  getToken,
  onUnauthorized
})
```

Rules:

- `getToken` devuelve el token actual de la store.
- `onUnauthorized` recibe el error normalizado.
- La store limpia la sesión solo para códigos de sesión: `SIN_TOKEN`, `TOKEN_INVALIDO`,
  `TOKEN_CADUCADO` y `USUARIO_NO_EXISTE`.
- `CREDENCIALES_INVALIDAS` de login o de contraseña actual no limpia la sesión; se muestra como
  error de formulario.
- La capa HTTP no conoce la store de sesión.

## 5. Router Guards

| Route type | Behavior |
|---|---|
| Pública | Se permite siempre |
| Protegida sin sesión | Redirige a `/login` con la ruta solicitada |
| Protegida con sesión | Se permite |
| `/login` con sesión | Redirige a `/` |
| `/registro` con sesión | Redirige a `/` |
| `/login` sin sesión | Se permite |
| `/registro` sin sesión | Se permite |

Rules:

- La ruta solicitada se conserva en el parámetro `redirect`.
- Tras el acceso, se vuelve a `redirect` si es una ruta interna válida; si no, a `/`.
- Las guardas no sustituyen la autorización del backend.
- Mientras la sesión está en `comprobando`, no se muestra contenido protegido.

## 6. Header Integration

La cabecera de 001 consume:

| Value | Meaning |
|---|---|
| `estaAutenticado` | Mostrar identidad y acciones privadas |
| `nombreVisible` | Nombre mostrado |
| `puedeCrear` | Mostrar la acción principal de creación |
| `estaComprobando` | Mostrar estado de comprobación si procede |

Rules:

- Sin sesión: se muestran acceso y registro; no se muestra la acción de creación.
- Con sesión: se muestran favoritos, perfil y creación; se oculta el acceso.
- La cabecera se actualiza sin recargar después de registro, acceso o logout.

## 7. Private Data Cleanup

- `sessionVersion` es el contrato de limpieza para stores privadas de specs posteriores.
- Las stores de datos privados deben observar `sessionVersion` o `estaAutenticado` y vaciar su estado
  cuando la sesión pase a visitante.
- La store de sesión no importa stores de otras features para evitar acoplamientos y ciclos.
- El logout de la pestaña actual no limpia otras pestañas.

## 8. Forms

| Form | Fields | Rules |
|---|---|---|
| Acceso | `email`, `password` | Obligatorios; email válido; errores por campo; bloqueo de doble envío |
| Registro | `email`, `nombre`, `password` | Obligatorios; email válido; nombre máximo 100; contraseña mínimo 8; errores por campo |

Rules:

- Las contraseñas no se muestran después del envío.
- El email se conserva ante un error de conexión.
- El mensaje de credenciales incorrectas es general.
- Los formularios son accesibles con teclado y a 360 px.
- Un fallo de conexión no inventa una sesión válida.

## 9. Out of Scope

- Refresh tokens.
- Logout en servidor.
- Lista negra de tokens.
- Recuperación de contraseña.
- Verificación de email.
- Proveedores externos.
- Perfil público.
- Sincronización de sesión entre pestañas o dispositivos.
- Edición de perfil y cambio de contraseña.
