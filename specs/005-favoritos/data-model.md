# Data Model: Favoritos

**Feature**: `005-favoritos`  
**Date**: 2026-11-10

## Overview

El modelo describe la relación entre un usuario y un anuncio guardado, el estado del botón de
favorito y la lista personal paginada. No se persisten favoritos en el frontend; se consultan al
backend y se mantienen en la store mientras dura la sesión.

## Entities

### FavoritoRegistro

Respuesta de añadir un favorito.

| Campo | Tipo | Origen | Reglas |
|---|---|---|---|
| `id` | number | Backend | Identificador del favorito |
| `fecha` | string | Backend | Fecha en que se guardó |
| `id_usuario` | number | Backend | Usuario propietario |
| `id_anuncio` | number | Backend | Anuncio guardado |

### AnuncioFavorito

Elemento de la lista de favoritos.

| Campo | Tipo | Origen | Reglas |
|---|---|---|---|
| `id` | number | Backend | Identificador del anuncio |
| `titulo` | string | Backend | Texto visible |
| `precio` | string | Backend | Cadena decimal; se formatea como EUR |
| `estado` | `disponible` \| `vendido` | Backend | Se muestra con distintivo |
| `imagen` | string \| null | Backend | Imagen o marcador |
| `fecha_creacion` | string | Backend | Fecha del anuncio |
| `id_categoria` | number | Backend | Se resuelve contra categorías |
| `id_autor` | number | Backend | No se muestra en la tarjeta |

Reglas:

- La lista se ordena por fecha de guardado descendente.
- Los anuncios vendidos se muestran con su estado.
- Los anuncios eliminados no se devuelven.
- La tarjeta no ofrece acción de quitar.

### EstadoFavorito

Estado del botón en el detalle.

| Campo | Tipo | Reglas |
|---|---|---|
| `anuncioId` | number | Anuncio del detalle |
| `esFavorito` | boolean | Valor inicial del detalle |
| `numFavoritos` | number | Número informativo |
| `procesando` | boolean | Operación en curso |
| `error` | string \| null | Error de la última operación |

### ListaFavoritos

| Campo | Tipo | Reglas |
|---|---|---|
| `items` | `AnuncioFavorito[]` | Página actual |
| `pagina` | number | Página actual |
| `limite` | number | Fijo en 20 |
| `total` | number | Total de favoritos |
| `paginas` | number | Total de páginas |
| `estado` | `idle` \| `loading` \| `success` \| `empty` \| `error` | Estado de la vista |
| `error` | `ErrorFavorito` \| null | Error de carga |

### PaginaFavoritos

| Campo | Tipo | Reglas |
|---|---|---|
| `pagina` | number | `>= 1` |
| `limite` | number | 20 |
| `total` | number | Total de favoritos |
| `paginas` | number | Total de páginas |

### ErrorFavorito

| Campo | Tipo | Reglas |
|---|---|---|
| `estado` | number | Código HTTP o `0` para conexión |
| `codigo` | string | Código del backend o del frontend |
| `mensaje` | string | Mensaje comprensible en español |
| `campo` | string \| null | Campo afectado, si existe |
| `tipo` | `http` \| `conexion` \| `interno` | Origen |

## State Transitions

### Botón de favorito

```text
no guardado -> procesando -> guardado
guardado -> procesando -> no guardado
procesando -> error -> estado anterior
```

### Lista de favoritos

```text
idle -> loading -> success
                -> empty
                -> error
error -> loading          (reintento)
success -> loading        (cambio de página)
```

### Sesión

```text
autenticado -> visitante  (logout)
```

Al pasar a visitante, la lista y el estado del botón se limpian.

### Anuncio eliminado

```text
lista con anuncio -> recarga -> lista sin anuncio
detalle directo -> no encontrado
```

## Validation Rules

- La acción requiere sesión válida.
- No se permite guardar un anuncio propio.
- Añadir un favorito ya existente mantiene el estado guardado sin duplicados.
- Quitar un favorito inexistente deja el estado no guardado.
- La página debe ser un entero positivo.
- El tamaño de página es fijo en 20.
- La página fuera de rango se corrige a la última disponible.
- La lista solo contiene favoritos del usuario autenticado.
- Los anuncios vendidos se muestran con su estado.
- Los anuncios eliminados desaparecen al actualizar la lista.
- La lista no ofrece acción de quitar.
- La acción no se ofrece para anuncios propios.

## Relationships

- `FavoritoRegistro` relaciona un usuario con un anuncio.
- `AnuncioFavorito` reutiliza la tarjeta de 003.
- `EstadoFavorito` se inicializa con `es_favorito` y `num_favoritos` del detalle.
- `ListaFavoritos` usa la paginación común de 003.
- `favoritosStore` observa `sessionVersion` de 002 para limpiar sus datos.
- `favoritosService` usa la capa HTTP base de 001.
