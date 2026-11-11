# Data Model: Valoraciones

**Feature**: `009-valoraciones`  
**Date**: 2026-11-11

## Overview

El modelo describe la valoración entre usuarios, el resumen de reputación y las listas de recibidas y escritas. No se persisten valoraciones en el frontend; se consultan y modifican en el backend.

## Entities

### Valoracion

| Campo | Tipo | Origen | Reglas |
|---|---|---|---|
| `id` | number | Backend | Identificador |
| `puntuacion` | number | Backend | Entero 1–5 |
| `comentario` | string \| null | Backend | Opcional; máximo 500 |
| `fecha` | string | Backend | Formateada |
| `id_valorador` | number | Backend | Autor |
| `id_valorado` | number | Backend | Destinatario |

### ValoracionRecibida

| Campo | Tipo | Origen | Reglas |
|---|---|---|---|
| `id` | number | Backend | Identificador |
| `puntuacion` | number | Backend | 1–5 |
| `comentario` | string \| null | Backend | Opcional |
| `fecha` | string | Backend | Formateada |
| `autor` | `{ id, nombre }` | Backend | Enlace a perfil público |

### ValoracionEscrita

| Campo | Tipo | Origen | Reglas |
|---|---|---|---|
| `id` | number | Backend | Identificador |
| `puntuacion` | number | Backend | 1–5 |
| `comentario` | string \| null | Backend | Opcional |
| `fecha` | string | Backend | Formateada |
| `para` | `{ id, nombre, valoracion_media, num_valoraciones }` | Backend | Destinatario |

### ValoracionPropia

| Campo | Tipo | Origen | Reglas |
|---|---|---|---|
| `puntuacion` | number | Backend | Valor actual del formulario |
| `comentario` | string \| null | Backend | Valor actual |
| `fecha` | string | Backend | Fecha de la valoración |

Viene en `mi_valoracion` del perfil público cuando ya existe.

### ListaValoraciones

| Campo | Tipo | Reglas |
|---|---|---|
| `items` | `ValoracionRecibida[]` \| `ValoracionEscrita[]` | Página actual |
| `pagina` | number | `>= 1` |
| `limite` | number | 10, 20 o 50; 20 por defecto |
| `total` | number | Total |
| `paginas` | number | Total de páginas |
| `estado` | `idle` \| `loading` \| `success` \| `empty` \| `error` | Estado |
| `error` | `ErrorValoracion` \| null | Error |

### FormularioValoracion

| Campo | Tipo | Reglas |
|---|---|---|
| `puntuacion` | number \| null | Obligatoria, entera, 1–5 |
| `comentario` | string | Opcional, máximo 500 |
| `enviando` | boolean | Impide doble envío |
| `error` | `ErrorValoracion` \| null | Error visible |

### ErrorValoracion

| Campo | Tipo | Reglas |
|---|---|---|
| `estado` | number | Código HTTP o `0` |
| `codigo` | string | Código estable |
| `mensaje` | string | Español, sin detalles internos |
| `campo` | string \| null | Si existe |
| `tipo` | `http` \| `conexion` \| `interno` | Origen |

## State Transitions

### Formulario

```text
idle -> editing -> enviando -> success
                        -> error -> editing
```

### Eliminación

```text
visible -> confirmando -> eliminando -> sin valoración
                       -> cancelado -> visible
                       -> error -> visible
```

### Listas

```text
idle -> loading -> success
                -> empty
                -> error
error -> loading          (reintento)
success -> loading        (cambio de página o tamaño)
```

## Validation Rules

- Crear, actualizar y eliminar requieren sesión válida.
- No se puede valorar al propio usuario.
- La puntuación es obligatoria, entera y está entre 1 y 5.
- El comentario es opcional y no supera 500 caracteres.
- Guardar de nuevo actualiza la valoración sin duplicados.
- El formulario se precarga con `mi_valoracion`.
- Eliminar requiere confirmación.
- Eliminar una valoración inexistente converge a sin valoración.
- Las listas de recibidas y escritas son independientes.
- La página es un entero positivo.
- El tamaño es 10, 20 o 50; 20 por defecto.
- Cambiar el tamaño vuelve a la primera página.
- La página fuera de rango se corrige a la última disponible solo tras una carga correcta.
- El resumen se actualiza tras guardar o eliminar.
- El cierre de sesión limpia listas, formularios y errores privados.

## Relationships

- `Valoracion` relaciona un valorador y un valorado.
- `ValoracionRecibida` usa el autor para enlazar a su perfil público.
- `ValoracionEscrita` usa el destinatario para editar desde su perfil público.
- `ValoracionPropia` precarga el formulario de 008.
- `FormularioValoracion` se monta en `PerfilPublicoView`.
- `MisValoracionesSection` monta las listas de recibidas y escritas en `PerfilView`.
- `valoracionesStore` se limpia al cambiar `sessionVersion`.
