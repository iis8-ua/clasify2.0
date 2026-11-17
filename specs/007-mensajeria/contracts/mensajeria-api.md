# Messaging API Contract

**Feature**: `007-mensajeria`  
**Date**: 2026-11-11

## Base

| Aspecto | Valor |
|---|---|
| URL base | `VITE_API_URL` (`http://localhost:3000/clasify_api`) |
| Autenticación | `Authorization: Bearer <token>` |
| Formato | JSON |
| Error uniforme | `{ "error": { "codigo", "mensaje", "campo" } }` |

## 1. Bandeja de conversaciones

```text
GET /usuarios/me/conversaciones?pagina=1&limite=20
Authorization: Bearer <token>
```

Success `200`:

```json
{
  "datos": [
    {
      "id": 4,
      "fecha_creacion": "2026-11-11T10:00:00.000Z",
      "anuncio": {
        "id": 25,
        "titulo": "Bicicleta",
        "precio": "250.00",
        "estado": "disponible",
        "imagen": null,
        "fecha_creacion": "2026-11-10T10:00:00.000Z",
        "id_categoria": 8
      },
      "contraparte": {
        "id": 1,
        "nombre": "Ana Ruiz",
        "biografia": "Perfil de prueba.",
        "fecha_alta": "2026-11-10T09:00:00.000Z"
      },
      "ultimo_mensaje": {
        "id": 12,
        "texto": "¿Sigue disponible?",
        "fecha": "2026-11-11T11:00:00.000Z"
      },
      "no_leidos": 2
    }
  ],
  "paginacion": { "pagina": 1, "limite": 20, "total": 1, "paginas": 1 }
}
```

Rules:

- Devuelve conversaciones como comprador y como vendedor.
- Ordena por actividad reciente.
- `limite` admite 10, 20 o 50 desde la interfaz.
- La página fuera de rango devuelve datos vacíos y paginación real.
- `401` limpia la sesión.

## 2. Hilo de mensajes

```text
GET /conversaciones/:id/mensajes?pagina=1&limite=20&desde=final
Authorization: Bearer <token>
```

Success `200`: sobre `{ datos, paginacion }` con mensajes en orden cronológico dentro de la página.

Rules:

- Solo participantes; `403` si no participa y `404` si no existe.
- `desde=final` abre en los últimos mensajes.
- Marca como leídos los mensajes pendientes del otro participante.
- Devuelve `no_leidos` con el total marcado.
- `limite` admite 10, 20 o 50.

## 3. Enviar mensaje

```text
POST /conversaciones/:id/mensajes
Authorization: Bearer <token>
```

Request:

```json
{ "texto": "Sigo interesado" }
```

Success `201`:

```json
{ "datos": { "mensaje": { "id": 13, "texto": "Sigo interesado", "fecha": "...", "leido": false, "id_conversacion": 4, "id_emisor": 2 } } }
```

Errors: `400 VALIDACION` con `campo: "texto"`, `401`, `403`, `404`.

Rules:

- Texto obligatorio, recortado y máximo 1000 caracteres.
- Solo participantes.

## 4. Iniciar conversación desde un anuncio

```text
POST /anuncios/:id/mensajes
Authorization: Bearer <token>
```

Request:

```json
{ "texto": "Hola, ¿sigue disponible?" }
```

Success:

- `201` si la conversación es nueva.
- `200` si ya existía.

Response: `{ datos: { conversacion, mensaje } }`.

Errors:

| Status | Code | Handling |
|---|---|---|
| `400` | `VALIDACION` | Anuncio propio o anuncio vendido sin hilo previo |
| `401` | Sesión | Limpiar sesión |
| `404` | `NO_ENCONTRADO` | Anuncio inexistente |

Rules:

- No se puede iniciar un hilo sobre un anuncio propio.
- No se puede iniciar un hilo nuevo sobre un anuncio vendido.
- Si ya existe hilo, se reutiliza.
- La acción se ofrece solo desde el detalle.

## 5. Conversación del comprador

```text
GET /anuncios/:id/mensajes?pagina=1&limite=20
Authorization: Bearer <token>
```

Success `200` con `{ datos, paginacion }` y mensajes del comprador con el vendedor del anuncio.

Errors: `400` si el usuario es el vendedor; `401`; `404`.

Rules:

- Es una ruta de apoyo para el comprador.
- El vendedor usa la bandeja.
- El detalle puede incluir `conversacion`, `ultimos_mensajes` y `num_mensajes` para participantes.

## 6. Response Handling

| Status | Handling |
|---|---|
| `200` / `201` | Éxito |
| `400` | Error de validación por campo |
| `401` | Limpiar sesión y solicitar acceso |
| `403` | Error de permisos |
| `404` | Conversación o anuncio no encontrado |
| `5xx` / red | Error comprensible y reintento |

## 7. Out of Scope

- Tiempo real.
- Adjuntos.
- Notificaciones push o email.
- Conversaciones grupales.
- Búsqueda de mensajes.
- Moderación.
- Modificaciones del backend.
