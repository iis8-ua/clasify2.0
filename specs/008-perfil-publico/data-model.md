# Data Model: Perfil público

**Feature**: `008-perfil-publico`  
**Date**: 2026-11-11

## Overview

El modelo describe el perfil público de un usuario, sus valoraciones recibidas y sus anuncios. No se persiste nada en el frontend; los datos se consultan al backend y se mantienen en la store mientras dura la vista.

## Entities

### PerfilPublico

| Campo | Tipo | Origen | Reglas |
|---|---|---|---|
| `id` | number | Backend | Identificador del usuario |
| `nombre` | string | Backend | Visible |
| `biografia` | string \| null | Backend | Visible; ausencia con texto comprensible |
| `fecha_alta` | string | Backend | Formateada en español |
| `valoracion_media` | number \| null | Backend | Resumen |
| `num_valoraciones` | number | Backend | Resumen |
| `mi_valoracion` | `ValoracionPropia` \| null | Backend | Solo si hay sesión y ya valoró; se usa en 009 |

No incluye email ni password.

### ValoracionRecibida

| Campo | Tipo | Origen | Reglas |
|---|---|---|---|
| `id` | number | Backend | Identificador |
| `puntuacion` | number | Backend | 1–5 |
| `comentario` | string \| null | Backend | Opcional |
| `fecha` | string | Backend | Formateada |
| `autor` | `{ id, nombre }` | Backend | Enlace a perfil público |

### AnuncioUsuario

Reutiliza `AnuncioResumen` de 003:

| Campo | Tipo | Reglas |
|---|---|---|
| `id` | number | Identificador |
| `titulo` | string | Visible |
| `precio` | string | EUR/es-ES |
| `estado` | `disponible` \| `vendido` | Distintivo |
| `imagen` | string \| null | Imagen o marcador |
| `fecha_creacion` | string | Formateada |
| `id_categoria` | number | Se resuelve con categorías |
| `id_autor` | number | Coincide con el perfil |

### ListaValoraciones

| Campo | Tipo | Reglas |
|---|---|---|
| `items` | `ValoracionRecibida[]` | Página actual |
| `pagina` | number | `>= 1` |
| `limite` | number | 10, 20 o 50; 20 por defecto |
| `total` | number | Total de valoraciones |
| `paginas` | number | Total de páginas |
| `estado` | `idle` \| `loading` \| `success` \| `empty` \| `error` | Estado |
| `error` | `ErrorPerfilPublico` \| null | Error |

### ListaAnuncios

| Campo | Tipo | Reglas |
|---|---|---|
| `items` | `AnuncioUsuario[]` | Página actual |
| `pagina` | number | `>= 1` |
| `limite` | number | 10, 20 o 50; 20 por defecto |
| `total` | number | Total de anuncios |
| `paginas` | number | Total de páginas |
| `estado` | `idle` \| `loading` \| `success` \| `empty` \| `error` | Estado |
| `error` | `ErrorPerfilPublico` \| null | Error |

### ErrorPerfilPublico

| Campo | Tipo | Reglas |
|---|---|---|
| `estado` | number | Código HTTP o `0` |
| `codigo` | string | Código estable |
| `mensaje` | string | Español, sin detalles internos |
| `campo` | string \| null | Si existe |
| `tipo` | `http` \| `conexion` \| `interno` | Origen |

## State Transitions

### Perfil

```text
idle -> loading -> success
                -> notfound
                -> error
error -> loading          (reintento)
```

### Listados

```text
idle -> loading -> success
                -> empty
                -> error
error -> loading          (reintento)
success -> loading        (cambio de página o tamaño)
```

## Validation Rules

- La ruta es pública.
- No se muestran email ni datos privados.
- El identificador debe ser un entero positivo.
- Un perfil inexistente muestra no encontrado.
- Los listados de valoraciones y anuncios son independientes.
- La página debe ser un entero positivo.
- El tamaño de página es 10, 20 o 50; 20 por defecto.
- Cambiar el tamaño vuelve a la primera página del listado correspondiente.
- La página fuera de rango se corrige a la última disponible solo tras una carga correcta.
- Los anuncios vendidos se muestran con su estado.
- No se ofrecen acciones de gestión ni de valoración en esta feature.

## Relationships

- `PerfilPublico` tiene muchas `ValoracionRecibida`.
- `PerfilPublico` tiene muchos `AnuncioUsuario`.
- `ListaValoraciones` y `ListaAnuncios` usan paginación común.
- `mi_valoracion` lo consume el formulario de 009.
- `ValoracionRecibida.autor` enlaza al perfil público de su autor.
- `AnuncioUsuario` reutiliza la tarjeta de 003.
