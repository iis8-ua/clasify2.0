# Data Model: Mensajería

**Feature**: `007-mensajeria`  
**Date**: 2026-11-11

## Overview

El modelo describe conversaciones, mensajes, bandeja e hilo. No se persisten mensajes en el frontend; se consultan al backend y se mantienen en la store mientras dura la sesión.

## Entities

### Conversacion

| Campo | Tipo | Origen | Reglas |
|---|---|---|---|
| `id` | number | Backend | Identificador del hilo |
| `fecha_creacion` | string | Backend | Fecha de creación |
| `id_anuncio` | number | Backend | Anuncio asociado |
| `id_comprador` | number | Backend | Comprador |
| `anuncio` | `AnuncioResumen` | Backend | Anuncio del listado |
| `contraparte` | `UsuarioPublico` | Backend | El otro participante |
| `ultimo_mensaje` | `MensajeResumen` \| null | Backend | Último mensaje |
| `no_leidos` | number | Backend | Mensajes del otro sin leer |

### Mensaje

| Campo | Tipo | Origen | Reglas |
|---|---|---|---|
| `id` | number | Backend | Identificador |
| `texto` | string | Backend | 1–1000 caracteres |
| `fecha` | string | Backend | Fecha de envío |
| `leido` | boolean | Backend | Estado de lectura |
| `id_conversacion` | number | Backend | Hilo |
| `id_emisor` | number | Backend | Autor |
| `no_leidos` | number | Backend | Total pendiente devuelto al listar |

### Bandeja

| Campo | Tipo | Reglas |
|---|---|---|
| `items` | `Conversacion[]` | Página actual |
| `pagina` | number | `>= 1` |
| `limite` | number | 10, 20 o 50; 20 por defecto |
| `total` | number | Total de conversaciones |
| `paginas` | number | Total de páginas |
| `estado` | `idle` \| `loading` \| `success` \| `empty` \| `error` | Estado de la vista |
| `error` | `ErrorMensajeria` \| null | Error de carga |

### Hilo

| Campo | Tipo | Reglas |
|---|---|---|
| `conversacionId` | number | Hilo abierto |
| `items` | `Mensaje[]` | Página actual en orden cronológico |
| `pagina` | number | `>= 1` |
| `limite` | number | 10, 20 o 50; 20 por defecto |
| `total` | number | Total de mensajes |
| `paginas` | number | Total de páginas |
| `estado` | `idle` \| `loading` \| `success` \| `empty` \| `error` | Estado de la vista |
| `error` | `ErrorMensajeria` \| null | Error de carga |
| `enviando` | boolean | Envío en curso |

### ErrorMensajeria

| Campo | Tipo | Reglas |
|---|---|---|
| `estado` | number | Código HTTP o `0` para conexión |
| `codigo` | string | Código del backend o del frontend |
| `mensaje` | string | Mensaje comprensible en español |
| `campo` | string \| null | Campo afectado, si existe |
| `tipo` | `http` \| `conexion` \| `interno` | Origen |

## State Transitions

### Bandeja

```text
idle -> loading -> success
                -> empty
                -> error
error -> loading          (reintento)
success -> loading        (cambio de página o tamaño)
```

### Hilo

```text
idle -> loading -> success
                -> empty
                -> error
success -> loading        (cargar anteriores o cambiar tamaño)
success -> enviando -> success
        -> error -> success (conserva texto)
```

### Contacto desde el detalle

```text
sin conversación -> modal -> enviando -> conversación
modal -> cancelado -> sin conversación
```

## Validation Rules

- La bandeja y el hilo requieren sesión válida.
- Solo los participantes pueden ver y escribir.
- No se contacta con un anuncio propio.
- No se inicia un hilo nuevo sobre un anuncio vendido.
- Un hilo existente puede continuar aunque el anuncio esté vendido.
- El mensaje debe tener texto no vacío y máximo 1000 caracteres.
- La página debe ser un entero positivo.
- El tamaño de página es 10, 20 o 50; 20 por defecto.
- La página fuera de rango se corrige a la última disponible solo tras una carga correcta.
- El hilo abre en los últimos mensajes.
- Abrir un hilo marca como leídos los mensajes pendientes.
- La bandeja se ordena por actividad reciente.
- Los no leídos se muestran por conversación, no como total global en cabecera.
- El cierre de sesión limpia bandeja, hilo y mensajes.

## Relationships

- `Conversacion` relaciona un anuncio, un comprador y un vendedor.
- `Mensaje` pertenece a una conversación.
- `Bandeja` agrupa conversaciones paginadas.
- `Hilo` agrupa mensajes paginados.
- `UltimosMensajes` usa los últimos mensajes del detalle sin marcarlos como leídos.
- `ModalContactar` crea o reutiliza una conversación a partir de un anuncio.
- `mensajesStore` se limpia al cambiar `sessionVersion`.
