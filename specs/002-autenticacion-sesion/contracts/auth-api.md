# Auth API Contract: Registro, acceso y sesión

**Feature**: `002-autenticacion-sesion`  
**Date**: 2026-11-10

## Base

| Aspecto | Valor |
|---|---|
| URL base | `VITE_API_URL` (`http://localhost:3000/clasify_api`) |
| Formato | JSON |
| Autenticación | `Authorization: Bearer <token>` |
| Error uniforme | `{ "error": { "codigo", "mensaje", "campo" } }` |
| Token | JWT firmado por el backend; no se inspecciona en el frontend |
| Refresh token | No existe |

## 1. Registro

```text
POST /auth/register
```

Request:

```json
{
  "email": "usuario@example.com",
  "nombre": "Nombre",
  "password": "Clasify123!"
}
```

Success `201`:

```json
{
  "datos": {
    "token": "<jwt>",
    "usuario": {
      "id": 1,
      "email": "usuario@example.com",
      "nombre": "Nombre"
    }
  }
}
```

Errors:

| Status | Code | Handling |
|---|---|---|
| `400` | `VALIDACION` | Error de campo; usar `campo` |
| `409` | `EMAIL_DUPLICADO` | Error asociado a `email` |
| `5xx` | — | Error general comprensible |

Rules:

- No se envía `id` ni `password_hash`.
- El frontend no envía un campo de confirmación de contraseña.
- Un registro correcto inicia la sesión y redirige al listado.

## 2. Acceso

```text
POST /auth/login
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
| `400` | `VALIDACION` | Error de campo |
| `401` | `CREDENCIALES_INVALIDAS` | Mensaje general; no revelar si el email existe |
| `5xx` | — | Error general comprensible |

Rules:

- Un acceso correcto redirige a la ruta solicitada o al listado.
- Las credenciales incorrectas no limpian una sesión existente por cambio de contraseña; ese caso se trata como error de formulario.

## 3. Sesión actual

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
      "fecha_alta": "2026-11-10T10:00:00.000Z",
      "valoracion_media": null,
      "num_valoraciones": 0
    }
  }
}
```

Errors:

| Status | Code | Handling |
|---|---|---|
| `401` | `SIN_TOKEN` | Limpiar sesión |
| `401` | `TOKEN_INVALIDO` | Limpiar sesión |
| `401` | `TOKEN_CADUCADO` | Limpiar sesión y solicitar acceso |
| `401` | `USUARIO_NO_EXISTE` | Limpiar sesión |
| `5xx` / red | — | Estado de error; conservar token y permitir reintento |

Rules:

- `/auth/yo` es la única fuente para restaurar la identidad después de una recarga.
- No se persiste el usuario en `sessionStorage`.
- No se inventa una sesión válida si la comprobación falla por red.

## 4. Logout

No existe endpoint de logout.

Rules:

- El cierre de sesión elimina el token de `sessionStorage`.
- El usuario y los datos privados se eliminan del estado en memoria.
- No se llama a un endpoint inexistente.
- El cierre afecta a la pestaña actual.

## 5. Response Handling

| Status | Handling |
|---|---|
| `200` | Datos de sesión o usuario |
| `201` | Registro correcto |
| `204` | No aplica a esta feature |
| `400` | Error de validación por campo |
| `401` de sesión | Limpiar sesión |
| `401` de credenciales | Error de formulario |
| `403` | No aplica al flujo de autenticación |
| `404` | No aplica al flujo de autenticación |
| `409` | Email duplicado |
| `5xx` | Error general sin detalles internos |

## 6. Security

- El token no se registra en consola ni se incluye en URLs.
- La contraseña no se persiste ni se muestra después del envío.
- El email no se revela en mensajes de credenciales incorrectas.
- El frontend no inspecciona ni valida la firma del JWT.
- La autorización real la comprueba el backend.
- No se usan datos simulados en la aplicación.
