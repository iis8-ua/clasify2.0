# Práctica 1. Diseño y plan del backend: *Clasify*

## 1. Descripción y alcance

Aplicación web de **anuncios clasificados** (al estilo de Wallapop o Milanuncios): los usuarios
publican anuncios de artículos para venderlos a otros usuarios del sitio. En la página principal
se muestra el listado de anuncios más recientes, se pueden buscar/filtrar por texto y por
categoría, y cualquier visitante puede ver el detalle completo de un anuncio.

Un usuario autenticado puede publicar anuncios, editarlos, marcarlos como vendidos o eliminarlos
cuando ya no desee ofrecerlos. También puede guardar como favoritos los anuncios de otros usuarios
y contactar con el vendedor a través de un sistema de mensajería interno ligado a cada anuncio
(de esta forma la conversación queda asociada al producto y es privada entre comprador y vendedor).

Los usuarios pueden valorarse entre sí con una puntuación del 1 al 5 y un comentario opcional. La
valoración se resume como media y número de valoraciones en el perfil público y junto al autor de
cada anuncio, que es donde un comprador decide si escribe o no. El detalle del anuncio devuelve
además los tres últimos mensajes del hilo cuando quien consulta participa en él.

Quedan fuera del alcance de esta versión: el sistema real de pagos, el sistema de envío/logística,
la moderación automática de contenido y la moderación de las valoraciones (reportar, ocultar o
borrar una valoración).

## 2. Funcionalidades del frontend

- Un visitante sin autenticarse puede ver el listado paginado de anuncios, buscar por texto y
  filtrar por categoría, y consultar el detalle completo de un anuncio.
- Un usuario puede darse de alta con email y contraseña, hacer login y cerrar sesión.
- Un usuario autenticado puede **ver y editar su propio perfil**; el perfil público de cualquier
  usuario (nombre, fecha de alta y sus anuncios) es visible sin autenticarse.
- Un usuario autenticado puede crear un nuevo anuncio con título, descripción, precio, categoría
  y fotografía.
- Un usuario autenticado, propietario del anuncio, puede editarlo, marcarlo como vendido o
  eliminarlo.
- Un usuario autenticado puede añadir o quitar anuncios ajenos de sus favoritos y consultar su
  lista de favoritos.
- Un usuario autenticado puede iniciar una conversación privada con el vendedor de un anuncio,
  responder dentro de esa conversación y consultar sus conversaciones activas (solo las suyas).
- Un usuario autenticado puede valorar a cualquier otro usuario (no a sí mismo) con una puntuación
  del 1 al 5 y un comentario opcional, editar esa valoración o borrarla. Cualquier visitante puede
  ver la lista y la media de las valoraciones que ha recibido un usuario.

## 3. Tipo de backend

Backend propio con **Node.js/Express y una API REST**, con **MySQL** como base de datos
(cliente `mysql2`), **JWT** para la autenticación, **bcrypt** para el hash de contraseñas y
**multer** para la subida de imágenes.

Aunque Supabase simplificaría la autenticación y el almacenamiento, el núcleo de esta aplicación
son reglas de negocio de permisos y consistencia (favoritos sin duplicados, mensajería restringida
a comprador y vendedor, control del estado del anuncio, propiedad de los recursos). Implementar la
API permite expresar estas reglas de forma explícita siguiendo el diseño cliente-servidor.

## 4. Autenticación y sesión (JWT)

- **Registro**: email único + contraseña. La contraseña se guarda como hash (bcrypt), nunca en claro.
- **Login**: el **servidor** verifica las credenciales y **genera un token JWT firmado** (HS256)
  con payload `{ sub: id_usuario, email, exp }` y caducidad de 1 hora. El token viaja al cliente
  en el cuerpo de la respuesta; el secreto se guarda en una variable de entorno.
- **Peticiones protegidas**: el cliente envía `Authorization: Bearer <token>`. Un middleware lo
  verifica y deja el usuario en `req.usuario`.
- **Logout**: el cliente descarta el token. No se implementa lista negra de tokens (fuera de
  alcance de esta versión).

## 5. Perfil de usuario

- **Perfil público** (`GET /usuarios/:id`): id, nombre, biografía y fecha de alta. El **email
  nunca se expone**. Sus anuncios se consultan en `GET /usuarios/:id/anuncios` (paginado).
- **Perfil propio** (`GET /usuarios/me`): incluye el email, visible solo para el propio usuario.
- **Edición** (`PATCH /usuarios/me`): cada usuario solo puede editar el suyo (nombre, biografía y
  contraseña). El email no se puede cambiar en esta versión.

## 6. Responsabilidades del backend

- Gestionar el registro, la autenticación (JWT) y el perfil de los usuarios.
- Almacenar y servir categorías, anuncios, favoritos, conversaciones y mensajes.
- Permitir consultar anuncios con búsqueda por texto, filtro por categoría, ordenación por fecha
  o precio y **paginación obligatoria de todos los listados**.
- Permitir crear, editar, eliminar y cambiar el estado (disponible/vendido) de un anuncio,
  **únicamente a su propietario**.
- Permitir registrar/eliminar un favorito y garantizar que un usuario no puede tener el mismo
  anuncio repetido en sus favoritos.
- Gestionar la mensajería: una conversación solo puede verla y mantenerla **el vendedor del
  anuncio y el comprador que la inició**; el resto de usuarios no tiene acceso.
- Garantizar que ninguna operación de escritura de un usuario afecte a datos (anuncios, favoritos,
  conversaciones, mensajes) de otro usuario.
- Validar los datos de entrada (precio no negativo, campos obligatorios, formatos, etc.).

## 7. Modelo de datos (v0.2)

```
Usuario: id, nombre, email, password_hash, biografia, fecha_alta
Categoria: id, nombre

Anuncio: id, titulo, descripcion, precio, estado (disponible|vendido), fecha_creacion, imagen
    autor     -> Usuario   (N:1)
    categoria -> Categoria (N:1)
    # imagen = ruta del fichero subido (multipart/form-data) en backend/uploads/ (ver §9)

Favorito: id, fecha
    usuario -> Usuario (N:1)
    anuncio -> Anuncio (N:1)
    RESTRICCIÓN: UNIQUE (usuario, anuncio)      # N:M Usuario-Anuncio, sin duplicados

Conversacion: id, fecha_creacion
    anuncio   -> Anuncio (N:1)                  # anuncio sobre el que se conversa
    comprador -> Usuario (N:1)                  # usuario que inició la conversación
    RESTRICCIÓN: UNIQUE (anuncio, comprador)    # un comprador, una conversación por anuncio

Mensaje: id, texto, fecha, leido
    conversacion -> Conversacion (N:1)
    emisor       -> Usuario      (N:1)

Valoración: id, puntuacion (1..5), comentario (opcional), fecha
    valorador -> Usuario (N:1)                  # quién valora
    valorado -> Usuario (N:1)                  # quién recibe la valoración
    RESTRICCIÓN: UNIQUE (valorador, valorado)  # una valoración por pareja
    RESTRICCIÓN: CHECK (puntuacion BETWEEN 1 AND 5)
```

`Valoración` cuelga de **usuario a usuario y no del anuncio**: se puntúa a la persona, no a la
operación, así que la reputación sobrevive a que el anuncio se venda o se borre. Las dos claves
foráneas van con `ON DELETE CASCADE`, de modo que al borrar un usuario se van sus valoraciones
dadas y recibidas. Volver a valorar el mismo par edita la fila existente en lugar de crear otra.

**Participantes de una conversación** = autor del anuncio (vendedor) ∪ conversacion.comprador.
Es la única regla de acceso a la mensajería y se resuelve con un `JOIN` de una sola condición.

## 8. Reglas de acceso y validación

| Recurso | Operación | Quién puede |
|---|---|---|
| Usuario | ver perfil público | cualquiera |
| Usuario | ver/editar perfil propio | solo el propio usuario |
| Anuncio | leer/listar/detalle | cualquiera |
| Anuncio | crear | usuario autenticado |
| Anuncio | editar / cambiar estado / eliminar | solo el autor |
| Favorito | crear/eliminar/listar | solo el usuario autenticado sobre los suyos |
| Conversación | leer/escribir mensajes | solo vendedor y comprador de esa conversación |
| Valoración | crear/editar/borrar | solo el usuario autenticado, sobre otro distinto de él |
| Valoración | ver las que ha recibido un usuario | cualquiera |
| Valoración | ver las que he puesto yo | solo el usuario autenticado |

Validaciones principales:

- **Registro**: email con formato válido y único; contraseña de longitud mínima; nombre obligatorio.
- **Anuncio**: título (longitud acotada), descripción obligatoria, precio `>= 0` con 2 decimales,
  `categoria` existente. En edición solo se aplican los campos enviados.
- **Mensaje**: texto no vacío y de longitud acotada.
- **Imagen**: formatos `jpeg/png/webp`, tamaño máximo 5 MB; se guarda en `backend/uploads/` con un
  nombre único y en la BD solo se almacena la ruta.
- **Listados**: `pagina >= 1` (por defecto 1), `limite` dentro de un rango (1–100, por defecto 20),
  `orden` dentro de los valores permitidos (`fecha_desc`, `fecha_asc`, `precio_desc`, `precio_asc`).
- Formato de error uniforme: `{ "error": { "codigo", "mensaje", "campo" } }`.

## 9. API REST

Todas las rutas empiezan por `/clasify_api/`. `JWT` indica que requiere token.

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/auth/register` | - | Alta de usuario. 201 + token |
| POST | `/auth/login` | - | Login. 200 + token JWT |
| GET | `/auth/yo` | JWT | Usuario de la sesión; sirve para rehidratar el frontend al recargar |
| GET | `/usuarios/me` | JWT | Perfil propio (incluye email) |
| PATCH | `/usuarios/me` | JWT | Editar nombre / biografía / contraseña |
| GET | `/usuarios/:id` | - | Perfil público |
| GET | `/usuarios/:id/anuncios` | - | Anuncios publicados por el usuario (paginado) |
| GET | `/usuarios/me/anuncios` | JWT | Mis anuncios (paginado) |
| GET | `/usuarios/me/favoritos` | JWT | Mis favoritos (paginado) |
| GET | `/usuarios/me/conversaciones` | JWT | Mis conversaciones activas (paginado) |
| GET | `/usuarios/:id` | JWT opcional | Perfil público con media de valoración, y `mi_valoracion` si el token ya ha valorado |
| GET | `/categorias` | - | Listado de categorías para los filtros (paginado) |
| GET | `/anuncios` | - | Listado/búsqueda (texto, categoría, orden) paginado; cada fila incluye `id_autor` |
| POST | `/anuncios` | JWT | Crear anuncio (`multipart/form-data` con campos + `imagen`) |
| GET | `/anuncios/:id` | JWT opcional | Detalle + autor + categoría + `num_favoritos` + `es_favorito` (+ `conversacion`, `ultimos_mensajes` y `num_mensajes` si participa en un hilo) |
| PATCH | `/anuncios/:id` | JWT (autor) | Editar anuncio (multipart opcional para cambiar la imagen) |
| PATCH | `/anuncios/:id/estado` | JWT (autor) | Cambiar estado disponible/vendido |
| DELETE | `/anuncios/:id` | JWT (autor) | Eliminar anuncio |
| GET | `/clasify_api/uploads/:fichero` | - | Sirve una imagen subida |
| POST | `/anuncios/:id/favorito` | JWT | Añadir a favoritos (idempotente). 201 si es nuevo, 200 si ya estaba |
| DELETE | `/anuncios/:id/favorito` | JWT | Quitar de favoritos |
| PUT | `/usuarios/:id/valoracion` | JWT | Crear o editar mi valoración sobre ese usuario. 201 nueva, 200 si ya existía |
| DELETE | `/usuarios/:id/valoracion` | JWT | Borrar mi valoración. 404 si no había ninguna |
| GET | `/usuarios/:id/valoraciones` | - | Valoraciones que ha recibido ese usuario (paginado) |
| GET | `/usuarios/me/valoraciones` | JWT | Valoraciones que he puesto yo (paginado) |
| GET | `/anuncios/:id/mensajes` | JWT (comprador) | Mensajes de **mi** conversación con el vendedor (paginado). 400 si lo pide el vendedor |
| POST | `/anuncios/:id/mensajes` | JWT | Inicia (o reutiliza) la conversación con el vendedor y envía el mensaje |
| GET | `/conversaciones/:id/mensajes` | JWT (participante) | Mensajes de una conversación (paginado) |
| POST | `/conversaciones/:id/mensajes` | JWT (participante) | Enviar mensaje en una conversación |

Formato de listado paginado:

```
GET /clasify_api/anuncios?texto=mesa&categoria=3&orden=precio_asc&pagina=1&limite=20

200 OK
{
  "datos": [ ... ],
  "paginacion": { "pagina": 1, "limite": 20, "total": 137, "paginas": 7 }
}
```

El endpoint `GET /anuncios/:id` devuelve el anuncio junto con sus recursos relacionados
(autor con su valoración media, categoría, `num_favoritos` y, si el usuario es participante, la
conversación con sus tres últimos mensajes y el total de mensajes), satisfaciendo el requisito de
"elemento + recurso secundario".

### Subida de imágenes

- `POST /anuncios` y `PATCH /anuncios/:id` aceptan `multipart/form-data` con el campo `imagen`.
- El servidor valida el tipo (`jpeg/png/webp`) y el tamaño (máx. 5 MB) y guarda el fichero en
  `backend/uploads/` con un nombre único; en la BD se almacena solo la ruta.
- Las imágenes se sirven de forma estática en `/clasify_api/uploads/:fichero`.
- Al sustituir la imagen o eliminar el anuncio se borra el fichero antiguo.

### CORS

El frontend Vue se sirve desde otro origen (Vite en `http://localhost:5173` y
`vite preview` en `http://localhost:4173`). El backend permite esos orígenes con
la variable `FRONTEND_ORIGIN`, que admite una lista separada por comas. Las
peticiones con `Authorization` y `Content-Type: application/json` necesitan la
respuesta al preflight `OPTIONS`, que gestiona el middleware `cors`.
