# Announcement Write API Contract

**Feature**: `004-gestion-anuncios`  
**Date**: 2026-11-10

## Base

| Aspecto | Valor |
|---|---|
| URL base | `VITE_API_URL` (`http://localhost:3000/clasify_api`) |
| Autenticación | `Authorization: Bearer <token>` |
| Formato sin imagen | JSON |
| Formato con imagen | `multipart/form-data` |
| Error uniforme | `{ "error": { "codigo", "mensaje", "campo" } }` |

## 1. Crear anuncio

```text
POST /anuncios
```

Request JSON:

```json
{
  "titulo": "Bicicleta de montaña",
  "descripcion": "Bicicleta de 29 pulgadas...",
  "precio": "250.00",
  "categoria": 8
}
```

Request `multipart/form-data`:

- `titulo`
- `descripcion`
- `precio`
- `categoria`
- `imagen` (opcional)

Success `201`:

```json
{
  "datos": {
    "anuncio": {
      "id": 25,
      "titulo": "Bicicleta de montaña",
      "descripcion": "Bicicleta de 29 pulgadas...",
      "precio": "250.00",
      "estado": "disponible",
      "imagen": "archivo.jpg",
      "fecha_creacion": "2026-11-10T12:00:00.000Z",
      "autor": {},
      "categoria": {},
      "num_favoritos": 0,
      "es_favorito": false
    }
  }
}
```

El backend devuelve `autor.id` y `categoria.id` anidados. El frontend deriva `id_autor` e
`id_categoria` en `anunciosService` después de cada respuesta de escritura.

Errors:

| Status | Code | Handling |
|---|---|---|
| `400` | `VALIDACION` | Error de campo; usar `campo` |
| `401` | `SIN_TOKEN` / sesión | Limpiar sesión y solicitar acceso |
| `413` | `CUERPO_DEMASIADO_GRANDE` | Error de tamaño del cuerpo |
| `400` de imagen | `VALIDACION` | Error asociado a `imagen` |

Rules:

- El autor se obtiene del token; el frontend no envía `id_autor`.
- La imagen es opcional.
- Un `201` se trata como creación correcta y abre el detalle.

## 2. Editar anuncio

```text
PATCH /anuncios/:id
```

Request:

- JSON con los campos modificados, o
- `multipart/form-data` con los campos modificados y `imagen`.

Campos permitidos:

| Campo | Tipo |
|---|---|
| `titulo` | string |
| `descripcion` | string |
| `precio` | string |
| `categoria` | number |
| `imagen` | File |

Success `200`:

```json
{
  "datos": {
    "anuncio": {
      "id": 25,
      "titulo": "Bicicleta actualizada",
      "precio": "230.00",
      "estado": "disponible",
      "imagen": "nueva.jpg"
    }
  }
}
```

Errors:

| Status | Code | Handling |
|---|---|---|
| `400` | `VALIDACION` | Error de campo o ausencia de campos editables |
| `401` | Sesión | Limpiar sesión |
| `403` | `SIN_PERMISOS` | Error de permisos |
| `404` | `NO_ENCONTRADO` | Anuncio no encontrado |
| `413` | `CUERPO_DEMASIADO_GRANDE` | Error de tamaño |
| `400` de imagen | `VALIDACION` | Error asociado a `imagen` |

Rules:

- Solo el autor puede editar.
- No se envía `id_autor`.
- No se envía `estado`.
- Si no hay cambios ni imagen nueva, no se envía la operación.
- La imagen actual solo puede sustituirse, no eliminarse sin subir otra.

## 3. Cambiar estado

```text
PATCH /anuncios/:id/estado
```

Request:

```json
{
  "estado": "vendido"
}
```

Success `200`:

```json
{
  "datos": {
    "anuncio": {
      "id": 25,
      "estado": "vendido"
    }
  }
}
```

Errors:

| Status | Code | Handling |
|---|---|---|
| `400` | `VALIDACION` | Estado inválido |
| `401` | Sesión | Limpiar sesión |
| `403` | `SIN_PERMISOS` | Error de permisos |
| `404` | `NO_ENCONTRADO` | Anuncio no encontrado |

Rules:

- Solo el autor puede cambiar el estado.
- Valores admitidos: `disponible` y `vendido`.
- Marcar como vendido solicita confirmación.
- Volver a disponible no requiere confirmación.

## 4. Eliminar anuncio

```text
DELETE /anuncios/:id
```

Success `204` sin cuerpo.

Errors:

| Status | Code | Handling |
|---|---|---|
| `401` | Sesión | Limpiar sesión |
| `403` | `SIN_PERMISOS` | Error de permisos |
| `404` | `NO_ENCONTRADO` | Anuncio no encontrado |

Rules:

- Solo el autor puede eliminar.
- Se solicita confirmación antes de eliminar.
- Un `204` retira el anuncio del estado local y navega al listado.

## 5. Post-operation Updates

| Operation | Store/UI update |
|---|---|
| Crear | Insertar o invalidar listado; abrir detalle |
| Editar | Actualizar detalle y listado |
| Cambiar estado | Actualizar detalle y listado |
| Eliminar | Retirar de detalle y listado; navegar al listado |

Rules:

- No se exige recarga manual.
- Un anuncio vendido desaparece del listado por defecto y sigue accesible por detalle.
- Un anuncio que vuelve a disponible reaparece en el listado por defecto.

## 6. Out of Scope

- Cambiar autor.
- Cambiar estado desde el formulario de edición.
- Varias imágenes.
- Eliminar imagen sin sustituirla.
- Borradores o autoguardado.
- Acciones masivas.
- Administración de anuncios ajenos.
- Cambios en el backend.
