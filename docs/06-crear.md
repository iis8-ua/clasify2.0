# Historia 06 - Creación de un anuncio

> **Prioridad:** Obligatoria  
> **Depende de:** Historias 02 y 04  
> **Endpoint principal:** `POST /clasify_api/anuncios`

#### Historia de usuario: Como usuario autenticado, quiero publicar un anuncio con título, descripción, precio, categoría e imagen opcional, para poner un artículo a la venta.

#### Especificación (spec)

El usuario autenticado accede al formulario de creación desde el listado o desde la cabecera. El
formulario contiene título, descripción, precio, categoría e imagen opcional. La categoría se
selecciona a partir del catálogo real obtenido con `GET /categorias`; no se deben codificar
categorías en el frontend. La imagen es opcional y debe respetar los formatos y el tamaño admitidos
por el backend.

Antes de enviar, el frontend valida que el título no está vacío y no supera 150 caracteres, que la
descripción no está vacía y no supera 5000 caracteres, que el precio es un número no negativo, no
supera 99999999.99 y tiene como máximo dos decimales, y que se ha seleccionado una categoría. La
validación del frontend no sustituye la del backend.

Si hay imagen, la petición se envía como `multipart/form-data` con el campo `imagen`. Si no hay
imagen, se puede enviar JSON con los campos del anuncio. El backend obtiene el autor del token; el
frontend no debe enviar `id_autor` ni permitir modificarlo. Durante el envío se muestra un estado
de carga y se impide un segundo envío.

Si la creación es correcta, el backend devuelve el anuncio creado. El frontend debe incorporarlo al
estado compartido o invalidar el listado, mostrar una confirmación y llevar al usuario al detalle
del nuevo anuncio. Si hay errores de validación, se muestran junto al campo correspondiente. Si el
token ha caducado, se limpia la sesión y se solicita login. Si la imagen supera el tamaño o el
formato no es válido, se muestra un error comprensible.

#### Criterios de aceptación

- El formulario solo es accesible para usuarios autenticados.
- El formulario contiene título, descripción, precio, categoría e imagen opcional.
- Las categorías se obtienen del backend y no están codificadas en el frontend.
- El título es obligatorio y no supera 150 caracteres.
- La descripción es obligatoria y no supera 5000 caracteres.
- El precio es obligatorio, no negativo, no supera 99999999.99 y tiene como máximo dos decimales.
- La categoría es obligatoria.
- La imagen es opcional y se valida como JPEG, PNG o WebP de hasta 5 MB.
- La petición no incluye `id_autor`.
- Si hay imagen, se envía `multipart/form-data` con el campo `imagen`.
- Durante el envío se muestra carga y se impide el doble envío.
- Una creación correcta devuelve `201`, muestra confirmación y abre el detalle del anuncio.
- El listado se actualiza o invalida después de crear.
- Los errores de validación se muestran en el campo indicado por el backend.
- Un `401` limpia la sesión y solicita login.
- Una imagen demasiado grande se muestra con el error de validación del backend, asociado al campo
  `imagen`.
- Si el usuario abandona el formulario con cambios, se le advierte antes de perderlos.

#### Contrato del backend

| Aspecto | Detalle |
|---|---|
| Método y ruta | `POST /clasify_api/anuncios` |
| Autenticación | `Authorization: Bearer <token>` |
| Cuerpo | `titulo`, `descripcion`, `precio`, `categoria`; imagen opcional en el campo `imagen` |
| Formato | `multipart/form-data` si hay imagen; JSON si no hay imagen |
| Respuesta correcta | `201 { "datos": { "anuncio": { ...detalle del anuncio... } } }` |
| Error de validación | `400 { "error": { "codigo": "VALIDACION", "mensaje": "...", "campo": "..." } }` |
| Sin token | `401 { "error": { "codigo": "SIN_TOKEN", "mensaje": "..." } }` |
| Imagen demasiado grande | `400 { "error": { "codigo": "VALIDACION", "mensaje": "La imagen no puede superar los 5 MB", "campo": "imagen" } }` |
| Cuerpo JSON demasiado grande | `413 { "error": { "codigo": "CUERPO_DEMASIADO_GRANDE", "mensaje": "..." } }` |

#### Estados de interfaz

- Formulario vacío.
- Formulario con errores de validación.
- Imagen seleccionada o previsualizada.
- Envío en curso.
- Creación correcta.
- Error de validación.
- Error de imagen.
- Sesión caducada.
- Error de conexión.

#### Fuera de alcance

- Edición del anuncio, que se documenta en la historia 07.
- Cambio de estado, que se documenta en la historia 14.
- Subida de varias imágenes.
- Eliminación de la imagen sin sustituirla.
