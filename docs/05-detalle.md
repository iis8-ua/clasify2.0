# Historia 05 - Detalle de un anuncio

> **Prioridad:** Obligatoria  
> **Depende de:** Historia 04 - Listado de anuncios  
> **Endpoint principal:** `GET /clasify_api/anuncios/:id`

#### Historia de usuario: Como visitante, quiero consultar toda la información de un anuncio, para decidir si me interesa y, si soy su autor, poder gestionarlo.

#### Especificación (spec)

Al abrir un anuncio desde el listado, el frontend solicita `GET /anuncios/:id`. El detalle es
público y admite token opcional: sin token se muestra la información pública; con token, el
backend añade el estado de favorito y, si el usuario participa en una conversación, información
del hilo que no forma parte de esta historia.

La vista debe mostrar el título, la descripción, el precio, el estado, la imagen o un marcador de
ausencia, la fecha de creación, la categoría con su nombre y el autor con su nombre, biografía y
resumen de valoraciones. También debe mostrar el número de favoritos y el estado `es_favorito`
cuando el backend lo devuelva. El email del autor no debe mostrarse porque el backend no lo
incluye en la proyección pública.

Si el usuario autenticado es el autor del anuncio, la vista debe mostrar las acciones de editar,
cambiar estado y eliminar. Para determinar la propiedad se compara el `id_autor` del anuncio con el
identificador del usuario de la sesión. Si el usuario no es el autor o es un visitante, esas
acciones no deben mostrarse como disponibles. Las acciones de favorito y contacto, si se
implementan, se documentan en historias adicionales.

Si el anuncio no existe, se muestra un estado de no encontrado. Si el identificador no es válido,
se muestra un error de validación comprensible. Si la petición falla por conexión, se muestra un
error con opción de reintentar. La vista debe permitir volver al listado conservando su estado.

#### Criterios de aceptación

- La vista solicita `GET /clasify_api/anuncios/:id` al abrirse.
- La vista muestra título, descripción, precio, estado, imagen o marcador, fecha y categoría.
- La vista muestra el nombre, la biografía y el resumen de valoraciones del autor.
- La vista muestra el número de favoritos y `es_favorito` cuando el backend lo devuelva.
- La vista no muestra el email del autor.
- Si el usuario autenticado es el autor, se muestran las acciones de editar, cambiar estado y
  eliminar.
- Si el usuario no es el autor o no tiene sesión, las acciones de gestión no se muestran como
  disponibles.
- Un anuncio inexistente muestra un estado de no encontrado.
- Un identificador inválido muestra un error comprensible.
- Un fallo de conexión muestra un error con opción de reintentar.
- La vista permite volver al listado conservando página y filtros.
- La imagen se obtiene de `VITE_API_URL` y del campo `imagen`; si no existe, se muestra un
  marcador alternativo.

#### Contrato del backend

| Aspecto | Detalle |
|---|---|
| Método y ruta | `GET /clasify_api/anuncios/:id` |
| Autenticación | Opcional; con token añade `es_favorito` y datos de conversación si participa |
| Respuesta correcta | `200 { "datos": { "anuncio": { "id", "titulo", "descripcion", "precio", "estado", "imagen", "fecha_creacion", "id_autor", "id_categoria", "autor": { "id", "nombre", "biografia", "fecha_alta", "valoracion_media", "num_valoraciones" }, "categoria": { "id", "nombre" }, "num_favoritos", "es_favorito" } } }` |
| Anuncio inexistente | `404 { "error": { "codigo": "NO_ENCONTRADO", "mensaje": "..." } }` |
| Identificador inválido | `400 { "error": { "codigo": "VALIDACION", "mensaje": "...", "campo": "id" } }` |

#### Estados de interfaz

- Cargando el detalle.
- Detalle con datos.
- Anuncio no encontrado.
- Identificador inválido.
- Error de conexión.
- Autor del anuncio.
- Visitante o usuario no autor.

#### Fuera de alcance

- Mostrar conversaciones o mensajes del anuncio.
- Mostrar el email del autor.
- Contactar con el vendedor.
- Gestionar favoritos desde esta historia.
