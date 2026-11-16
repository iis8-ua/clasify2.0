# UI Contract: Frontend alternativo con React

**Feature**: `010-frontend-alterno-react`
**Date**: 2026-11-16

## 1. Rutas

| Ruta | Acceso | Vista |
|---|---|---|
| `/` | Pública | `App` |

Rules:

- No se implementa router.
- Login, listado, paginación y confirmación conviven en la misma vista.
- La sesión se conserva al recargar mediante `sessionStorage`.
- No se generan enlaces profundos a anuncios.

## 2. Estructura de la vista

La vista contiene:

- Cabecera con marca `Clasify React`, estado de sesión y acción de acceso o cierre.
- Formulario de acceso cuando no hay sesión o el usuario decide iniciarla.
- Listado de anuncios.
- Controles de paginación.
- Confirmación de borrado cuando se solicita.
- Mensajes de carga, vacío, error y éxito.

Rules:

- La interfaz está en español.
- No se muestran detalles técnicos internos.
- La estructura se mantiene usable a 360 px.
- El foco se mueve a la confirmación al abrirla y vuelve al botón de origen al cerrarla.

## 3. Sesión

### Formulario de acceso

| Campo | Control | Reglas |
|---|---|---|
| `email` | Email | Obligatorio; formato de email |
| `password` | Contraseña | Obligatoria |

States:

- `idle`.
- `autenticando`.
- `error`.

Rules:

- El botón se deshabilita mientras se autentica.
- Un acceso correcto muestra el nombre del usuario.
- Un acceso incorrecto muestra un mensaje comprensible y no deja datos privados.
- El formulario es usable con teclado.
- Los errores están asociados a los campos o se muestran como error general.

### Cabecera autenticada

- Muestra `Hola, <nombre>`.
- Ofrece cerrar sesión.
- Al cerrar sesión se elimina el token y se ocultan las acciones privadas.
- Un `401` limpia la sesión y vuelve al estado de visitante.

## 4. Listado de anuncios

Cada tarjeta muestra:

| Elemento | Regla |
|---|---|
| Imagen | Diferida; marcador accesible si no existe |
| Título | Visible y comprensible |
| Precio | Formateado en español |
| Categoría | Nombre resuelto o texto de respaldo |
| Estado | Disponible o vendido |
| Fecha | Formateada en español |
| Acción de borrar | Solo si el anuncio es del usuario autenticado |

Rules:

- Se muestran 20 anuncios por página.
- Los anuncios ajenos no muestran la acción de borrar.
- Los visitantes no muestran la acción de borrar.
- No hay enlace al detalle.
- La tarjeta es usable con teclado.
- La imagen tiene texto alternativo o marcador.
- El título y el precio no se cortan de forma que impidan identificarlos.

## 5. Paginación

| Elemento | Regla |
|---|---|
| Página actual | Visible |
| Total de páginas | Visible |
| Anterior | Deshabilitado en la primera página |
| Siguiente | Deshabilitado en la última página |

Rules:

- La página es un entero positivo.
- Los controles tienen nombres accesibles.
- Cambiar de página mantiene la sesión y recarga el listado.
- Una página fuera de rango se corrige a la última disponible.
- Si al borrar la página queda vacía, se ajusta a la anterior.

## 6. Borrado

### Confirmación

- Identifica el título del anuncio.
- Pide confirmación explícita.
- Ofrece confirmar y cancelar.
- Cancelar no realiza ninguna petición.
- Mientras se elimina, el botón de confirmar está deshabilitado.

### Resultado

- Un `204` retira el anuncio y actualiza la paginación.
- Un `404` converge a mostrar que el anuncio ya no existe.
- Un `403` muestra permisos y mantiene el anuncio.
- Un fallo de red mantiene el anuncio y permite reintentar.
- Un `401` limpia la sesión y solicita acceso.
- Se muestra una confirmación perceptible tras el borrado.

## 7. Estados de la vista

| Estado | Contenido |
|---|---|
| Carga inicial | Indicador de carga y texto comprensible |
| Listado con resultados | Tarjetas y paginación |
| Listado vacío | Mensaje específico, distinto de un error |
| Error de carga | Mensaje comprensible y botón de reintento |
| Guardando sesión | Formulario deshabilitado |
| Eliminando | Confirmación deshabilitada |
| Éxito de borrado | Confirmación perceptible |
| Error de borrado | Mensaje y anuncio conservado |

Rules:

- Un listado vacío no se muestra como error.
- Un error no se muestra como listado vacío.
- Los estados son legibles por lector de pantalla.

## 8. Permisos

| Situación | UI |
|---|---|
| Visitante | Listado visible; sin acción de borrar |
| Autenticado | Listado visible; borrar solo en anuncios propios |
| Autor | Puede borrar su anuncio |
| No autor | No ve borrar; el backend rechaza con `403` si se intenta |
| Sesión caducada | Limpia sesión y solicita acceso |

## 9. Errores

| Status | Handling |
|---|---|
| `400` | Error de validación |
| `401` | Limpiar sesión y solicitar acceso |
| `403` | Error de permisos |
| `404` | Anuncio no encontrado |
| `5xx` / red | Mensaje comprensible y reintento |

Rules:

- Mensajes en español.
- Sin trazas ni detalles internos.
- Un error no deja acciones privadas obsoletas.

## 10. Accesibilidad

- Login, listado, paginación y confirmación accesibles por teclado.
- Foco visible.
- Etiquetas asociadas a los campos.
- Botones con nombres accesibles.
- Estados de carga, vacío, error y éxito legibles por lector de pantalla.
- Confirmación con foco controlado.
- Sin desplazamiento horizontal no intencionado a 360 px.
- Jerarquía de encabezados comprensible.

## 11. Out of Scope

- Crear anuncios.
- Editar anuncios.
- Detalle del anuncio.
- Favoritos, perfil, mensajería y valoraciones.
- Router y rutas profundas.
- Búsqueda y filtros.
- Tema claro/oscuro.
- Biblioteca de componentes.
- Cambios en el backend.
