# Data Model: Catálogo de anuncios

**Feature**: `003-catalogo-anuncios`  
**Date**: 2026-11-10

## Overview

El modelo representa los datos que el catálogo recibe del backend y el estado de presentación del
listado y del detalle. No se persisten datos de catálogo en el frontend; la URL conserva página y
filtros.

## Entities

### AnuncioResumen

Elemento del listado.

| Campo | Tipo | Origen | Reglas |
|---|---|---|---|
| `id` | number | Backend | Identificador del anuncio |
| `titulo` | string | Backend | Texto visible |
| `precio` | string | Backend | Cadena decimal; se formatea como EUR |
| `estado` | `disponible` \| `vendido` | Backend | Se muestra como distintivo |
| `imagen` | string \| null | Backend | Nombre de fichero; `null` si no hay imagen |
| `fecha_creacion` | string | Backend | Fecha serializada; se formatea en español |
| `id_categoria` | number | Backend | Se resuelve contra el catálogo de categorías |
| `id_autor` | number | Backend | No se muestra en el listado |
| `nombreCategoria` | string | Derivado | Se obtiene del mapa de categorías; no se inventa |

Reglas:

- El listado no muestra el nombre del autor.
- Un `id_categoria` sin nombre se muestra como categoría no disponible, sin inventar texto.
- La imagen ausente usa un marcador accesible.

### AnuncioDetalle

Vista completa de un anuncio.

| Campo | Tipo | Origen | Reglas |
|---|---|---|---|
| `id` | number | Backend | Identificador |
| `titulo` | string | Backend | Texto visible |
| `descripcion` | string | Backend | Texto completo |
| `precio` | string | Backend | Cadena decimal; se formatea como EUR |
| `estado` | `disponible` \| `vendido` | Backend | Distintivo visible |
| `imagen` | string \| null | Backend | Imagen o marcador |
| `fecha_creacion` | string | Backend | Fecha formateada |
| `id_autor` | number | Backend | Referencia al autor |
| `id_categoria` | number | Backend | Referencia a la categoría |
| `autor` | `AutorResumen` | Backend | Información pública |
| `categoria` | `Categoria` | Backend | Nombre de categoría |
| `num_favoritos` | number | Backend | Número informativo |
| `es_favorito` | boolean | Backend | Estado informativo; sin acción en 003 |

Reglas:

- El email del autor no se modela ni se muestra.
- `conversacion`, `ultimos_mensajes` y `num_mensajes` no forman parte de esta feature y se ignoran.
- No se ofrecen acciones de edición, eliminación, cambio de estado ni favoritos.

### AutorResumen

| Campo | Tipo | Reglas |
|---|---|---|
| `id` | number | Identificador |
| `nombre` | string | Visible en el detalle |
| `biografia` | string \| null | Visible en el detalle |
| `fecha_alta` | string | Fecha formateada |
| `valoracion_media` | number \| null | Resumen de valoraciones |
| `num_valoraciones` | number | Número de valoraciones |

### Categoria

| Campo | Tipo | Reglas |
|---|---|---|
| `id` | number | Identificador |
| `nombre` | string | Se usa en tarjetas y filtros |

### Paginacion

| Campo | Tipo | Reglas |
|---|---|---|
| `pagina` | number | Página actual; `>= 1` |
| `limite` | number | Fijo en 20 para esta feature |
| `total` | number | Total de resultados |
| `paginas` | number | Total de páginas |

### FiltrosCatalogo

| Campo | Tipo | Valores | Reglas |
|---|---|---|---|
| `texto` | string | Texto libre | Máximo 150 caracteres; se recorta |
| `categoria` | number \| null | Identificador de categoría | Debe existir en el catálogo |
| `estado` | `disponible` \| `vendido` \| `todos` | Por defecto `disponible` | Filtro de estado |
| `orden` | `fecha_desc` \| `fecha_asc` \| `precio_desc` \| `precio_asc` | Por defecto `fecha_desc` | Orden del listado |
| `pagina` | number | Por defecto 1 | Entero positivo |
| `limite` | number | Fijo 20 | No se expone en la URL |

### EstadoListado

| Valor | Significado |
|---|---|
| `idle` | Aún no se ha solicitado el listado |
| `loading` | Se está cargando una página |
| `success` | Hay resultados |
| `empty` | La búsqueda o filtros no devuelven resultados |
| `error` | La carga ha fallado |

Reglas:

- `empty` no se representa como `error`.
- Al cambiar de página se mantiene el estado de filtros.
- Al cambiar un filtro se vuelve a `pagina=1`.

### EstadoDetalle

| Valor | Significado |
|---|---|
| `idle` | Aún no se ha solicitado el detalle |
| `loading` | Se está cargando |
| `success` | Anuncio encontrado |
| `notfound` | El anuncio no existe |
| `invalid` | El identificador no es válido |
| `error` | Fallo de conexión |

### ErrorCatalogo

| Campo | Tipo | Reglas |
|---|---|---|
| `estado` | number | Código HTTP o `0` para conexión |
| `codigo` | string | Código del backend o del frontend |
| `mensaje` | string | Mensaje comprensible en español |
| `campo` | string \| null | Campo afectado, si existe |
| `tipo` | `http` \| `conexion` \| `interno` | Origen |

## State Transitions

### Listado

```text
idle -> loading -> success
                -> empty
                -> error
error -> loading          (reintento)
success -> loading        (cambio de página, filtro o búsqueda)
empty -> loading          (cambio de filtro o búsqueda)
```

### Detalle

```text
idle -> loading -> success
                -> notfound
                -> invalid
                -> error
error -> loading          (reintento)
```

### Query de URL

```text
sin filtros -> texto/categoria/estado/orden
texto/categoria/estado/orden -> pagina=1
pagina -> conserva texto/categoria/estado/orden
```

## Validation Rules

- `texto` máximo 150 caracteres.
- `categoria` debe ser un identificador positivo y existir en el catálogo.
- `estado` solo admite `disponible`, `vendido` o `todos`.
- `orden` solo admite los cuatro valores del backend.
- `pagina` debe ser un entero positivo.
- Si la página supera `paginas`, se usa la última página disponible.
- El detalle rechaza identificadores no enteros o menores que 1.
- El precio se interpreta como decimal, no como número ya formateado.
- La fecha se interpreta según el valor serializado del backend.
- No se muestran emails de autores.
- No se inventan nombres de categoría ni de autor.

## Relationships

- Un `AnuncioResumen` referencia una `Categoria` mediante `id_categoria`.
- Un `AnuncioDetalle` contiene un `AutorResumen` y una `Categoria`.
- Un `AnuncioDetalle` incluye `num_favoritos` y `es_favorito` como datos informativos.
- Un `FiltrosCatalogo` genera una `Pagina de resultados`.
- La URL del listado serializa `FiltrosCatalogo` sin `limite`.
- La store `anuncios` mantiene lista, detalle y estados; la store `categorias` mantiene el mapa de
  categorías.
