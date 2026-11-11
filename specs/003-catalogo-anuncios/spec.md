# Feature Specification: Catálogo de anuncios

**Feature Branch**: `003-catalogo-anuncios`

**Created**: 2026-11-10

**Status**: Draft

**Input**: User description: "Implementa la spec 003-catalogo-anuncios descrita en docs/00-contexto-specs.md. Lee también docs/04-listado.md, docs/05-detalle.md, docs/10-paginacion.md y docs/11-busqueda-filtros.md. No modifiques el backend."

## Clarifications

### Session 2026-11-11

- Q: ¿El catálogo permite elegir cuántos anuncios se muestran por página? → A: Sí; se puede elegir 10, 20 o 50, con 20 por defecto.
- Q: ¿Se mantiene la paginación numerada? → A: Sí; primera, anterior, siguiente y última.
- Q: ¿Qué añade el detalle además de la información actual? → A: Compartir anuncio, anuncios similares, más anuncios del vendedor y enlace a su perfil público.
- Q: ¿Cuántos anuncios muestran las secciones del detalle? → A: Cuatro similares y cuatro del vendedor, excluyendo el anuncio abierto.
- Q: ¿Qué anuncios entran en esas secciones? → A: Solo disponibles; los similares comparten categoría y los del vendedor son del mismo autor.
- Q: ¿Cómo se comparte un anuncio? → A: Con la función nativa de compartir si existe y, como alternativa, copiando el enlace.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Explorar el listado de anuncios (Priority: P1)

Como visitante, quiero ver un listado de anuncios disponibles con su información principal, para
descubrir qué artículos se ofrecen y abrir el que me interese.

**Why this priority**: el listado es la entrada principal al catálogo. Sin él, los usuarios no
pueden descubrir anuncios ni llegar a su detalle.

**Independent Test**: se puede comprobar abriendo la vista principal y verificando que aparece un
listado con anuncios disponibles, que cada elemento muestra la información esperada y que se puede
abrir su detalle.

**Acceptance Scenarios**:

1. **Given** que el usuario abre la vista principal sin sesión, **When** el catálogo termina de
   cargar, **Then** ve un listado de anuncios disponibles.
2. **Given** un anuncio del listado, **When** el usuario lo consulta, **Then** ve título, precio,
   imagen o marcador de ausencia, categoría, estado y fecha de creación.
3. **Given** un anuncio del listado, **When** el usuario lo selecciona, **Then** se abre su detalle.
4. **Given** que el usuario vuelve desde el detalle, **When** regresa al listado, **Then** conserva
   la página y los filtros que tenía.
5. **Given** que el listado no tiene resultados, **When** la carga termina correctamente, **Then**
   el usuario ve un estado vacío y no un error.
6. **Given** que la carga del listado falla, **When** el usuario recibe el error, **Then** ve un
   mensaje comprensible y una acción para reintentar.
7. **Given** que el listado está cargando, **When** la operación sigue en curso, **Then** el usuario
   ve un estado de carga.

---

### User Story 2 - Consultar el detalle de un anuncio (Priority: P2)

Como visitante, quiero consultar toda la información pública de un anuncio, para decidir si me
interesa antes de contactar o realizar cualquier otra acción.

**Why this priority**: el detalle concentra la información que permite valorar un anuncio. Es el
destino natural de cada elemento del listado y una vista pública esencial.

**Independent Test**: se puede comprobar abriendo un anuncio desde el listado y desde una dirección
directa, verificando que se muestra toda la información pública y que los casos de anuncio
inexistente o dirección inválida se gestionan correctamente.

**Acceptance Scenarios**:

1. **Given** un anuncio existente, **When** el usuario abre su detalle, **Then** ve título,
   descripción, precio, estado, imagen o marcador, fecha, categoría y autor.
2. **Given** el detalle de un anuncio, **When** el usuario consulta al autor, **Then** ve su nombre,
   biografía y resumen de valoraciones, pero no su email.
3. **Given** el detalle de un anuncio, **When** el usuario consulta los favoritos, **Then** ve el
   número de favoritos y, si tiene sesión, si lo tiene guardado.
4. **Given** un anuncio inexistente, **When** el usuario abre su detalle, **Then** ve un estado de
   anuncio no encontrado.
5. **Given** una dirección de detalle inválida, **When** el usuario la abre, **Then** ve un mensaje
   comprensible y no una pantalla rota.
6. **Given** un fallo de conexión, **When** el detalle no se puede cargar, **Then** el usuario ve un
   error con opción de reintentar.
7. **Given** que el usuario llega al detalle desde el listado, **When** vuelve al listado, **Then**
   conserva la página y los filtros anteriores.
8. **Given** el detalle de un anuncio, **When** el usuario selecciona compartir, **Then** puede usar la
   función nativa del dispositivo o copiar el enlace, y recibe una confirmación.
9. **Given** el detalle de un anuncio, **When** el usuario consulta los anuncios similares, **Then** ve
   hasta cuatro anuncios disponibles de la misma categoría, sin el anuncio actual.
10. **Given** el detalle de un anuncio, **When** el usuario consulta más anuncios del vendedor,
    **Then** ve hasta cuatro anuncios disponibles del mismo autor, sin el anuncio actual.
11. **Given** el detalle de un anuncio, **When** el usuario selecciona al autor o el enlace al perfil,
    **Then** se abre su perfil público.

---

### User Story 3 - Recorrer todas las páginas del listado (Priority: P2)

Como visitante, quiero recorrer todas las páginas del listado, para no perderme anuncios que no
caben en la primera página.

**Why this priority**: el catálogo puede superar el tamaño de una página. Sin paginación completa,
una parte de los anuncios quedaría inaccesible.

**Independent Test**: se puede comprobar con un conjunto de anuncios que ocupe varias páginas,
recorriéndolas hacia delante y hacia atrás y verificando que no se repiten ni se omiten elementos.

**Acceptance Scenarios**:

1. **Given** un listado con varias páginas, **When** el usuario avanza o retrocede, **Then** ve la
   página correspondiente.
2. **Given** que el usuario está en la primera página, **When** consulta los controles, **Then** la
   acción de ir a la página anterior está deshabilitada.
3. **Given** que el usuario está en la última página, **When** consulta los controles, **Then** la
   acción de ir a la página siguiente está deshabilitada.
4. **Given** que el usuario está en una página intermedia, **When** consulta la información de
   paginación, **Then** ve la página actual y el total de páginas o resultados.
5. **Given** que el usuario cambia de página, **When** la nueva página termina de cargar, **Then**
   se conservan los filtros y el orden activos.
6. **Given** que el usuario cambia un filtro, **When** se aplica, **Then** vuelve a la primera
   página.
7. **Given** que la página solicitada ya no existe, **When** se detecta, **Then** la aplicación
   muestra la última página disponible.
8. **Given** que falla la carga de una página, **When** el usuario recibe el error, **Then** puede
   reintentar la página actual.
9. **Given** una página y unos filtros activos, **When** el usuario recarga o comparte la dirección,
   **Then** vuelve a ver el mismo estado del listado.
10. **Given** el listado, **When** el usuario elige 10, 20 o 50 anuncios por página, **Then** el
    listado se actualiza con ese tamaño y vuelve a la primera página.
11. **Given** un tamaño de página distinto del valor por defecto, **When** el usuario recarga o
    comparte la dirección, **Then** se conserva el tamaño elegido.
12. **Given** el listado con varias páginas, **When** el usuario cambia el tamaño de página, **Then**
    los controles de paginación y el total se recalculan sin omitir ni repetir anuncios.

---

### User Story 4 - Buscar y filtrar anuncios (Priority: P3)

Como visitante, quiero buscar anuncios por texto y filtrarlos por categoría, estado y orden, para
encontrar más rápido lo que me interesa.

**Why this priority**: cuando el catálogo crece, la exploración lineal deja de ser eficaz. La
búsqueda y los filtros mejoran el acceso a los anuncios relevantes sin cambiar el funcionamiento
básico del listado.

**Independent Test**: se puede comprobar aplicando una búsqueda por texto y combinándola con
categoría, estado y orden, verificando que los resultados, la paginación y los estados vacíos son
coherentes.

**Acceptance Scenarios**:

1. **Given** el listado, **When** el usuario introduce un texto y aplica la búsqueda, **Then** ve
   anuncios cuyo título o descripción coinciden con el texto.
2. **Given** una búsqueda por texto, **When** el usuario usa mayúsculas, minúsculas o acentos
   distintos, **Then** la búsqueda sigue encontrando las coincidencias esperadas.
3. **Given** el listado, **When** el usuario selecciona una categoría, **Then** solo ve anuncios de
   esa categoría.
4. **Given** el listado, **When** el usuario selecciona un estado, **Then** ve anuncios disponibles,
   vendidos o todos, según la opción elegida.
5. **Given** el listado, **When** el usuario selecciona un orden, **Then** los resultados se
   presentan en el orden elegido.
6. **Given** varios filtros activos, **When** el usuario cambia de página, **Then** se mantienen.
7. **Given** varios filtros activos, **When** el usuario los limpia, **Then** vuelve al listado por
   defecto y a la primera página.
8. **Given** una búsqueda sin coincidencias, **When** la operación termina, **Then** ve un estado
   vacío específico que explica que no hay resultados.
9. **Given** un texto de búsqueda demasiado largo, **When** el usuario intenta aplicarlo, **Then**
   ve un mensaje comprensible y no se ejecuta una búsqueda inválida.
10. **Given** que la búsqueda o los filtros fallan, **When** el usuario recibe el error, **Then** ve
    un mensaje comprensible y puede reintentar.

---

### User Story 5 - Leer el catálogo en cualquier dispositivo (Priority: P3)

Como usuario, quiero que el listado y el detalle sean legibles y manejables con teclado o en una
pantalla pequeña, para poder consultar el catálogo sin depender del ratón ni de un dispositivo
grande.

**Why this priority**: el catálogo es la parte más visitada de la aplicación. La accesibilidad y la
adaptación a móvil deben resolverse en sus vistas principales.

**Independent Test**: se puede comprobar recorriendo listado y detalle solo con teclado, con lector
de pantalla y en una pantalla de 360 píxeles de ancho.

**Acceptance Scenarios**:

1. **Given** el listado o el detalle, **When** el usuario navega solo con teclado, **Then** puede
   acceder a todos los elementos interactivos y el foco es visible.
2. **Given** una tarjeta del listado, **When** el usuario la revisa con un lector de pantalla,
   **Then** la información principal y el enlace al detalle son comprensibles.
3. **Given** una imagen del catálogo, **When** se muestra, **Then** tiene texto alternativo; si no
   existe, **Then** se muestra un marcador accesible.
4. **Given** una pantalla de 360 píxeles de ancho, **When** el usuario recorre el listado y el
   detalle, **Then** no aparece desplazamiento horizontal no intencionado.
5. **Given** dos anuncios con precios o fechas distintas, **When** el usuario los compara, **Then**
   los formatos son coherentes.
6. **Given** un mensaje de error visible, **When** el usuario lo lee, **Then** está en español y no
   contiene detalles técnicos internos.

### Edge Cases

- El catálogo no tiene anuncios disponibles.
- La búsqueda no devuelve coincidencias.
- La página solicitada supera el total de páginas.
- El usuario cambia de filtro mientras está en una página avanzada.
- El usuario limpia los filtros después de una búsqueda.
- El texto de búsqueda está vacío, contiene solo espacios o supera la longitud admitida.
- La categoría seleccionada deja de existir o no está disponible.
- El anuncio del detalle ha sido eliminado o ya no existe.
- El identificador del detalle no es válido.
- La imagen del anuncio no existe o tarda en cargar.
- El título o la descripción son muy largos.
- El usuario vuelve al listado desde el detalle después de varias páginas.
- El usuario recarga una vista con filtros y página activos.
- La conexión falla al cargar el listado o el detalle.
- El usuario navega con teclado o lector de pantalla.
- La pantalla es muy estrecha.
- El usuario no tiene sesión y el detalle muestra el estado de favorito como no guardado.
- El navegador no soporta la función nativa de compartir.
- El usuario cancela el diálogo nativo de compartir.
- El portapapeles no está disponible al copiar el enlace.
- El vendedor no tiene otros anuncios disponibles.
- No hay anuncios similares disponibles en la categoría.
- El usuario cambia el tamaño de página en una página avanzada.
- El tamaño de página solicitado no es válido.
- Los anuncios similares o del vendedor fallan al cargar.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El listado de anuncios MUST ser público y MUST NOT exigir sesión.
- **FR-002**: El listado inicial MUST mostrar anuncios disponibles, ordenados del más reciente al
  más antiguo y con un tamaño de página de 20 por defecto.
- **FR-003**: Cada elemento del listado MUST mostrar título, precio, imagen o marcador de ausencia,
  categoría, estado y fecha de creación.
- **FR-004**: El nombre de la categoría MUST obtenerse del catálogo real de categorías y MUST NOT
  inventarse.
- **FR-005**: El listado MUST NOT mostrar el nombre del autor, porque no forma parte de la
  información disponible del listado.
- **FR-006**: Cada elemento del listado MUST permitir abrir el detalle del anuncio.
- **FR-007**: Al volver desde el detalle, el listado MUST conservar la página y los filtros
  anteriores.
- **FR-008**: El listado MUST distinguir carga, resultados, vacío y error, y MUST ofrecer reintento
  cuando la carga falle.
- **FR-009**: El detalle de un anuncio MUST ser público y MUST poder abrirse directamente por su
  dirección.
- **FR-010**: El detalle MUST mostrar título, descripción, precio, estado, imagen o marcador, fecha,
  categoría y autor.
- **FR-011**: El detalle MUST mostrar nombre, biografía y resumen de valoraciones del autor, y MUST
  NOT mostrar su email.
- **FR-012**: El detalle MUST mostrar el número de favoritos y, si hay sesión, si el usuario lo tiene
  guardado; añadir o quitar favoritos corresponde a otra feature.
- **FR-013**: Un anuncio inexistente MUST mostrar un estado de no encontrado.
- **FR-014**: Un identificador de detalle inválido MUST mostrar un mensaje comprensible y MUST NOT
  romper la vista.
- **FR-015**: El detalle MUST ofrecer reintento cuando la carga falle por conexión.
- **FR-016**: La paginación MUST permitir ir a la primera, anterior, siguiente y última página.
- **FR-017**: Los controles de paginación MUST deshabilitarse cuando no haya página anterior o
  siguiente.
- **FR-018**: La interfaz MUST mostrar la página actual y el total de páginas o resultados.
- **FR-019**: Al cambiar de página MUST conservarse los filtros y el orden activos.
- **FR-020**: Al cambiar un filtro MUST volver a la primera página.
- **FR-021**: Si la página solicitada supera el total, la aplicación MUST mostrar la última página
  disponible.
- **FR-022**: El listado MUST permitir elegir un tamaño de página de 10, 20 o 50, con 20 por defecto,
  y MUST volver a la primera página al cambiarlo.
- **FR-023**: La búsqueda por texto MUST buscar en título y descripción, MUST ignorar diferencias de
  mayúsculas, minúsculas y acentos, y MUST limitar el texto a 150 caracteres.
- **FR-024**: El filtro de categoría MUST usar el catálogo real de categorías.
- **FR-025**: El filtro de estado MUST permitir anuncios disponibles, vendidos o todos.
- **FR-026**: El orden MUST permitir fecha más reciente, fecha más antigua, precio de menor a mayor
  y precio de mayor a menor.
- **FR-027**: La interfaz MUST indicar qué filtros están activos y MUST ofrecer una acción para
  limpiarlos.
- **FR-028**: Una búsqueda sin coincidencias MUST mostrar un estado vacío específico, distinto de un
  error de carga.
- **FR-029**: La página y los filtros activos MUST conservarse al recargar o compartir la vista.
- **FR-030**: El listado y el detalle MUST usar estructura semántica, etiquetas asociadas,
  navegación por teclado, foco visible y textos alternativos.
- **FR-031**: El listado y el detalle MUST ser utilizables en una pantalla de 360 píxeles de ancho
  sin desplazamiento horizontal no intencionado.
- **FR-032**: Los precios MUST mostrarse con un formato decimal coherente y comprensible, y las
  fechas con un formato coherente en español.
- **FR-033**: Los mensajes visibles MUST estar en español y MUST NOT exponer detalles técnicos
  internos.
- **FR-034**: Esta feature MUST NOT implementar creación, edición, eliminación, cambio de estado,
  favoritos, perfil propio, menú de mensajería ni acciones de valoración. El perfil público se
  implementa en la spec 008 y aquí solo se enlaza.
- **FR-035**: Esta feature MUST NOT modificar el backend ni sustituir sus datos por contenido
  simulado.
- **FR-036**: El tamaño de página elegido MUST conservarse en la dirección al recargar o compartir la
  vista.
- **FR-037**: El detalle MUST ofrecer una acción de compartir que use la función nativa del
  dispositivo cuando esté disponible y, si no, copie el enlace.
- **FR-038**: Compartir correctamente o copiar el enlace MUST mostrar una confirmación perceptible.
- **FR-039**: El detalle MUST mostrar hasta cuatro anuncios similares disponibles de la misma
  categoría, excluyendo el anuncio actual.
- **FR-040**: El detalle MUST mostrar hasta cuatro anuncios disponibles del vendedor, excluyendo el
  anuncio actual.
- **FR-041**: El detalle MUST enlazar al perfil público del autor.

### Key Entities *(include if feature involves data)*

- **Anuncio**: artículo publicado, con título, descripción, precio, estado, imagen, fecha, categoría
  y autor.
- **Categoría**: clasificación del anuncio, con un nombre visible para el usuario.
- **Autor**: usuario que publica el anuncio; en el detalle se muestra su nombre, biografía y resumen
  de valoraciones, sin email.
- **Página de resultados**: conjunto de anuncios de una página, con página actual, tamaño, total y
  total de páginas.
- **Filtros de búsqueda**: texto, categoría, estado y orden aplicados al listado.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100 % de las cargas del listado muestra anuncios disponibles con el tamaño de página
  elegido: 10, 20 o 50, con 20 por defecto.
- **SC-002**: El 100 % de las tarjetas del listado muestra título, precio, imagen o marcador,
  categoría, estado y fecha.
- **SC-003**: El 100 % de los detalles muestra título, descripción, precio, estado, imagen o
  marcador, fecha, categoría, autor, biografía, resumen de valoraciones y número de favoritos.
- **SC-004**: El 100 % de las direcciones de detalle válidas abre el anuncio correspondiente, y el
  100 % de las inexistentes o inválidas muestra un estado comprensible.
- **SC-005**: El 100 % de las páginas de un conjunto paginado de prueba es accesible mediante los
  controles de paginación, sin omitir ni repetir elementos.
- **SC-006**: El 100 % de los cambios de página conserva los filtros y el orden activos.
- **SC-007**: El 100 % de los cambios de filtro vuelve a la primera página.
- **SC-008**: El 100 % de las búsquedas sin coincidencias muestra un estado vacío distinto de un
  error de carga.
- **SC-009**: El 100 % de los textos de búsqueda de más de 150 caracteres se rechaza con un mensaje
  comprensible.
- **SC-010**: El 100 % de los precios, fechas e imágenes se presenta con un formato coherente y
  accesible.
- **SC-011**: El 100 % del listado y del detalle puede recorrerse solo con teclado, con foco visible
  y textos alternativos.
- **SC-012**: El listado y el detalle se usan sin desplazamiento horizontal no intencionado en una
  pantalla de 360 píxeles de ancho.
- **SC-013**: El 100 % de los mensajes de error visibles está en español y no expone detalles
  técnicos internos.
- **SC-014**: Un usuario puede localizar un anuncio por texto en menos de 30 segundos en una prueba
  manual con los datos de ejemplo.
- **SC-015**: Esta feature no implementa creación, edición, eliminación, cambio de estado, favoritos,
  perfil propio, mensajería ni acciones de valoración, y no modifica el backend.
- **SC-016**: El 100 % de los cambios de tamaño de página se refleja en la URL y vuelve a la primera
  página.
- **SC-017**: El 100 % de los anuncios compartidos genera un enlace correcto y muestra confirmación
  cuando se copia o se comparte.
- **SC-018**: El 100 % de los detalles con anuncios similares muestra hasta cuatro disponibles de la
  misma categoría, sin el anuncio actual.
- **SC-019**: El 100 % de los detalles con otros anuncios del vendedor muestra hasta cuatro
  disponibles, sin el anuncio actual.
- **SC-020**: El 100 % de los detalles enlaza al perfil público del autor.

## Assumptions

- La estructura común, las rutas y los estados de interfaz se apoyan en la spec 001.
- La sesión se apoya en la spec 002; sin sesión, el estado de favorito del detalle se muestra como
  no guardado.
- El backend existente ofrece el catálogo, el detalle y las categorías; no se modifica en esta
  feature.
- El listado inicial muestra solo anuncios disponibles, ordenados por fecha descendente y con 20
  elementos por página por defecto; el usuario puede elegir 10, 20 o 50.
- El catálogo de categorías se carga completo para mostrar nombres y alimentar el filtro.
- El listado no muestra el nombre del autor; el detalle sí muestra su información pública.
- El número de favoritos es informativo; añadir o quitar favoritos se implementa en otra feature.
- Las acciones de editar, cambiar estado y eliminar se implementan en otra feature.
- La moneda de presentación es el euro y el formato es español; el plan confirmará el detalle.
- Si la página solicitada supera el total, se muestra la última página disponible.
- La página, el tamaño de página y los filtros se conservan en la dirección para permitir recargar o
  compartir la vista.
- No existe paginación infinita.
- Los anuncios similares y los del vendedor se obtienen del catálogo existente y solo incluyen
  anuncios disponibles.
- No existen filtros por rango de precio, mapa, recomendaciones ni búsquedas guardadas.
- Los datos de ejemplo del sistema permiten probar un listado de varias páginas.
- La interfaz se usa en escritorio y en móvil, con tema claro u oscuro según la preferencia de 001.
- No se implementa actualización en tiempo real; las vistas se actualizan al cargar o al volver a
  solicitarlas.

## Out of Scope

- Creación, edición, eliminación y cambio de estado de anuncios.
- Añadir o quitar favoritos.
- Implementación del perfil propio o del perfil público; solo se enlaza al perfil público de 008.
- Mensajería, conversaciones y acciones de valoración.
- Filtros por precio mínimo o máximo.
- Mapa, recomendaciones, historial de búsquedas y búsquedas guardadas.
- Paginación infinita.
- Actualización en tiempo real.
- Moderación o administración del catálogo.
- Modificaciones del backend, del esquema o de los contratos del servicio existente.
