# Data Model: Perfil propio

**Feature**: `006-perfil`  
**Date**: 2026-11-10

## Overview

El modelo describe el perfil del usuario autenticado, los formularios de edición, el cambio de
contraseña y la lista paginada de anuncios propios. No se persisten datos de perfil en el frontend.

## Entities

### Perfil

| Campo | Tipo | Origen | Reglas |
|---|---|---|---|
| `id` | number | Backend | Identificador |
| `email` | string | Backend | Solo propio; informativo; no editable |
| `nombre` | string | Backend | Visible y editable |
| `biografia` | string \| null | Backend | Visible y editable |
| `fecha_alta` | string | Backend | Formateada en español |
| `valoracion_media` | number \| null | Backend | Resumen de valoraciones |
| `num_valoraciones` | number | Backend | Número de valoraciones |

Rules:

- El email no se envía en ninguna actualización.
- No se muestra `password_hash`.
- El perfil es solo del usuario autenticado.

### PerfilDatosForm

| Campo | Tipo | Reglas |
|---|---|---|
| `nombre` | string | Obligatorio; máximo 100; se recorta |
| `biografia` | string | Máximo 500; puede ser vacío |
| `original` | `{ nombre, biografia }` | Valores iniciales |
| `errors` | map<string, string> | Errores por campo |
| `dirty` | boolean | Diferencia con `original` |
| `submitting` | boolean | Envío en curso |
| `generalError` | string \| null | Error de conexión o general |

Rules:

- El email no forma parte del formulario.
- No se envía `email`.
- Un nombre vacío o demasiado largo se rechaza.
- Una biografía demasiado larga se rechaza.
- Si no hay cambios, no se envía la operación.
- Salir con cambios solicita confirmación.

### CambioContrasenaForm

| Campo | Tipo | Reglas |
|---|---|---|
| `passwordActual` | string | Obligatorio |
| `passwordNueva` | string | Obligatorio; mínimo 8 caracteres |
| `errors` | map<string, string> | Errores por campo |
| `generalError` | string \| null | Error de contraseña actual o conexión |
| `submitting` | boolean | Envío en curso |

Rules:

- La contraseña actual es obligatoria.
- La contraseña nueva no se muestra después del envío.
- Una contraseña actual incorrecta muestra un error sin cerrar sesión.
- El resto de datos del formulario se conserva ante un error.
- No se envía `email`.

### MisAnunciosItem

| Campo | Tipo | Origen | Reglas |
|---|---|---|---|
| `id` | number | Backend | Identificador |
| `titulo` | string | Backend | Visible |
| `precio` | string | Backend | EUR/es-ES |
| `estado` | `disponible` \| `vendido` | Backend | Distintivo |
| `imagen` | string \| null | Backend | Imagen o marcador |
| `fecha_creacion` | string | Backend | Formateada |
| `id_categoria` | number | Backend | Se resuelve con categorías |
| `id_autor` | number | Backend | No se muestra |

Rules:

- Solo se muestran anuncios del usuario autenticado.
- Los vendidos se muestran con su estado.
- La tarjeta solo abre el detalle; no ofrece acciones de gestión.
- La lista se ordena por fecha de creación descendente.
- El tamaño de página es 20 por defecto y admite 10, 20 o 50.
- La página y el tamaño se conservan en la URL.
- Cambiar el tamaño vuelve a la primera página.
- La página fuera de rango se corrige a la última disponible solo tras una carga correcta.
- El estado vacío ofrece una acción para crear un anuncio.

### Paginacion

| Campo | Tipo | Reglas |
|---|---|---|
| `pagina` | number | `>= 1` |
| `limite` | number | 10, 20 o 50; 20 por defecto |
| `total` | number | Total de anuncios propios |
| `paginas` | number | Total de páginas |

### EstadoPerfil

| Valor | Significado |
|---|---|
| `idle` | Sin cargar |
| `loading` | Cargando perfil |
| `success` | Perfil disponible |
| `error` | Error de carga |
| `saving` | Guardando datos o contraseña |
| `saveSuccess` | Guardado correcto |
| `saveError` | Error de guardado |

### EstadoMisAnuncios

| Valor | Significado |
|---|---|
| `idle` | Sin cargar |
| `loading` | Cargando página |
| `success` | Anuncios disponibles |
| `empty` | Sin anuncios |
| `error` | Error de carga |

### ErrorPerfil

| Campo | Tipo | Reglas |
|---|---|---|
| `estado` | number | Código HTTP o `0` para conexión |
| `codigo` | string | Código del backend o del frontend |
| `mensaje` | string | Mensaje comprensible en español |
| `campo` | string \| null | Campo afectado, si existe |
| `tipo` | `http` \| `conexion` \| `interno` | Origen |

## State Transitions

### Perfil

```text
idle -> loading -> success
               -> error
error -> loading          (reintento)
```

### Edición de datos

```text
idle -> editing -> dirty -> saving -> saveSuccess
                              -> saveError
dirty -> editing             (cancelar con confirmación)
editing -> idle              (cancelar sin cambios)
```

### Cambio de contraseña

```text
idle -> submitting -> success
                  -> error de validación
                  -> error de contraseña actual
                  -> error de conexión
```

### Anuncios propios

```text
idle -> loading -> success
               -> empty
               -> error
success -> loading        (cambio de página)
```

## Validation Rules

- Nombre obligatorio y máximo 100 caracteres.
- Biografía máximo 500 caracteres.
- Email no editable; no se envía.
- Contraseña actual obligatoria.
- Contraseña nueva mínimo 8 caracteres.
- La contraseña no se muestra después del envío.
- Una contraseña actual incorrecta no cierra la sesión.
- No se envía una edición de datos sin cambios.
- La página de anuncios propios debe ser un entero positivo.
- El tamaño de página es 20 por defecto y admite 10, 20 o 50.
- La página y el tamaño se conservan en la URL.
- Cambiar el tamaño vuelve a la primera página.
- La página fuera de rango se corrige a la última solo tras una carga correcta.
- La lista solo muestra anuncios del usuario.
- Las acciones de gestión no se ofrecen en la lista.
- El perfil propio enlaza al perfil público propio de 008.

## Relationships

- `Perfil` se actualiza en la store de sesión de 002 tras guardar nombre o biografía.
- `PerfilDatosForm` y `CambioContrasenaForm` usan `usuariosService`.
- `MisAnunciosItem` reutiliza la tarjeta de 003.
- `perfilStore` observa `sessionVersion` para limpiar datos al cerrar sesión.
- El estado vacío de `MisAnunciosSection` enlaza con la ruta de creación de 004.
