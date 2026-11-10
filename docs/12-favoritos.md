# Historia 12 - Favoritos

> **Prioridad:** Obligatoria  
> **Depende de:** Historias 02 y 05  
> **Endpoints principales:** `POST /anuncios/:id/favorito`, `DELETE /anuncios/:id/favorito`, `GET /usuarios/me/favoritos`

#### Historia de usuario: Como usuario autenticado, quiero guardar anuncios en favoritos y consultarlos después, para no perder los que me interesan.

#### Especificación (spec)

Desde el detalle de un anuncio ajeno, el usuario autenticado puede añadirlo a favoritos o quitarlo.
El botón debe reflejar el estado `es_favorito` que devuelve el detalle. Si el usuario no tiene
sesión, al pulsar favorito se le solicita iniciar sesión y, tras el login, se le devuelve al
anuncio. El backend no permite añadir a favoritos un anuncio propio; en ese caso se muestra un
error comprensible y no se muestra el botón como disponible para el autor.

La pantalla de favoritos obtiene `GET /usuarios/me/favoritos`, que devuelve los anuncios guardados
paginados, del más reciente al más antiguo por fecha de guardado. Cada elemento debe mostrar los
mismos datos básicos del listado y permitir abrir el detalle. Si el anuncio guardado ya está
vendido, debe seguir apareciendo en favoritos con su estado.

Añadir un favorito devuelve `201` si es nuevo y `200` si ya existía; ambos casos son correctos. Quitar
un favorito devuelve `204`. Después de añadir o quitar, el estado del botón y la lista de favoritos
deben actualizarse sin recargar manualmente la página. La lista debe tener estados de carga, vacío,
error y paginación.

Esta historia forma parte del alcance acordado y se usará como recurso secundario de la Práctica 4.

#### Criterios de aceptación

- El botón de favorito aparece en el detalle de anuncios ajenos.
- El botón refleja el valor `es_favorito` del backend.
- Un visitante que pulsa favorito es invitado a iniciar sesión.
- Tras el login, el usuario vuelve al anuncio desde el que inició sesión.
- Añadir un favorito envía `POST /clasify_api/anuncios/:id/favorito`.
- Un `201` y un `200` se tratan como éxito.
- Quitar un favorito envía `DELETE /clasify_api/anuncios/:id/favorito` y acepta `204`.
- El autor de un anuncio no puede añadirlo a favoritos y recibe un mensaje comprensible.
- La pantalla de favoritos solicita `GET /clasify_api/usuarios/me/favoritos`.
- La pantalla de favoritos muestra los anuncios guardados y permite abrir su detalle.
- Los anuncios vendidos siguen apareciendo en favoritos con su estado.
- La lista de favoritos tiene estados de carga, vacío, error y paginación.
- Añadir o quitar un favorito actualiza el botón y la lista sin recarga manual.
- Un `401` limpia la sesión y solicita login.

#### Contrato del backend

| Aspecto | Detalle |
|---|---|
| Añadir | `POST /clasify_api/anuncios/:id/favorito` con JWT |
| Resultado añadir | `201` si es nuevo; `200` si ya estaba; `{ "datos": { "favorito": { ... } } }` |
| Quitar | `DELETE /clasify_api/anuncios/:id/favorito` con JWT |
| Resultado quitar | `204 No Content` |
| Listar | `GET /clasify_api/usuarios/me/favoritos?pagina=1&limite=20` con JWT |
| Listado | `200 { "datos": [ { "id", "titulo", "precio", "estado", "imagen", "fecha_creacion", "id_categoria", "id_autor" } ], "paginacion": { ... } }` |
| Anuncio propio | `400 { "error": { "codigo": "VALIDACION", "mensaje": "..." } }` |
| Sin token | `401 { "error": { "codigo": "SIN_TOKEN", "mensaje": "..." } }` |

#### Estados de interfaz

- Anuncio no guardado.
- Anuncio guardado.
- Añadiendo o quitando favorito.
- Favorito actualizado.
- Lista de favoritos con resultados.
- Lista de favoritos vacía.
- Error al cargar favoritos.
- Error de permisos o validación.
- Sesión caducada.

#### Fuera de alcance

- Mostrar el estado de favorito en el listado general, que no lo devuelve.
- Favoritos compartidos entre usuarios.
- Notificaciones cuando cambia un favorito.
- Sincronización entre dispositivos más allá de la sesión.
