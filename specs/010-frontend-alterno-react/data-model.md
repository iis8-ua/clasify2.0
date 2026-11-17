# Data Model: Frontend alternativo con React

**Feature**: `010-frontend-alterno-react`  
**Date**: 2026-11-16

## Overview

El modelo describe la sesión, el listado de anuncios, la paginación y la confirmación de borrado. No
se persisten anuncios en el frontend; se consultan al backend y se mantienen en el estado de React
mientras dura la vista. El token se conserva en `sessionStorage`.

## Entities

### Sesion

| Campo | Tipo | Origen | Reglas |
|---|---|---|---|
| `token` | string \| null | Backend | Se guarda en `sessionStorage` |
| `usuario` | `UsuarioSesion` \| null | Backend | Se recupera con `GET /auth/yo` |
| `estado` | `visitante` \| `recuperando` \| `autenticado` \| `error` | Frontend | Controla la interfaz |
| `error` | `ErrorApi` \| null | Frontend | Error de acceso o sesión |

### UsuarioSesion

| Campo | Tipo | Origen | Reglas |
|---|---|---|---|
| `id` | number | Backend | Identifica al autor de los anuncios |
| `nombre` | string | Backend | Se muestra en la cabecera |
| `email` | string | Backend | Puede mostrarse como dato de la cuenta |
| `biografia` | string \| null | Backend | No se edita en React |

### Anuncio

| Campo | Tipo | Origen | Reglas |
|---|---|---|---|
| `id` | number | Backend | Identificador |
| `titulo` | string | Backend | Se muestra en la tarjeta |
| `precio` | string | Backend | Precio serializado por el backend |
| `estado` | `disponible` \| `vendido` | Backend | Se muestra como texto |
| `imagen` | string \| null | Backend | Nombre del fichero o ausencia |
| `fecha_creacion` | string | Backend | Fecha de publicación |
| `id_categoria` | number | Backend | Se resuelve con el mapa de categorías |
| `id_autor` | number | Backend | Determina si se muestra borrar |
| `categoria` | string | Frontend | Nombre resuelto o texto de respaldo |

### Categoria

| Campo | Tipo | Origen | Reglas |
|---|---|---|---|
| `id` | number | Backend | Identificador |
| `nombre` | string | Backend | Nombre visible |

### PaginaAnuncios

| Campo | Tipo | Reglas |
|---|---|---|
| `items` | `Anuncio[]` | Página actual |
| `pagina` | number | `>= 1` |
| `limite` | number | Fijo en 20 |
| `total` | number | Total de anuncios |
| `paginas` | number | Total de páginas |

### EstadoListado

| Campo | Tipo | Reglas |
|---|---|---|
| `estado` | `idle` \| `loading` \| `success` \| `empty` \| `error` | Estado de la vista |
| `error` | `ErrorApi` \| null | Error de carga |
| `pagina` | number | Página actual |
| `paginacion` | `PaginaAnuncios` \| null | Datos de paginación |
| `categorias` | `Record<number, string>` | Mapa id → nombre |

### ConfirmacionBorrado

| Campo | Tipo | Reglas |
|---|---|---|
| `anuncio` | `Anuncio` \| null | Anuncio que se va a borrar |
| `abierta` | boolean | Muestra la confirmación |
| `eliminando` | boolean | Petición en curso |
| `error` | `ErrorApi` \| null | Error del borrado |

### ErrorApi

| Campo | Tipo | Reglas |
|---|---|---|
| `estado` | number | Código HTTP o `0` para conexión |
| `codigo` | string | Código del backend o del frontend |
| `mensaje` | string | Mensaje comprensible en español |
| `campo` | string \| null | Campo afectado, si existe |
| `tipo` | `http` \| `conexion` \| `interno` | Origen |

## State Transitions

### Sesión

```text
visitante -> recuperando -> autenticado
                        -> visitante   (sin token o token inválido)
autenticado -> visitante              (logout)
visitante -> autenticando -> autenticado
                         -> visitante (credenciales incorrectas)
autenticado -> visitante              (401)
```

### Listado

```text
idle -> loading -> success
                -> empty
                -> error
error -> loading          (reintento)
success -> loading        (cambio de página)
success -> success        (categorías cargadas)
```

### Borrado

```text
idle -> confirmando -> eliminando -> success
                   -> cancelado -> idle
eliminando -> error -> idle        (el anuncio sigue visible)
success -> loading                 (recarga de la página)
```

## Validation Rules

- El listado es público y no requiere token.
- La página debe ser un entero positivo.
- El límite es fijo en 20.
- Una página fuera de rango se corrige a la última disponible tras una carga correcta.
- Solo se muestra la acción de borrar cuando `id_autor` coincide con el usuario autenticado.
- El borrado requiere confirmación explícita.
- Cancelar la confirmación no realiza ninguna petición.
- El borrado en curso deshabilita una segunda confirmación.
- El backend sigue siendo la autoridad final sobre la autoría.
- Un `401` limpia la sesión y solicita acceso.
- Un `403` muestra permisos y no elimina.
- Un `404` retira el anuncio del listado o converge a un estado sin él.
- Un `204` confirma el borrado.
- Un fallo de red conserva el anuncio y permite reintentar.
- El cierre de sesión limpia el usuario y las acciones privadas.
- La interfaz no conserva datos privados de una sesión anterior.

## Relationships

- `Sesion` contiene un `UsuarioSesion`.
- `PaginaAnuncios` agrupa `Anuncio`.
- `Anuncio` referencia una `Categoria` mediante `id_categoria`.
- `Anuncio` referencia un `UsuarioSesion` mediante `id_autor`.
- `ConfirmacionBorrado` referencia el `Anuncio` seleccionado.
- `EstadoListado` contiene la página actual y el mapa de categorías.
- El borrado correcto invalida la página actual y fuerza una recarga.
