# Favorites API Contract

**Feature**: `005-favoritos`  
**Date**: 2026-11-10

## Base

| Aspecto | Valor |
|---|---|
| URL base | `VITE_API_URL` (`http://localhost:3000/clasify_api`) |
| Autenticación | `Authorization: Bearer <token>` |
| Formato | JSON |
| Error uniforme | `{ "error": { "codigo", "mensaje", "campo" } }` |

## 1. Añadir favorito

```text
POST /anuncios/:id/favorito
Authorization: Bearer <token>
```

Success:

- `201` si es nuevo.
- `200` si ya estaba guardado.

Response:

```json
{
  "datos": {
    "favorito": {
      "id": 10,
      "fecha": "2026-11-10T12:00:00.000Z",
      "id_usuario": 1,
      "id_anuncio": 25
    }
  }
}
```

Errors:

| Status | Code | Handling |
|---|---|---|
| `400` | `VALIDACION` | No se puede guardar el propio anuncio |
| `401` | Sesión | Limpiar sesión y solicitar acceso |
| `404` | `NO_ENCONTRADO` | Anuncio no encontrado |

Rules:

- La operación es idempotente.
- `201` y `200` se tratan como éxito.
- El autor del anuncio no puede guardarlo en sus favoritos.
- La acción de añadir se ofrece desde el detalle.

## 2. Quitar favorito

```text
DELETE /anuncios/:id/favorito
Authorization: Bearer <token>
```

Success: `204 No Content`.

Errors:

| Status | Code | Handling |
|---|---|---|
| `401` | Sesión | Limpiar sesión y solicitar acceso |
| `404` | `NO_ENCONTRADO` | Favorito o anuncio inexistente |

Rules:

- Un `204` deja el estado no guardado.
- Un `404` de favorito inexistente también deja el estado no guardado, sin un error incomprensible.
- Se ofrece desde el detalle y desde cada tarjeta de la lista, con confirmación en la lista.

## 3. Listar favoritos

```text
GET /usuarios/me/favoritos?pagina=1&limite=20
Authorization: Bearer <token>
```

Success `200`:

```json
{
  "datos": [
    {
      "id": 25,
      "titulo": "Bicicleta de montaña",
      "precio": "250.00",
      "estado": "disponible",
      "imagen": "archivo.jpg",
      "fecha_creacion": "2026-11-08T10:00:00.000Z",
      "id_categoria": 8,
      "id_autor": 1
    }
  ],
  "paginacion": {
    "pagina": 1,
    "limite": 20,
    "total": 1,
    "paginas": 1
  }
}
```

Errors:

| Status | Code | Handling |
|---|---|---|
| `401` | Sesión | Limpiar sesión y solicitar acceso |
| `400` | `VALIDACION` | Página inválida |
| Red / `5xx` | — | Error comprensible con reintento |

Rules:

- Solo se devuelven favoritos del usuario autenticado.
- El orden es por fecha de guardado descendente.
- Los anuncios vendidos se incluyen con su estado.
- Los anuncios eliminados no se devuelven.
- El tamaño de página es 20 por defecto y la interfaz permite 10, 20 o 50.
- La página fuera de rango devuelve datos vacíos y la paginación real; el frontend corrige a la
  última página solo tras una carga correcta.

## 4. Response Handling

| Status | Handling |
|---|---|
| `200` | Favorito existente o lista |
| `201` | Favorito nuevo |
| `204` | Favorito eliminado |
| `400` | Anuncio propio o página inválida |
| `401` | Limpiar sesión |
| `404` | Anuncio o favorito no encontrado |
| `5xx` / red | Error comprensible y reintento si procede |

## 5. Out of Scope

- Favoritos compartidos.
- Listas públicas.
- Notificaciones.
- Acciones masivas.
- Búsqueda, filtros u ordenación personalizada.
- Sincronización entre dispositivos.
- Modificaciones del backend.
