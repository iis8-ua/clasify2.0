# Data Model: Gestión de anuncios

**Feature**: `004-gestion-anuncios`  
**Date**: 2026-11-10

## Overview

El modelo describe el formulario de anuncio, los datos enviados al backend, el estado del anuncio y
las confirmaciones de acciones destructivas. No se persisten borradores ni formularios.

## Entities

### AnuncioForm

Estado de creación o edición.

| Campo | Tipo | Reglas |
|---|---|---|
| `mode` | `crear` \| `editar` | Determina el título y el comportamiento |
| `original` | `AnuncioValores` \| null | Valores iniciales en edición |
| `values` | `AnuncioValores` | Valores actuales |
| `errors` | map<string, string> | Errores por campo |
| `submitting` | boolean | Envío en curso |
| `dirty` | boolean | Diferencia entre `values` y `original`, o imagen nueva |
| `imagenActual` | string \| null | Imagen existente en edición |
| `imagenNueva` | File \| null | Archivo seleccionado |
| `imagenPreview` | string \| null | URL temporal de previsualización |
| `generalError` | string \| null | Error de conexión o error general |

### AnuncioValores

| Campo | Tipo | Reglas |
|---|---|---|
| `titulo` | string | Obligatorio; máximo 150; se recorta |
| `descripcion` | string | Obligatoria; máximo 5000; se recorta |
| `precio` | string | Obligatorio; decimal no negativo; máximo 99999999.99; máximo 2 decimales |
| `categoria` | number \| null | Obligatoria; debe existir en el catálogo |

Reglas:

- No existe campo de autor.
- No existe campo de estado en el formulario.
- El precio se mantiene como cadena hasta el envío.
- La categoría se obtiene del catálogo de 003.

### AnuncioCrearPayload

| Campo | Tipo | Obligatorio |
|---|---|---|
| `titulo` | string | Sí |
| `descripcion` | string | Sí |
| `precio` | string | Sí |
| `categoria` | number | Sí |
| `imagen` | File | No |

El payload se envía como JSON sin imagen y como `FormData` con imagen.

### AnuncioEditarPayload

| Campo | Tipo | Obligatorio |
|---|---|---|
| `titulo` | string | Solo si cambia |
| `descripcion` | string | Solo si cambia |
| `precio` | string | Solo si cambia |
| `categoria` | number | Solo si cambia |
| `imagen` | File | Solo si se sustituye |

Reglas:

- No se envía si no hay cambios ni imagen nueva.
- No se envía el autor.
- No se envía el estado.

### EstadoAnuncio

| Valor | Significado |
|---|---|
| `disponible` | Anuncio visible en el listado por defecto |
| `vendido` | Anuncio oculto del listado por defecto, accesible por detalle |

### ConfirmacionAccion

| Campo | Tipo | Reglas |
|---|---|---|
| `tipo` | `eliminar` \| `vender` | Acción a confirmar |
| `anuncioId` | number | Anuncio afectado |
| `titulo` | string | Título mostrado en el diálogo |
| `abierta` | boolean | Visibilidad |
| `enCurso` | boolean | Operación en curso |
| `error` | string \| null | Error de la operación |

Reglas:

- Cancelar no ejecuta la acción.
- El diálogo se puede cerrar con teclado.
- El foco vuelve al elemento de origen.

### EstadoFormulario

| Valor | Significado |
|---|---|
| `idle` | Sin interacción |
| `editing` | Formulario con valores |
| `dirty` | Hay cambios sin guardar |
| `submitting` | Envío en curso |
| `success` | Operación correcta |
| `error` | Error de validación, permisos, conexión o imagen |

### ErrorGestion

| Campo | Tipo | Reglas |
|---|---|---|
| `estado` | number | Código HTTP o `0` para conexión |
| `codigo` | string | Código del backend o del frontend |
| `mensaje` | string | Mensaje comprensible en español |
| `campo` | string \| null | Campo afectado, si existe |
| `tipo` | `http` \| `conexion` \| `interno` | Origen |

## State Transitions

### Creación

```text
idle -> editing -> dirty -> submitting -> success
                                      -> error
error -> editing          (corregir y reintentar)
```

### Edición

```text
idle -> editing -> dirty -> submitting -> success
                              -> error
dirty -> editing             (cancelar con confirmación)
editing -> idle              (cancelar sin cambios)
```

### Eliminación

```text
idle -> confirmando -> eliminando -> eliminado
                   -> cancelado
                   -> error
```

### Cambio de estado

```text
disponible -> confirmando venta -> actualizando -> vendido
vendido -> actualizando -> disponible
```

## Validation Rules

- `titulo` obligatorio, máximo 150 caracteres.
- `descripcion` obligatoria, máximo 5000 caracteres.
- `precio` obligatorio, no negativo, máximo 99999999.99 y máximo 2 decimales.
- `categoria` obligatoria y existente en el catálogo.
- `imagen` opcional; JPEG, PNG o WebP; máximo 5 MB.
- No se permite modificar el autor.
- No se permite modificar el estado desde el formulario.
- No se permite eliminar la imagen actual sin subir otra.
- No se envía una edición sin cambios.
- No se ejecuta una acción destructiva sin confirmación.
- No se permite una segunda operación mientras hay una en curso.

## Relationships

- `AnuncioForm` produce `AnuncioCrearPayload` o `AnuncioEditarPayload`.
- `AnuncioForm` usa el catálogo de categorías de 003.
- `AccionesAnuncio` usa `ConfirmacionAccion` para eliminar y vender.
- `anunciosStore` actualiza el detalle y el listado de 003 después de cada operación.
- La sesión de 002 determina si el usuario puede ver las acciones de autor.
- El backend sigue comprobando la propiedad y el estado real.
