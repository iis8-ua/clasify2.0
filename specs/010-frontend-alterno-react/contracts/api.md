# API Contract: Frontend alternativo con React

**Feature**: `010-frontend-alterno-react`
**Date**: 2026-11-16

## Base

| Aspecto | Valor |
|---|---|
| URL base | `VITE_API_URL` (`http://localhost:3000/clasify_api`) |
| Autenticación | `Authorization: Bearer <token>` |
| Formato | JSON |
| Error uniforme | `{ "error": { "codigo", "mensaje", "campo" } }` |

## 1. Iniciar sesión

```text
POST /auth/login
Content-Type: application/json
```

Request:

```json
{
  "email": "ana@example.com",
  "password": "Clasify123!"
}
```

Success `200`:

```json
{
  "datos": {
    "token": "<jwt>",
    "usuario": {
      "id": 1,
      "email": "ana@example.com",
      "nombre": "Ana Ruiz"
    }
  }
}
```

Errors:

| Status | Code | Handling |
|---|---|---|
| `400` | `VALIDACION` | Mostrar error de credenciales o campo |
| `401` | `CREDENCIALES_INVALIDAS` | Mostrar mensaje comprensible sin sesión |

Rules:

- El frontend guarda `token` en `sessionStorage`.
- El usuario se usa para identificar sus anuncios.
- No se muestra información privada si el acceso falla.

## 2. Recuperar sesión

```text
GET /auth/yo
Authorization: Bearer <token>
```

Success `200`:

```json
{
  "datos": {
    "usuario": {
      "id": 1,
      "email": "ana@example.com",
      "nombre": "Ana Ruiz",
      "biografia": "Perfil de prueba.",
      "fecha_alta": "2026-11-10T09:00:00.000Z"
    }
  }
}
```

Errors:

| Status | Code | Handling |
|---|---|---|
| `401` | Sesión | Limpiar token, usuario y acciones privadas |
| `5xx` / red | — | Mantener el listado público y permitir reintentar |

Rules:

- Se consulta al arrancar si hay token.
- Un token inválido no debe impedir el listado público.

## 3. Listar anuncios

```text
GET /anuncios?pagina=1&limite=20
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
      "imagen": "bicicleta.webp",
      "fecha_creacion": "2026-11-10T10:00:00.000Z",
      "id_categoria": 3,
      "id_autor": 2
    }
  ],
  "paginacion": {
    "pagina": 1,
    "limite": 20,
    "total": 24,
    "paginas": 2
  }
}
```

Rules:

- El listado es público.
- `limite` se envía siempre como `20`.
- `pagina` debe ser un entero positivo.
- El estado por defecto es `disponible`.
- La página fuera de rango devuelve datos vacíos y la paginación real.
- `id_autor` permite decidir si se muestra la acción de borrar.
- La categoría se resuelve con el listado de categorías.

## 4. Listar categorías

```text
GET /categorias?pagina=1&limite=100
```

Success `200`:

```json
{
  "datos": [
    { "id": 3, "nombre": "Deportes" },
    { "id": 1, "nombre": "Electrónica" }
  ],
  "paginacion": {
    "pagina": 1,
    "limite": 100,
    "total": 2,
    "paginas": 1
  }
}
```

Rules:

- Se consulta una vez al cargar la vista.
- Se construye un mapa `id → nombre`.
- Si falla, el listado sigue visible con un texto de respaldo.
- No se muestran ids de categoría sin nombre si hay un nombre disponible.

## 5. Eliminar anuncio

```text
DELETE /anuncios/:id
Authorization: Bearer <token>
```

Success `204`: sin cuerpo.

Errors:

| Status | Code | Handling |
|---|---|---|
| `401` | Sesión | Limpiar sesión y solicitar acceso |
| `403` | `PROHIBIDO` | Mostrar permisos y mantener el anuncio |
| `404` | `NO_ENCONTRADO` | Retirar el anuncio o mostrar que ya no existe |
| `5xx` / red | — | Mantener el anuncio y permitir reintentar |

Rules:

- Solo el autor puede borrar.
- El backend comprueba la autoría; la interfaz no la sustituye.
- La confirmación es obligatoria antes de llamar al endpoint.
- Tras `204`, se recarga la página actual.
- Si la página queda vacía y no es la primera, se carga la anterior.

## 6. Response Handling

| Status | Handling |
|---|---|
| `200` | Éxito |
| `204` | Borrado correcto |
| `400` | Error de validación |
| `401` | Limpiar sesión y solicitar acceso |
| `403` | Error de permisos |
| `404` | Anuncio no encontrado |
| `5xx` / red | Mensaje comprensible y reintento |

## 7. Out of Scope

- Crear anuncios.
- Editar anuncios.
- Consultar el detalle.
- Favoritos, perfil, mensajería y valoraciones.
- Búsqueda y filtros del catálogo.
- Cambios en el backend, el esquema o los contratos existentes.
