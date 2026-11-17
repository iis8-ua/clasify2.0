# Historia 15 - Navegación con Vue Router

> **Prioridad:** Obligatoria  
> **Depende de:** Historias 04 y 05  
> **Endpoints principales:** Los de las vistas navegables

#### Historia de usuario: Como usuario, quiero navegar entre las vistas mediante URLs y usar los botones del navegador, para poder abrir enlaces directos y volver atrás sin perder el contexto.

#### Especificación (spec)

La navegación con Vue Router forma parte del alcance acordado. Cada vista relevante debe tener una
ruta propia y accesible directamente por URL. La navegación debe utilizar el historial del navegador
y permitir los botones de atrás y adelante. Las rutas deben organizarse por responsabilidad y no
deben convertirse en una única ruta con estado interno difícil de enlazar.

Las rutas previstas son el listado, el detalle de un anuncio, el inicio de sesión, la creación, la
edición, los favoritos y el perfil propio. Las rutas de creación, edición, favoritos y perfil deben
comprobar la sesión en el frontend para ofrecer una experiencia coherente; la autorización real
sigue correspondiendo al backend. Si el usuario no tiene sesión, se le redirige al login y, tras
autenticarse, se le devuelve a la ruta solicitada.

El listado debe reflejar en la URL la búsqueda y la paginación, los filtros y la página activos, de
modo que se pueda compartir o recargar la vista sin perder el contexto. Las rutas inexistentes deben
mostrar una vista de no encontrado. La ruta de detalle debe manejar identificadores inválidos o
anuncios inexistentes sin romper la navegación.

Esta historia forma parte del alcance acordado. La navegación se implementará con Vue Router y
deben mantenerse las reglas de acceso y la posibilidad de volver al listado.

#### Criterios de aceptación

- El listado tiene una ruta propia y accesible directamente.
- El detalle tiene una ruta propia con el identificador del anuncio.
- El login tiene una ruta propia.
- La creación y la edición tienen rutas propias.
- Favoritos y perfil tienen rutas propias.
- La navegación utiliza el historial del navegador.
- Los botones de atrás y adelante del navegador funcionan.
- Las rutas protegidas redirigen al login cuando no hay sesión.
- Tras el login, el usuario vuelve a la ruta solicitada.
- Los filtros y la página del listado se reflejan en la URL.
- Una ruta inexistente muestra una vista de no encontrado.
- Un identificador inválido o un anuncio inexistente se gestiona sin romper la aplicación.
- La navegación no sustituye la autorización del backend.

#### Contrato del backend

| Aspecto | Detalle |
|---|---|
| Endpoints | Los de cada vista; no se crean endpoints nuevos |
| Autorización | La del backend se mantiene; el router solo mejora la experiencia |
| Datos de ruta | El identificador del anuncio, la página y los filtros |

#### Estados de interfaz

- Ruta pública.
- Ruta protegida con sesión.
- Ruta protegida sin sesión.
- Redirección tras login.
- Ruta inexistente.
- Recurso inexistente.
- Navegación hacia atrás y adelante.

#### Fuera de alcance

- Rutas anidadas complejas.
- Transiciones animadas entre vistas.
- Estado de navegación persistido en el servidor.
- Sustituir la autorización del backend por guards del router.
