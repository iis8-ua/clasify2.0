# Historia 11 - Búsqueda y filtros

> **Prioridad:** Obligatoria  
> **Depende de:** Historias 04 y 10  
> **Endpoint principal:** `GET /clasify_api/anuncios`

#### Historia de usuario: Como visitante, quiero buscar anuncios por texto y filtrarlos por categoría, estado y orden, para encontrar más rápido lo que me interesa.

#### Especificación (spec)

El listado incorpora una caja de búsqueda por texto, un selector de categoría, un selector de
estado y un selector de ordenación. La búsqueda y los filtros forman parte del alcance acordado y
complementan el listado básico de la historia 04.

La búsqueda por texto se envía en el parámetro `texto`. El backend busca en el título y en la
descripción, sin distinguir mayúsculas, minúsculas ni acentos. La categoría se envía en
`categoria` y debe obtenerse del catálogo real de `GET /categorias`. El estado admite `disponible`,
`vendido` y `todos`. El orden admite `fecha_desc`, `fecha_asc`, `precio_desc` y `precio_asc`.

Al aplicar o cambiar un filtro se vuelve a la página uno. Al cambiar de página se conservan los
filtros activos. Debe existir una acción para limpiar todos los filtros y volver al listado por
defecto. Si no hay resultados, se muestra un estado vacío que explique que no hay coincidencias,
diferenciado de un error de carga. Si el backend devuelve un error de validación, se muestra el
mensaje asociado al campo indicado.

La búsqueda y los filtros complementan el listado básico y no deben romper su funcionamiento.

#### Criterios de aceptación

- El listado ofrece búsqueda por texto.
- El texto se envía en el parámetro `texto` y respeta el máximo de 150 caracteres.
- El filtro de categoría usa categorías reales obtenidas del backend.
- El filtro de estado solo usa `disponible`, `vendido` o `todos`.
- El filtro de orden solo usa `fecha_desc`, `fecha_asc`, `precio_desc` o `precio_asc`.
- Al aplicar un filtro se vuelve a la página uno.
- Al cambiar de página se conservan los filtros activos.
- La acción de limpiar filtros restaura el listado por defecto.
- Un listado sin coincidencias muestra un estado vacío específico.
- Un error de validación muestra el mensaje del backend en el campo correspondiente.
- La búsqueda no se ejecuta con cada pulsación si se decide usar una espera; en ese caso, la espera
  debe ser perceptible y no bloquear la interfaz.
- La interfaz indica qué filtros están activos.
- La búsqueda y los filtros no alteran el backend ni añaden endpoints nuevos.

#### Contrato del backend

| Aspecto | Detalle |
|---|---|
| Método y ruta | `GET /clasify_api/anuncios` |
| Parámetros | `texto`, `categoria`, `estado`, `orden`, `pagina`, `limite` |
| Texto | Búsqueda en título y descripción; máximo 150 caracteres |
| Categoría | Identificador entero positivo existente |
| Estado | `disponible`, `vendido`, `todos`; por defecto `disponible` |
| Orden | `fecha_desc`, `fecha_asc`, `precio_desc`, `precio_asc` |
| Categorías | `GET /clasify_api/categorias?pagina=1&limite=100` |
| Respuesta | `200 { "datos": [...], "paginacion": { ... } }` |

#### Estados de interfaz

- Filtros sin aplicar.
- Filtros aplicados.
- Búsqueda en curso.
- Resultados con coincidencias.
- Resultados sin coincidencias.
- Error de validación de filtros.
- Error de carga.

#### Fuera de alcance

- Búsqueda en otros recursos.
- Historial de búsquedas.
- Sugerencias automáticas.
- Filtros por precio mínimo o máximo, que el backend no ofrece.
