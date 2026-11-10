# UI Contracts: Estructura común y navegación

**Feature**: `001-app-shell`  
**Date**: 2026-11-10

## 1. Route Contract

| Path | Name | Access | Title | View |
|---|---|---|---|---|
| `/` | `anuncios` | Pública | Anuncios | Sustitución |
| `/anuncios/:id` | `anuncio-detalle` | Pública | Detalle del anuncio | Sustitución |
| `/login` | `login` | Pública; redirige con sesión | Iniciar sesión | Sustitución |
| `/registro` | `registro` | Pública; redirige con sesión | Crear cuenta | Sustitución |
| `/anuncios/nuevo` | `anuncio-crear` | Protegida | Publicar anuncio | Sustitución |
| `/anuncios/:id/editar` | `anuncio-editar` | Protegida | Editar anuncio | Sustitución |
| `/favoritos` | `favoritos` | Protegida | Favoritos | Sustitución |
| `/perfil` | `perfil` | Protegida | Mi perfil | Sustitución |
| `/:pathMatch(.*)*` | `no-encontrado` | Pública | Página no encontrada | 404 |

Rules:

- `/anuncios/nuevo` se declara antes de `/anuncios/:id`.
- `name` es único y estable.
- Las rutas protegidas solicitan acceso y conservan la ruta solicitada.
- Las rutas de acceso y registro redirigen a una vista principal si ya hay sesión.
- La ruta catch-all se declara al final.
- Las vistas de sustitución muestran un estado claro, nunca una pantalla rota.

## 2. Navigation Contract

| Label | Route name | Visibility | Primary |
|---|---|---|---|
| Anuncios | `anuncios` | Pública | No |
| Favoritos | `favoritos` | Autenticada | No |
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

Inputs:

| Input | Type | Required | Meaning |
|---|---|---|---|
| `session` | `SessionSnapshot` | Sí | Estado de sesión de presentación |
| `navigation` | `NavigationItem[]` | Sí | Entradas visibles |
| `currentRouteName` | string \| null | No | Ruta activa |

Emits:

| Event | Payload | Meaning |
|---|---|---|
| `navigate` | `routeName` | Solicitud de navegación |
| `login` | — | Abrir acceso |
| `register` | — | Abrir registro |
| `create` | — | Abrir creación |
| `logout` | — | Solicitar cierre de sesión |

Rules:

- El componente no conoce el mecanismo de autenticación ni el backend.
- El cierre de sesión se delega en la store de sesión de la spec 002.
- La cabecera no muestra datos privados de otras cuentas.

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

- Solo existe un tema claro.
- No se definen tokens de modo oscuro.
- El color de acento no sustituye los colores semánticos de error, éxito y advertencia.
- Los contrastes deben ser legibles.

## 8. Out of Scope

- Formularios de acceso, registro, creación, edición, eliminación o perfil.
- Listado, detalle, favoritos o perfil con datos reales.
- Lógica de negocio.
- Llamadas HTTP a endpoints concretos.
- Modo oscuro.
- Selector de tamaño de página.
