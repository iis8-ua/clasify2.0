# Historia 07 - Edición de un anuncio

> **Prioridad:** Obligatoria  
> **Depende de:** Historias 02 y 05  
> **Endpoint principal:** `PATCH /clasify_api/anuncios/:id`

#### Historia de usuario: Como autor de un anuncio, quiero editar sus datos y su imagen, para corregir o actualizar la información publicada.

#### Especificación (spec)

El autor del anuncio accede a la edición desde el detalle. El formulario debe cargarse con los
valores actuales del anuncio y permitir modificar título, descripción, precio, categoría e imagen.
La categoría se selecciona del catálogo real del backend. La imagen actual se muestra si existe y
puede sustituirse por otra; el backend no permite dejar la imagen vacía sin subir una nueva.

El frontend debe enviar únicamente los campos modificados. Si no se ha modificado ningún campo y no
se ha seleccionado una imagen, no debe enviarse la petición, porque el backend responde con un
error de validación cuando no hay campos editables. Si hay imagen nueva, la petición se envía como
`multipart/form-data`; si no, puede enviarse como JSON.

La edición solo puede realizarla el autor. El frontend debe ocultar la acción a los demás usuarios
y, si el backend responde `403`, mostrar un error de permisos. Si el anuncio ya no existe, mostrar
un estado de no encontrado. Si el token ha caducado, limpiar la sesión y solicitar login.

Tras una edición correcta, el frontend debe actualizar el anuncio en el estado compartido, refrescar
el listado si corresponde y mostrar una confirmación. La vista de edición debe permitir cancelar
sin guardar, según la historia 08.

#### Criterios de aceptación

- La acción de editar solo se muestra al autor del anuncio.
- El formulario carga los valores actuales del anuncio.
- El formulario permite modificar título, descripción, precio, categoría e imagen.
- Las categorías se obtienen del backend y no están codificadas.
- Solo se envían los campos modificados.
- Si no hay cambios ni imagen nueva, no se envía la petición.
- La imagen actual se muestra y puede sustituirse por otra.
- Si hay imagen nueva, se envía `multipart/form-data` con el campo `imagen`.
- Una edición correcta devuelve `200` y actualiza el detalle y el listado.
- Una edición correcta muestra una confirmación perceptible.
- Un `403` muestra un error de permisos.
- Un `404` muestra un estado de anuncio no encontrado.
- Un `401` limpia la sesión y solicita login.
- Los errores de validación se muestran en el campo correspondiente.
- El formulario advierte antes de perder cambios sin guardar.

#### Contrato del backend

| Aspecto | Detalle |
|---|---|
| Método y ruta | `PATCH /clasify_api/anuncios/:id` |
| Autenticación | `Authorization: Bearer <token>` del autor |
| Cuerpo | Campos parciales: `titulo`, `descripcion`, `precio`, `categoria`; imagen opcional |
| Formato | `multipart/form-data` si hay imagen; JSON si no hay imagen |
| Respuesta correcta | `200 { "datos": { "anuncio": { ...detalle actualizado... } } }` |
| Sin cambios | `400 { "error": { "codigo": "VALIDACION", "mensaje": "No hay ningún campo editable..." } }` |
| Sin permisos | `403 { "error": { "codigo": "SIN_PERMISOS", "mensaje": "..." } }` |
| No encontrado | `404 { "error": { "codigo": "NO_ENCONTRADO", "mensaje": "..." } }` |
| Sin token | `401 { "error": { "codigo": "SIN_TOKEN", "mensaje": "..." } }` |

#### Estados de interfaz

- Cargando el anuncio para editar.
- Formulario con valores actuales.
- Formulario con cambios.
- Envío en curso.
- Edición correcta.
- Error de validación.
- Error de permisos.
- Anuncio no encontrado.
- Sesión caducada.
- Error de conexión.

#### Fuera de alcance

- Cambiar el autor del anuncio.
- Cambiar el estado desde este formulario.
- Eliminar la imagen sin sustituirla.
- Editar anuncios de otros usuarios.
