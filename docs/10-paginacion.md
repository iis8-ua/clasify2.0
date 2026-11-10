# Historia 10 - Paginación del listado

> **Prioridad:** Obligatoria  
> **Depende de:** Historia 04 - Listado de anuncios  
> **Endpoint principal:** `GET /clasify_api/anuncios`

#### Historia de usuario: Como visitante, quiero recorrer todas las páginas del listado, para no perderme anuncios que no caben en la primera página.

#### Especificación (spec)

El backend devuelve los listados paginados con el objeto
`paginacion: { pagina, limite, total, paginas }`. El frontend no puede limitarse a mostrar la
primera página: debe ofrecer controles para avanzar, retroceder y acceder a las páginas
disponibles.

La paginación debe mantener los filtros y el criterio de ordenación activos. Al cambiar de página
se solicita de nuevo el listado con el parámetro `pagina` correspondiente. Si se cambia un filtro,
se debe volver a la primera página. Los controles deben deshabilitarse cuando no haya página
anterior o siguiente. La interfaz debe mostrar de forma comprensible la página actual y el total de
páginas o de resultados.

Mientras se carga una página se muestra un estado de carga sin borrar necesariamente la estructura
de la vista. Si la página solicitada no existe, se muestra un estado vacío o se corrige la página
según la respuesta del backend. Si la petición falla, se muestra un error con opción de reintentar
la página actual. Al volver desde el detalle, se conserva la página en la que estaba el usuario.

#### Criterios de aceptación

- El listado lee `pagina`, `limite`, `total` y `paginas` de la respuesta.
- El listado permite avanzar y retroceder de página.
- El listado permite ir a la primera y a la última página.
- Los controles de página se deshabilitan cuando no corresponde avanzar o retroceder.
- La interfaz muestra la página actual y el total de páginas o resultados.
- Al cambiar de página se conservan los filtros y el orden activos.
- Al cambiar un filtro se vuelve a la primera página.
- La página solicitada se envía como parámetro `pagina`.
- El límite usado está entre 1 y 100; por defecto se usa 20.
- Si la página no tiene resultados, se muestra un estado vacío comprensible.
- Si falla la carga de una página, se muestra un error y se puede reintentar.
- Al volver desde el detalle se conserva la página y el estado del listado.
- La paginación funciona sin recargar manualmente la página.
- Los controles tienen etiquetas accesibles y se pueden usar con teclado.

#### Contrato del backend

| Aspecto | Detalle |
|---|---|
| Método y ruta | `GET /clasify_api/anuncios` |
| Parámetros | `pagina` y `limite`, además de los filtros activos |
| Valores | `pagina >= 1`; `limite` entre 1 y 100; por defecto 20 |
| Respuesta correcta | `200 { "datos": [...], "paginacion": { "pagina", "limite", "total", "paginas" } }` |
| Página fuera de rango | `200` con `datos` vacío y la paginación real |
| Error de paginación | `400 { "error": { "codigo": "VALIDACION", "mensaje": "...", "campo": "pagina" } }` |

#### Estados de interfaz

- Cargando una página.
- Página con resultados.
- Página vacía.
- Error al cargar una página.
- Primera página.
- Última página.
- Página intermedia.

#### Fuera de alcance

- Paginación infinita o scroll infinito.
- Cambio del tamaño de página si no se decide en el plan.
- Paginación de la lista de categorías como funcionalidad visible.
