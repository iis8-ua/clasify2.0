# Profile API Contract

**Feature**: `006-perfil`  
**Date**: 2026-11-10

## Base

| Aspecto | Valor |
|---|---|
| URL base | `VITE_API_URL` (`http://localhost:3000/clasify_api`) |
| Autenticación | `Authorization: Bearer <token>` |
| Formato | JSON |
| Error uniforme | `{ "error": { "codigo", "mensaje", "campo" } }` |

## 1. Consultar perfil propio

```text
GET /usuarios/me
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
      "fecha_alta": "2026-11-10T09:00:00.000Z",
      "valoracion_media": null,
      "num_valoraciones": 0
    }
  }
}
```

Errors:

| Status | Code | Handling |
|---|---|---|
| `401` | Sesión | Limpiar sesión y solicitar acceso |
| `5xx` / red | — | Error comprensible con reintento |

Rules:

- Solo devuelve el perfil del usuario autenticado.
- El email es visible solo para el propio usuario.
- No se devuelve `password_hash`.

## 2. Editar perfil

```text
PATCH /usuarios/me
Authorization: Bearer <token>
```

Request permitido:

```json
{
  "nombre": "Ana Ruiz",
  "biografia": "Nueva biografía"
}
```

Cambio de contraseña:

```json
{
  "password": "NuevaClave123!",
  "password_actual": "Clasify123!"
}
```

Success `200`:

```json
{
  "datos": {
    "usuario": {
      "id": 1,
      "email": "ana@example.com",
      "nombre": "Ana Ruiz",
      "biografia": "Nueva biografía",
      "fecha_alta": "2026-11-10T09:00:00.000Z",
      "valoracion_media": null,
      "num_valoraciones": 0
    }
  }
}
```

Errors:

| Status | Code | Handling |
|---|---|---|
| `400` | `VALIDACION` | Error de campo |
| `400` con `email` | `VALIDACION` | El email no se puede cambiar |
| `401` de sesión | Sesión | Limpiar sesión |
| `401` `CREDENCIALES_INVALIDAS` | Contraseña actual incorrecta | Error de formulario; no cerrar sesión |
| `5xx` / red | — | Error comprensible |

Rules:

- El email no se envía.
- El nombre y la biografía se envían solo si cambian.
- La contraseña nueva requiere la actual.
- La contraseña nueva debe tener al menos 8 caracteres.
- No se envía una operación sin campos editables.

## 3. Anuncios propios

```text
GET /usuarios/me/anuncios?pagina=1&limite=20
Authorization: Bearer <token>
```

Success `200`:

```json
{
  "datos": [
    {
      "id": 1,
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
| `5xx` / red | — | Error comprensible con reintento |

Rules:

- Solo devuelve anuncios del usuario autenticado.
- Incluye anuncios vendidos con su estado.
- El tamaño de página es 20 por defecto y la interfaz permite 10, 20 o 50.
- La página fuera de rango devuelve datos vacíos y la paginación real; el frontend corrige a la
  última página solo tras una carga correcta.
- Las acciones de gestión no se realizan desde esta lista.

## 4. Perfil público propio

```text
GET /usuarios/:id
Authorization: Bearer <token>   (opcional)
```

Se usa para el enlace al perfil público propio y su contenido se especifica en 008.

Rules:

- El perfil público no incluye email ni datos privados.
- El enlace desde `/perfil` usa el identificador del usuario autenticado.
- La vista pública y sus listados pertenecen a 008.

## 5. Response Handling

| Status | Handling |
|---|---|
| `200` | Perfil o lista |
| `400` | Validación |
| `401` de sesión | Limpiar sesión |
| `401` de contraseña actual | Error de formulario; mantener sesión |
| `5xx` / red | Error comprensible y reintento |

## 6. Out of Scope

- Implementación del perfil público de otros usuarios; se especifica en 008.
- Cambio de email.
- Avatar o imagen de perfil.
- Eliminación de cuenta.
- Recuperación de contraseña.
- Verificación de email.
- Autenticación en dos pasos.
- Búsqueda, filtros u ordenación de anuncios propios.
- Modificaciones del backend.
