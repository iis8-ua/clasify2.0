# Historia 14 - Cambio de estado del anuncio

> **Prioridad:** Obligatoria  
> **Depende de:** Historias 02 y 05  
> **Endpoint principal:** `PATCH /clasify_api/anuncios/:id/estado`

#### Historia de usuario: Como autor de un anuncio, quiero marcarlo como vendido o volver a ponerlo disponible, para reflejar su situación real sin eliminarlo.

#### Especificación (spec)

El autor puede cambiar el estado de su anuncio entre `disponible` y `vendido`. La acción debe estar
disponible desde el detalle y, si se decide, desde el listado de anuncios propios. Solo el autor
puede realizarla; el frontend debe ocultarla a los demás usuarios y el backend seguirá comprobando
la propiedad.

El cambio de estado se envía a `PATCH /anuncios/:id/estado` con el nuevo estado. El frontend debe
pedir confirmación antes de marcar un anuncio como vendido, porque el anuncio deja de aparecer en
el listado público por defecto. También debe permitir volver a marcarlo como disponible. Durante la
operación se muestra un estado de carga y se impide un doble envío.

Tras un cambio correcto, el frontend debe actualizar el detalle y el listado. Si el anuncio pasa a
vendido, debe desaparecer del listado por defecto y seguir siendo accesible desde el enlace directo
a su detalle. Si vuelve a disponible, debe reaparecer en el listado por defecto. Si el backend
responde `403`, se muestra un error de permisos; si responde `404`, se informa de que el anuncio no
existe; si el token caduca, se limpia la sesión.

Esta historia forma parte del alcance acordado. La edición de los datos del anuncio se documenta en la historia 07.

#### Criterios de aceptación

- La acción de cambiar estado solo se muestra al autor del anuncio.
- El autor puede marcar un anuncio disponible como vendido.
- El autor puede volver a marcar un anuncio vendido como disponible.
- Antes de marcar como vendido se solicita confirmación.
- La petición envía `estado` con el valor `disponible` o `vendido`.
- Durante el cambio se muestra carga y se impide el doble envío.
- Un cambio correcto devuelve `200` y actualiza el detalle.
- Un anuncio vendido desaparece del listado público por defecto.
- Un anuncio vendido sigue siendo accesible mediante su detalle directo.
- Un anuncio que vuelve a disponible reaparece en el listado por defecto.
- Un `403` muestra un error de permisos.
- Un `404` muestra un estado de anuncio no encontrado.
- Un `401` limpia la sesión y solicita login.
- El estado se muestra de forma clara en el detalle y en el listado cuando corresponda.

#### Contrato del backend

| Aspecto | Detalle |
|---|---|
| Método y ruta | `PATCH /clasify_api/anuncios/:id/estado` |
| Autenticación | `Authorization: Bearer <token>` del autor |
| Cuerpo | `{ "estado": "disponible" }` o `{ "estado": "vendido" }` |
| Respuesta correcta | `200 { "datos": { "anuncio": { ...detalle actualizado... } } }` |
| Estado inválido | `400 { "error": { "codigo": "VALIDACION", "mensaje": "...", "campo": "estado" } }` |
| Sin permisos | `403 { "error": { "codigo": "SIN_PERMISOS", "mensaje": "..." } }` |
| No encontrado | `404 { "error": { "codigo": "NO_ENCONTRADO", "mensaje": "..." } }` |

#### Estados de interfaz

- Anuncio disponible.
- Anuncio vendido.
- Confirmación de cambio a vendido.
- Cambio en curso.
- Cambio correcto.
- Error de permisos.
- Anuncio no encontrado.
- Sesión caducada.
- Error de conexión.

#### Fuera de alcance

- Edición de los datos del anuncio.
- Historial de cambios de estado.
- Programación automática de la venta.
- Estados distintos de `disponible` y `vendido`.
