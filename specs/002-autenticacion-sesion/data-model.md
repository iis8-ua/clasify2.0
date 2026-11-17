# Data Model: Registro, acceso y sesión de usuario

**Feature**: `002-autenticacion-sesion`  
**Date**: 2026-11-10

## Overview

El modelo describe la cuenta, las credenciales, la sesión de presentación y los estados de los formularios de acceso y registro. El backend sigue siendo la autoridad sobre la identidad y las credenciales.

## Entities

### Credenciales

Datos introducidos para iniciar sesión.

| Campo | Tipo | Reglas |
|---|---|---|
| `email` | string | Obligatorio; formato de email; máximo 255 caracteres; se recorta |
| `password` | string | Obligatorio; no se muestra ni se persiste |

### Registro

Datos necesarios para crear una cuenta.

| Campo | Tipo | Reglas |
|---|---|---|
| `email` | string | Obligatorio; formato válido; máximo 255 caracteres; único en el sistema |
| `nombre` | string | Obligatorio; máximo 100 caracteres; se recorta |
| `password` | string | Obligatorio; mínimo 8 caracteres |

No incluye confirmación de contraseña en esta versión.

### UsuarioSesion

Identidad disponible en el frontend después de acceder.

| Campo | Tipo | Origen | Reglas |
|---|---|---|---|
| `id` | number | Login, registro o `/auth/yo` | Identificador del usuario |
| `email` | string | Login, registro o `/auth/yo` | Solo visible para el propio usuario |
| `nombre` | string | Login, registro o `/auth/yo` | Se muestra en la cabecera |
| `biografia` | string \| null | `/auth/yo` | Opcional; máximo 500 caracteres |
| `fecha_alta` | string | `/auth/yo` | Fecha devuelta por el backend |
| `valoracion_media` | number \| null | `/auth/yo` | Resumen de valoraciones |
| `num_valoraciones` | number | `/auth/yo` | Número de valoraciones |

Reglas:

- El `password_hash` no se modela en el frontend.
- El email no se expone en perfiles de otras cuentas.
- El usuario se mantiene en memoria; no se persiste en `sessionStorage`.

### Sesion

Estado completo de autenticación del frontend.

| Campo | Tipo | Reglas |
|---|---|---|
| `token` | string \| null | Se guarda en `sessionStorage` con la clave `clasify.session.token` |
| `usuario` | `UsuarioSesion` \| null | En memoria |
| `estado` | `EstadoSesion` | Estado actual |
| `error` | `ErrorAutenticacion` \| null | Último error relevante |
| `sessionVersion` | number | Se incrementa al iniciar y cerrar sesión; las stores privadas lo observan |

### EstadoSesion

| Valor | Significado |
|---|---|
| `inicial` | La aplicación aún no ha comprobado la sesión |
| `comprobando` | Se está validando un token guardado |
| `autenticado` | Hay usuario y sesión válidos |
| `visitante` | No hay sesión válida |
| `error` | No se ha podido comprobar la sesión por un fallo de conexión |

Reglas:

- `comprobando` no habilita acciones privadas.
- `error` conserva el token y permite reintentar; no inventa una sesión válida.
- `visitante` no muestra datos privados.
- `autenticado` actualiza la cabecera y las guardas.

### FormularioAuth

Estado local de un formulario de acceso o registro.

| Campo | Tipo | Reglas |
|---|---|---|
| `values` | objeto | Valores actuales del formulario |
| `errors` | map<string, string> | Errores por campo |
| `submitting` | boolean | Verdadero durante el envío |
| `touched` | map<string, boolean> | Campos visitados |
| `dirty` | boolean | Indica cambios sin guardar |
| `generalError` | string \| null | Error de conexión o error general |

Reglas:

- No se envían dos veces.
- Los errores del backend se asocian al campo `campo` cuando existe.
- El email se conserva tras un fallo de conexión.
- La contraseña se limpia de la vista cuando el formulario se envía.

### ErrorAutenticacion

| Campo | Tipo | Reglas |
|---|---|---|
| `estado` | number | Código HTTP o `0` para error de conexión |
| `codigo` | string | Código del backend o código estable del frontend |
| `mensaje` | string | Mensaje comprensible en español |
| `campo` | string \| null | Campo afectado, si existe |
| `tipo` | `http` \| `conexion` \| `interno` | Origen del error |

Códigos relevantes:

| Código | Tratamiento |
|---|---|
| `VALIDACION` | Error de formulario por campo |
| `EMAIL_DUPLICADO` | Error asociado a `email` |
| `CREDENCIALES_INVALIDAS` | Error general de acceso; no limpia una sesión existente por cambio de contraseña |
| `SIN_TOKEN` | Sesión inválida |
| `TOKEN_INVALIDO` | Sesión inválida |
| `TOKEN_CADUCADO` | Sesión caducada |
| `USUARIO_NO_EXISTE` | Sesión inválida |

## State Transitions

### Arranque de la aplicación

```text
inicial
  -> comprobando          (hay token guardado)
  -> visitante            (no hay token)

comprobando
  -> autenticado          (usuario recuperado)
  -> visitante            (401 de sesión)
  -> error                (fallo de conexión)
```

### Registro

```text
visitante -> enviando -> autenticado
                     -> visitante con errores
```

### Acceso

```text
visitante -> enviando -> autenticado
                     -> visitante con credenciales incorrectas
```

### Cierre de sesión

```text
autenticado -> visitante
```

### Reintento de comprobación

```text
error -> comprobando -> autenticado | visitante | error
```

## Validation Rules

- Email obligatorio, formato válido y máximo 255 caracteres.
- Nombre obligatorio y máximo 100 caracteres.
- Contraseña obligatoria y mínimo 8 caracteres en registro.
- Contraseña actual obligatoria en un cambio de contraseña.
- El email duplicado se muestra en el campo `email`.
- Las credenciales incorrectas de acceso muestran un mensaje general.
- La vista no revela si un email existe o no.
- Las contraseñas no se muestran ni se registran.
- El formulario no se envía si ya está en curso.
- Los errores de validación se asocian al campo correspondiente.
- El email se conserva ante errores de conexión.
- No se crea una sesión válida sin una respuesta correcta del backend.

## Relationships

- Una `Sesion` contiene un `UsuarioSesion` y un `token`.
- Un `FormularioAuth` produce `Credenciales` o un `Registro`.
- Un `ErrorAutenticacion` puede afectar a un formulario o a la sesión completa.
- `sessionVersion` conecta la sesión con la limpieza de stores privadas de features posteriores.
- La cabecera de 001 consume el estado de `Sesion`.
- Las guardas de `router/guards.js` consumen `estaAutenticado`.
