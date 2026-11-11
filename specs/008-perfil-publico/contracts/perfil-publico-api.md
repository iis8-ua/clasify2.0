# Public Profile API Contract

**Feature**: `008-perfil-publico`  
**Date**: 2026-11-11

## Base

| Aspecto | Valor |
|---|---|
| URL base | `VITE_API_URL` (`http://localhost:3000/clasify_api`) |
| Formato | JSON |
| Autenticación | Opcional en el perfil; pública en los listados |
| Error uniforme | `{ "error": { "codigo", "mensaje", "campo" } }` |

## 1. Perfil público

```text
GET /usuarios/:id
Authorization: Bearer <token>   (opcional)
```

Success `200`:

```json
{
  "datos": {
    "usuario": {
      "id": 1,
      "nombre": "Ana Ruiz",
      "biografia": "Perfil de prueba.",
      "fecha_alta": "2026-11-10T09:00:00.000Z",
      "valoracion_media": 4.5,
      "num_valoraciones": 2,
      "mi_valoracion": {
        "puntuacion": 4,
        "comentario": "Buena experiencia",
        "fecha": "2026-11-11T10:00:00.000Z"
      }
    }
  }
}
```

Rules:

- No incluye email ni password.
- `mi_valoracion` solo aparece si hay sesión y el usuario ya valoró.
- `404` si el usuario no existe.

## 2. Anuncios del usuario

```text
GET /usuarios/:id/anuncios?pagina=1&limite=20
```

Success `200`: sobre `{ datos, paginacion }` con los campos del listado de 003.

Rules:

- Público.
- Incluye disponibles y vendidos.
- Orden por fecha de creación descendente.
- `limite` admite 10, 20 o 50 desde la interfaz.
- Página fuera de rango: datos vacíos y paginación real.

## 3. Valoraciones recibidas

```text
GET /usuarios/:id/valoraciones?pagina=1&limite=20
```

Success `200`:

```json
{
  "datos": [
    {
      "id": 7,
      "puntuacion": 5,
      "comentario": "Muy bien",
      "fecha": "2026-11-11T10:00:00.000Z",
      "autor": { "id": 2, "nombre": "Carlos Díaz" }
    }
  ],
  "paginacion": { "pagina": 1, "limite": 20, "total": 1, "paginas": 1 }
}
```

Rules:

- Público y de solo lectura.
- Orden por fecha descendente.
- `limite` admite 10, 20 o 50.
- `404` si el usuario no existe.

## 4. Response Handling

| Status | Handling |
|---|---|
| `200` | Éxito |
| `400` | Identificador o página inválidos |
| `404` | Usuario no encontrado |
| `5xx` / red | Error comprensible y reintento |

## 5. Out of Scope

- Edición del perfil público.
- Avatar.
- Seguimiento.
- Acciones de valoración; se especifican en 009.
- Mensajería; se especifica en 007.
- Gestión de anuncios.
- Moderación.
- Modificaciones del backend.
