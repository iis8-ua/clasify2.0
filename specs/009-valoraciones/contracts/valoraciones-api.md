# Ratings API Contract

**Feature**: `009-valoraciones`  
**Date**: 2026-11-11

## Base

| Aspecto | Valor |
|---|---|
| URL base | `VITE_API_URL` (`http://localhost:3000/clasify_api`) |
| Autenticación | JWT para escribir y para `/me`; pública para recibidas |
| Formato | JSON |
| Error uniforme | `{ "error": { "codigo", "mensaje", "campo" } }` |

## 1. Valoraciones recibidas

```text
GET /usuarios/:id/valoraciones?pagina=1&limite=20
```

Success `200`: sobre `{ datos, paginacion }` con autor, puntuación, comentario y fecha.

Rules:

- Público.
- Orden por fecha descendente.
- `limite` admite 10, 20 o 50 desde la interfaz.
- `404` si el usuario no existe.

## 2. Valoraciones escritas

```text
GET /usuarios/me/valoraciones?pagina=1&limite=20
Authorization: Bearer <token>
```

Success `200`: sobre `{ datos, paginacion }` con destinatario, puntuación, comentario, fecha y resumen del destinatario.

Rules:

- Solo las valoraciones del usuario autenticado.
- `limite` admite 10, 20 o 50.
- `401` limpia la sesión.

## 3. Crear o actualizar valoración

```text
PUT /usuarios/:id/valoracion
Authorization: Bearer <token>
```

Request:

```json
{ "puntuacion": 5, "comentario": "Muy buena experiencia" }
```

Success:

- `201` si es nueva.
- `200` si actualiza una existente.

Response: `{ datos: { nuevo, valoracion } }`.

Errors:

| Status | Code | Handling |
|---|---|---|
| `400` | `VALIDACION` | Puntuación o comentario inválidos |
| `401` | Sesión | Limpiar sesión |
| `404` | `NO_ENCONTRADO` | Usuario no encontrado |

Rules:

- Puntuación entera 1–5.
- Comentario opcional, máximo 500; vacío se guarda como ausencia.
- No se puede valorar a uno mismo.
- La operación es idempotente y actualiza sin duplicados.

## 4. Eliminar valoración

```text
DELETE /usuarios/:id/valoracion
Authorization: Bearer <token>
```

Success: `204 No Content`.

Errors:

| Status | Code | Handling |
|---|---|---|
| `401` | Sesión | Limpiar sesión |
| `404` | `NO_ENCONTRADO` | No había valoración |

Rules:

- `204` deja el estado sin valoración.
- `404` también converge a sin valoración sin error incomprensible.
- Requiere confirmación en la interfaz.

## 5. Response Handling

| Status | Handling |
|---|---|
| `200` / `201` | Éxito |
| `204` | Eliminada |
| `400` | Error de validación por campo |
| `401` | Limpiar sesión y solicitar acceso |
| `404` | Usuario o valoración no encontrados |
| `5xx` / red | Error comprensible y reintento |

## 6. Out of Scope

- Moderación.
- Respuestas a valoraciones.
- Votos de utilidad.
- Valoraciones anónimas.
- Ordenación personalizada.
- Modificaciones del backend.
