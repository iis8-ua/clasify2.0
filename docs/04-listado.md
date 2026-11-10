# Historia 04 - Listado de anuncios

> **Prioridad:** Obligatoria  
> **Depende de:** Ninguna  
> **Endpoint principal:** `GET /clasify_api/anuncios`

#### Historia de usuario: Como visitante, quiero ver un listado de anuncios disponibles, para descubrir qué artículos se ofrecen y poder abrir el que me interese.

#### Especificación (spec)

La pantalla principal muestra un listado de anuncios obtenido de `GET /anuncios`. El listado es
público: no requiere sesión. Por defecto, el backend devuelve solo anuncios con estado
`disponible`, ordenados por fecha descendente y paginados con un límite de veinte elementos.

Cada elemento del listado debe mostrar, como mínimo, el título, el precio, la imagen o un marcador
visual cuando no haya imagen, el estado y la fecha de creación. El listado devuelve
`id_categoria` pero no el nombre de la categoría; si se quiere mostrar el nombre, el frontend debe
obtenerlo del catálogo de categorías. El listado tampoco devuelve el nombre del autor, solo
`id_autor`; no debe inventarse un nombre ni hacer una petición por cada anuncio para obtenerlo.

Al pulsar sobre un anuncio se abre su detalle. El listado debe conservar el estado de página y los
filtros aplicados al volver desde el detalle. Si no hay resultados, se muestra un estado vacío
diferenciado de un error. Si la petición falla, se muestra un mensaje comprensible y una acción
para reintentar. Mientras se carga, se muestra un estado de carga.

La interfaz debe mostrar las acciones de crear anuncio solo a usuarios autenticados. Los
visitantes deben ver una invitación a iniciar sesión cuando intenten acceder a una acción
protegida. Después de crear, editar o eliminar un anuncio, el listado debe actualizarse sin
recargar manualmente la página.

#### Criterios de aceptación

- La pantalla principal solicita `GET /clasify_api/anuncios` sin exigir autenticación.
- El listado muestra título, precio, imagen o marcador de ausencia, estado y fecha de creación.
- El precio se presenta respetando que el backend lo devuelve como cadena decimal.
- Cada anuncio permite abrir su detalle.
- El listado muestra un estado de carga mientras se obtiene la información.
- El listado muestra un estado vacío cuando `datos` está vacío.
- El listado muestra un estado de error comprensible cuando la petición falla.
- El estado de error ofrece una acción para reintentar la carga.
- El listado conserva la página y los filtros al volver desde el detalle.
- La acción de crear anuncio solo se muestra a usuarios autenticados.
- Un visitante que intenta una acción protegida recibe una invitación a iniciar sesión.
- Después de una creación, edición o eliminación, el listado refleja el cambio sin recarga manual.
- La imagen se muestra usando la URL construida a partir de `VITE_API_URL` y el nombre de fichero.
- Si no hay imagen, se muestra un marcador visual alternativo con texto accesible.
- No se muestra el nombre de la categoría ni del autor si no se ha obtenido de una fuente real.

#### Contrato del backend

| Aspecto | Detalle |
|---|---|
| Método y ruta | `GET /clasify_api/anuncios` |
| Autenticación | No requiere token |
| Parámetros | `texto`, `categoria`, `orden`, `estado`, `pagina`, `limite` |
| Valores de `orden` | `fecha_desc`, `fecha_asc`, `precio_desc`, `precio_asc` |
| Valores de `estado` | `disponible`, `vendido`, `todos`; por defecto `disponible` |
| Respuesta correcta | `200 { "datos": [ { "id", "titulo", "precio", "estado", "imagen", "fecha_creacion", "id_categoria", "id_autor" } ], "paginacion": { "pagina", "limite", "total", "paginas" } }` |
| Error de validación | `400 { "error": { "codigo": "VALIDACION", "mensaje": "...", "campo": "..." } }` |

#### Estados de interfaz

- Cargando el listado.
- Listado con resultados.
- Listado vacío.
- Error al cargar el listado.
- Visitante.
- Usuario autenticado.

#### Fuera de alcance

- Mostrar el autor del anuncio en el listado.
- Mensajería o contacto con el vendedor.
- Búsqueda y filtros, que se documentan en la historia 11.
- Paginación detallada, que se documenta en la historia 10.
