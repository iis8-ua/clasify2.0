# Messaging UI Contract

**Feature**: `007-mensajeria`  
**Date**: 2026-11-11

## 1. Rutas

| Ruta | Nombre | Acceso | Vista |
|---|---|---|---|
| `/mensajes` | `mensajes` | Protegida | `MensajesView` |
| `/conversaciones/:id` | `conversacion` | Protegida | `ConversacionView` |

Rules:

- La cabecera muestra **Mensajes** solo con sesión.
- Las dos rutas conservan la ruta solicitada si se requiere acceso.
- El detalle enlaza a la conversación cuando ya existe.

## 2. Bandeja

Cada `TarjetaConversacion` muestra:

| Elemento | Regla |
|---|---|
| Imagen | Diferida; marcador si no existe |
| Anuncio | Título y precio |
| Contraparte | Nombre y enlace a `/usuarios/:id` |
| Último mensaje | Texto y fecha |
| No leídos | Contador por conversación |
| Enlace | Abre el hilo |

Query:

| Parámetro | Valores | Default |
|---|---|---|
| `pagina` | Entero `>= 1` | 1 |
| `limite` | `10`, `20`, `50` | 20 |

Rules:

- Orden por actividad reciente.
- Cambiar el tamaño vuelve a la primera página.
- Página y tamaño se conservan en la URL.
- Estado vacío específico con invitación a explorar anuncios.
- No hay contador global de no leídos en la cabecera.

## 3. Hilo

La vista `ConversacionView` contiene:

- Cabecera con anuncio y contraparte.
- Lista de mensajes en orden cronológico dentro de la página.
- Botón para cargar mensajes anteriores.
- Formulario de envío.

Query:

| Parámetro | Valores | Default |
|---|---|---|
| `pagina` | Entero `>= 1` | 1 |
| `limite` | `10`, `20`, `50` | 20 |
| `desde` | `inicio`, `final` | `final` |

Rules:

- La apertura usa `desde=final`.
- Cargar anteriores conserva el hilo y no duplica mensajes.
- Abrir el hilo marca como leídos los mensajes pendientes.
- Los mensajes propios y ajenos se distinguen visualmente sin depender solo del color.
- Los mensajes llevan fecha y emisor.
- Si no existe la conversación: no encontrado.
- Si no se participa: permisos.
- Los enlaces al perfil público abren `/usuarios/:id`.

## 4. Formulario de mensaje

| Campo | Control | Reglas |
|---|---|---|
| `texto` | Área de texto | Obligatorio; máximo 1000 |

States:

- `idle`.
- `enviando`.
- `error`.

Rules:

- El botón se deshabilita mientras envía.
- El texto no se pierde si falla la conexión.
- El error se asocia al campo o se muestra como error general.
- El mensaje enviado aparece sin recargar la página.
- El formulario es usable con teclado y a 360 px.

## 5. Contactar desde el detalle

Location:

- Solo en el detalle de un anuncio ajeno.

Rules:

- Si no hay conversación, abre `ModalContactar`.
- Si ya hay conversación, abre el hilo.
- El modal pide el primer mensaje y lo envía al endpoint del anuncio.
- El autor no ve la acción.
- Un anuncio vendido sin hilo previo deshabilita la acción con aviso.
- Un anuncio vendido con hilo permite abrir la conversación.
- Visitante: login, retorno al anuncio y reapertura manual del modal.
- Mientras envía, el botón se deshabilita.
- Un error conserva el texto y muestra un mensaje comprensible.

## 6. Últimos mensajes en el detalle

- Solo se muestran a participantes.
- Se muestran los últimos tres mensajes y el total.
- No marcan como leídos.
- Incluyen enlace al hilo completo.

## 7. Permisos

| Situación | UI |
|---|---|
| Visitante | No accede a bandeja ni hilo; Contactar pide acceso |
| Autenticado | Accede a sus conversaciones y puede escribir |
| Autor del anuncio | No ve Contactar en su anuncio; usa la bandeja para sus hilos |
| No participante | No accede al hilo |
| Sesión caducada | Limpia sesión, datos privados y solicita acceso |

## 8. Errores

| Status | Handling |
|---|---|
| `400` | Error de validación por campo |
| `401` | Limpiar sesión y solicitar acceso |
| `403` | Error de permisos |
| `404` | Conversación o anuncio no encontrado |
| `5xx` / red | Mensaje comprensible y reintento |

Rules:

- Mensajes en español.
- Sin detalles técnicos.
- Un error no deja mensajes privados obsoletos visibles.

## 9. Accesibilidad

- Bandeja, hilo y formulario accesibles por teclado.
- Foco visible en ambos temas.
- Etiquetas en el formulario y en la paginación.
- Estados de carga, vacío, error y éxito legibles por lector de pantalla.
- Sin desplazamiento horizontal no intencionado a 360 px.
- Jerarquía de encabezados comprensible.

## 10. Out of Scope

- Tiempo real.
- Adjuntos.
- Notificaciones push o email.
- Conversaciones grupales.
- Búsqueda de mensajes.
- Moderación.
- Contador global en cabecera.
- Cambios en el backend.
