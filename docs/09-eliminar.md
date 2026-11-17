# Historia 09 - Eliminación de un anuncio

> **Prioridad:** Obligatoria  
> **Depende de:** Historias 02 y 05  
> **Endpoint principal:** `DELETE /clasify_api/anuncios/:id`

#### Historia de usuario: Como autor de un anuncio, quiero eliminarlo con una confirmación previa, para retirarlo definitivamente de la aplicación.

#### Especificación (spec)

El autor puede eliminar su anuncio desde el detalle. La acción debe estar visible solo para el
autor. Antes de eliminar, el frontend debe mostrar una confirmación explícita que identifique el
anuncio y advierta de que la acción es definitiva. La opción de cancelar debe ser clara y no debe
enviar ninguna petición.

Si el usuario confirma, se envía `DELETE /anuncios/:id`. Durante la operación se muestra un estado
de carga y se impide un segundo envío. Si el backend responde `204`, el frontend debe eliminar el
anuncio del estado compartido y del listado, mostrar una confirmación y llevar al usuario al
listado. No debe exigirse una recarga manual.

Si el backend responde `403`, se muestra un error de permisos. Si responde `404`, se informa de que
el anuncio ya no existe y se actualiza el estado local para retirarlo. Si el token ha caducado, se
limpia la sesión y se solicita login. Si falla la conexión, se muestra un error y el anuncio
permanece en la interfaz.

#### Criterios de aceptación

- La acción de eliminar solo se muestra al autor del anuncio.
- Al pulsar eliminar se muestra una confirmación con el título del anuncio.
- Cancelar la confirmación no envía ninguna petición.
- Cancelar la confirmación mantiene el anuncio en el listado y en el detalle.
- Confirmar la eliminación envía `DELETE /clasify_api/anuncios/:id`.
- Durante la eliminación se muestra carga y se impide el doble envío.
- Un `204` elimina el anuncio del estado compartido y del listado.
- Tras eliminar, se muestra una confirmación y se vuelve al listado.
- El listado se actualiza sin recargar manualmente la página.
- Un `403` muestra un error de permisos.
- Un `404` informa de que el anuncio ya no existe.
- Un `401` limpia la sesión y solicita login.
- Un error de conexión no elimina el anuncio de la interfaz.
- La confirmación es accesible por teclado y permite cerrarla sin eliminar.

#### Contrato del backend

| Aspecto | Detalle |
|---|---|
| Método y ruta | `DELETE /clasify_api/anuncios/:id` |
| Autenticación | `Authorization: Bearer <token>` del autor |
| Respuesta correcta | `204 No Content`, sin cuerpo |
| Sin permisos | `403 { "error": { "codigo": "SIN_PERMISOS", "mensaje": "..." } }` |
| No encontrado | `404 { "error": { "codigo": "NO_ENCONTRADO", "mensaje": "..." } }` |
| Sin token | `401 { "error": { "codigo": "SIN_TOKEN", "mensaje": "..." } }` |

#### Estados de interfaz

- Detalle con acción de eliminar.
- Confirmación de borrado.
- Eliminación en curso.
- Eliminación correcta.
- Cancelación del borrado.
- Error de permisos.
- Anuncio no encontrado.
- Sesión caducada.
- Error de conexión.

#### Fuera de alcance

- Borrado lógico o papelera.
- Restauración de un anuncio eliminado.
- Eliminación masiva.
- Eliminación de anuncios de otros usuarios.
