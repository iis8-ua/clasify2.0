# UI Contracts: Estructura común y navegación

**Feature**: `001-app-shell`  
**Date**: 2026-11-10

## 1. Route Contract

| Path | Name | Access | Title | View |
|---|---|---|---|---|
| `/` | `anuncios` | Pública | Anuncios | `AnunciosListView` |
| `/anuncios/:id` | `anuncio-detalle` | Pública | Detalle del anuncio | `AnuncioDetalleView` |
| `/login` | `login` | Pública; redirige con sesión | Iniciar sesión | `LoginView` |
| `/registro` | `registro` | Pública; redirige con sesión | Crear cuenta | `RegisterView` |
| `/anuncios/nuevo` | `anuncio-crear` | Protegida | Publicar anuncio | `AnuncioCrearView` |
| `/anuncios/:id/editar` | `anuncio-editar` | Protegida | Editar anuncio | `AnuncioEditarView` |
| `/favoritos` | `favoritos` | Protegida | Favoritos | `FavoritosView` |
| `/perfil` | `perfil` | Protegida | Mi perfil | `PerfilView` |
| `/usuarios/:id` | `perfil-publico` | Pública | Perfil público | `PerfilPublicoView` |
| `/mensajes` | `mensajes` | Protegida | Mensajes | `MensajesView` |
| `/conversaciones/:id` | `conversacion` | Protegida | Conversación | `ConversacionView` |
| `/:pathMatch(.*)*` | `no-encontrado` | Pública | Página no encontrada | `NotFoundView` |

Rules:

- `/anuncios/nuevo` se declara antes de `/anuncios/:id`.
- `name` es único y estable.
- Las rutas protegidas solicitan acceso y conservan la ruta solicitada.
- Las rutas de acceso y registro redirigen a una vista principal si ya hay sesión.
- La ruta catch-all se declara al final.
- Las vistas reales sustituyen a las vistas de sustitución de las primeras fases.

## 2. Navigation Contract

| Label | Route name | Visibility | Primary |
|---|---|---|---|
| Anuncios | `anuncios` | Pública | No |
| Favoritos | `favoritos` | Autenticada | No |
| Mensajes | `mensajes` | Autenticada | No |
| Perfil | `perfil` | Autenticada | No |
| Publicar anuncio | `anuncio-crear` | Autenticada | Sí |
| Iniciar sesión | `login` | Visitante | No |
| Registrarse | `registro` | Visitante | No |

Rules:

- La cabecera muestra siempre la marca Clasify.
- Las entradas privadas no se muestran a un visitante.
- La acción de creación se muestra solo con sesión.
- La acción activa se identifica visualmente y con un atributo accesible.
- La navegación funciona con teclado y con foco visible.
- No se muestra la acción de favorito en la navegación global.

## 3. Header Contract

`AppHeader` se compone en el shell y consume la store de sesión y el router. Mantiene la
presentación y delega el cierre de sesión en la store de sesión de 002.

Rules:

- La cabecera obtiene el estado de sesión de `useSessionStore()` y resuelve la navegación con
  `RouterLink`; no conoce el backend.
- El cierre de sesión se delega en la store de sesión de la spec 002.
- La cabecera no muestra datos privados de otras cuentas.
- La etiqueta de registro es «Registrarse».
- La cabecera incluye `ThemeToggle`, con nombre accesible que indica el tema actual y la acción.
- `ThemeToggle` delega en `useTemaStore` y no accede al backend.

## 4. Interface State Contract

`StatePanel` represents loading, empty, error, validation, permission and success states.

Inputs:

| Input | Type | Required | Meaning |
|---|---|---|---|
| `type` | `loading` \| `empty` \| `error` \| `validation` \| `permission` \| `success` | Sí | Tipo de estado |
| `title` | string | No | Título breve |
| `message` | string | Sí | Mensaje en español |
| `retryable` | boolean | No | Muestra acción de reintento |
| `actionLabel` | string | No | Texto de la acción |
| `fieldErrors` | object | No | Errores por campo en validación |

Emits:

| Event | Payload | Meaning |
|---|---|---|
| `retry` | — | Reintentar la operación |
| `action` | — | Ejecutar la acción ofrecida |

Rules:

- `empty` y `error` son estados distintos.
- `error` no incluye trazas, códigos internos ni detalles técnicos.
- `validation` asocia cada mensaje al campo correspondiente.
- `loading` no muestra acciones que puedan duplicar una operación.
- `success` es perceptible y no bloquea la interfaz.

## 5. Confirmation Contract

Inputs:

| Input | Type | Required | Meaning |
|---|---|---|---|
| `open` | boolean | Sí | Visibilidad |
| `title` | string | Sí | Título de la confirmación |
| `message` | string | Sí | Consecuencia de la acción |
| `confirmLabel` | string | No | Texto de confirmación |
| `cancelLabel` | string | No | Texto de cancelación |

Emits:

| Event | Payload | Meaning |
|---|---|---|
| `confirm` | — | El usuario confirma |
| `cancel` | — | El usuario cancela |
| `close` | — | Cierre sin ejecutar |

Rules:

- Se puede cerrar con teclado.
- Cancelar nunca ejecuta la acción.
- El foco inicial y el retorno de foco son accesibles.

## 6. Formatting Contract

| Concepto | Regla |
|---|---|
| Precio | `Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' })`; el valor de entrada se trata como decimal |
| Fecha | `Intl.DateTimeFormat('es-ES')`; la fecha se interpreta según el valor recibido del backend |
| Imagen | `VITE_API_URL` + `/uploads/` + nombre de fichero |
| Imagen ausente | Marcador accesible con texto alternativo |
| Texto alternativo | Describe el contenido o indica que no hay imagen |

## 7. Theme Contract

| Token | Uso |
|---|---|
| `primary` | Acciones principales, enlaces y foco |
| `primaryContrast` | Texto sobre color primario |
| `surface` | Fondo principal |
| `surfaceAlt` | Superficies secundarias |
| `text` | Texto principal |
| `textMuted` | Texto secundario |
| `border` | Bordes y separadores |
| `danger` | Errores y acciones destructivas |
| `success` | Confirmaciones |
| `warning` | Advertencias |
| `fontFamily` | Tipografía base |
| `space*` | Escala de espaciado |
| `radius*` | Bordes redondeados |
| `shadow*` | Elevación |
| `maxContentWidth` | Ancho máximo del contenido |
| `headerHeight` | Altura de la cabecera |
| `breakpointMobile` | Punto de corte móvil |

Rules:

- Existen tema claro y tema oscuro, con el claro como valor inicial.
- Los tokens de color, superficie, texto, borde y estados tienen equivalente en ambos temas.
- El tema activo se refleja en un atributo del documento y en `ThemeToggle`.
- La preferencia se guarda en `localStorage` bajo una clave propia; nunca se guardan tokens,
  credenciales ni datos privados.
- Si la preferencia guardada no es válida, se usa el tema claro.
- El color de acento no sustituye los colores semánticos de error, éxito y advertencia.
- Los contrastes deben ser legibles en ambos temas.

## 8. Out of Scope

- Formularios de acceso, registro, creación, edición, eliminación o perfil.
- Listado, detalle, favoritos o perfil con datos reales.
- Lógica de negocio.
- Llamadas HTTP a endpoints concretos.
- Selector de tamaño de página; pertenece a las specs de listados.
