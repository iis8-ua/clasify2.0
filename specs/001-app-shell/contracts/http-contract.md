# HTTP Contract: Capa base del frontend

**Feature**: `001-app-shell`  
**Date**: 2026-11-10

## 1. Configuration

| Setting | Source | Rule |
|---|---|---|
| Base URL | `VITE_API_URL` | Obligatoria; debe incluir `/clasify_api` |
| Token provider | Frontera de sesión | La spec 002 la conecta a `sessionStorage` |
| Unauthorized handler | Frontera de sesión | La spec 002 decide si un `401` invalida la sesión |
| Content type | Petición | `application/json` salvo `FormData` |
| Credenciales | Navegador | Sin cookies de autenticación; el backend usa `Authorization` |

La capa HTTP no contiene direcciones de desarrollo codificadas. La URL se lee de la configuración
de entorno y se valida al arrancar.

## 2. Request API

```text
request(path, options)
  method: GET | POST | PATCH | DELETE
  body: JSON object | FormData | undefined
  auth: boolean
  signal: AbortSignal | undefined
  conEstado: boolean
```

Rules:

- `path` es relativo a la URL base y empieza por `/`.
- Si `auth` es verdadero, se añade `Authorization: Bearer <token>` cuando exista token.
- Si el cuerpo es `FormData`, no se fija `Content-Type` manualmente.
- Si el cuerpo es un objeto, se serializa como JSON.
- Por defecto, una respuesta `204` devuelve `null` y no intenta leer cuerpo, y una respuesta
  correcta con cuerpo se devuelve como objeto de datos.
- Si `conEstado` es verdadero, una respuesta correcta se devuelve como `{ estado, datos }`; una
  respuesta `204` se devuelve como `{ estado: 204, datos: null }`.
- `conEstado` se reserva para las operaciones que necesitan distinguir dos respuestas correctas del
  mismo endpoint, como el `201` de un favorito nuevo y el `200` de uno ya guardado.
- Los listados conservan el sobre `{ datos, paginacion }` que devuelve el backend.
- No se inventan endpoints ni transformaciones específicas de negocio en esta feature.

## 3. Normalized Error

```text
{
  estado: number,
  codigo: string,
  mensaje: string,
  campo: string | null,
  tipo: "http" | "conexion" | "interno"
}
```

Rules:

- `estado` es el código HTTP; para errores de conexión se usa `0`.
- `codigo` conserva el código del backend cuando existe; si no, se usa un código estable del
  frontend.
- `mensaje` es el mensaje visible del backend cuando existe; si no, un mensaje en español.
- `campo` solo aparece cuando el backend lo devuelve.
- `tipo` distingue errores HTTP, de conexión y fallos internos.
- No se muestran trazas ni detalles internos al usuario.

## 4. Status Handling

| Status | Handling in HTTP layer | UI responsibility |
|---|---|---|
| `200` | Devuelve datos, o `{ estado, datos }` con `conEstado` | La vista muestra el contenido |
| `201` | Devuelve datos, o `{ estado, datos }` con `conEstado` | La vista muestra confirmación |
| `204` | Devuelve `null`, o `{ estado: 204, datos: null }` con `conEstado` | La vista no intenta leer cuerpo |
| `400` | Error normalizado con `campo` | Formulario asocia el error |
| `401` | Error normalizado; invoca `onUnauthorized` | La sesión decide si limpia o muestra error de formulario |
| `403` | Error normalizado | Vista de permisos |
| `404` | Error normalizado | Vista de no encontrado |
| `409` | Error normalizado | Mensaje de conflicto |
| `413` | Error normalizado | Mensaje de tamaño |
| `5xx` | Error normalizado | Mensaje general |
| Fallo de red | Error `tipo: "conexion"` | Mensaje comprensible y reintento si procede |

### 401 boundary

La capa HTTP no limpia la sesión por sí misma. Entrega el error completo a la frontera de sesión.
La spec 002 decide cuándo un `401` significa sesión caducada y cuándo es un error de credenciales
del formulario, como una contraseña actual incorrecta.

## 5. Response Shapes

### Correct response

```json
{
  "datos": {}
}
```

### Paginated response

```json
{
  "datos": [],
  "paginacion": {
    "pagina": 1,
    "limite": 20,
    "total": 0,
    "paginas": 0
  }
}
```

### Error response

```json
{
  "error": {
    "codigo": "VALIDACION",
    "mensaje": "Mensaje comprensible",
    "campo": "campo"
  }
}
```

`campo` es opcional.

## 6. Security

- El token no se incluye en URLs, logs ni mensajes de error.
- El token no se muestra en la interfaz.
- La capa HTTP no decide permisos ni oculta datos; solo transporta y normaliza.
- La autorización real permanece en el backend.
- No se almacenan secretos en el repositorio.
- No se registran cuerpos con contraseñas.

## 7. Out of Scope

- Llamadas a endpoints concretos de negocio.
- Lógica de sesión, login, registro o logout.
- Reintentos automáticos.
- Caché de respuestas.
- Cancelación avanzada de peticiones.
- Interceptores de terceros.
- Mocks permanentes en la aplicación.
