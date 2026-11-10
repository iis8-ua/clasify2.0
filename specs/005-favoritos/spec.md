# Feature Specification: Favoritos

**Feature Branch**: `005-favoritos`

**Created**: 2026-11-10

**Status**: Draft

**Input**: User description: "Implementa la spec 005-favoritos descrita en docs/00-contexto-specs.md. Lee también docs/12-favoritos.md. No modifiques el backend."

## Clarifications

### Session 2026-11-10

- Q: ¿La página actual de favoritos y de anuncios propios debe conservarse en la dirección al recargar o compartir la vista, igual que en el catálogo? → A: Sí; catálogo, favoritos y anuncios propios conservan la página en la dirección.
- Q: Cuando un anuncio guardado en favoritos se elimina, ¿qué debe ver el usuario en su lista de favoritos? → A: El anuncio desaparece al actualizar la lista; si se intenta abrir antes, se muestra “no encontrado”.
- Q: ¿Dónde debe poder quitarse un anuncio de favoritos? → A: Solo desde el detalle; la lista de favoritos solo abre el detalle.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Guardar o quitar un anuncio de favoritos (Priority: P1)

Como usuario autenticado, quiero guardar un anuncio ajeno en favoritos o quitarlo, para conservar
los que me interesan y poder encontrarlos después.

**Why this priority**: guardar favoritos es la acción principal de la feature. Sin ella no existe
una lista personal que consultar.

**Independent Test**: se puede comprobar abriendo el detalle de un anuncio ajeno, guardándolo,
verificando que el botón cambia de estado y que aparece en favoritos, y quitándolo después.

**Acceptance Scenarios**:

1. **Given** un usuario autenticado en el detalle de un anuncio ajeno, **When** consulta la acción
   de favorito, **Then** ve si el anuncio está guardado o no.
2. **Given** un anuncio no guardado, **When** el usuario lo añade a favoritos, **Then** la acción
   cambia a guardado, el número de favoritos se actualiza y se muestra una confirmación.
3. **Given** un anuncio guardado, **When** el usuario lo quita de favoritos, **Then** la acción
   cambia a no guardado, el número de favoritos se actualiza y se muestra una confirmación.
4. **Given** un anuncio que ya estaba guardado, **When** el usuario vuelve a guardarlo, **Then** el
   resultado sigue siendo guardado y no se produce un duplicado.
5. **Given** un anuncio que ya no está guardado, **When** el usuario intenta quitarlo, **Then** la
   interfaz queda en estado no guardado sin mostrar un error incomprensible.
6. **Given** un visitante sin sesión, **When** pulsa favorito, **Then** se le solicita acceso y,
   tras autenticarse, vuelve al anuncio.
7. **Given** que el usuario es el autor del anuncio, **When** consulta el detalle, **Then** la acción
   de favorito no está disponible y el sistema rechaza la operación.
8. **Given** una operación en curso, **When** el usuario intenta pulsar de nuevo, **Then** la acción
   está deshabilitada y no se procesa dos veces.
9. **Given** un fallo de conexión, **When** la operación no se completa, **Then** el usuario ve un
   mensaje comprensible y el estado anterior se mantiene.
10. **Given** que la sesión deja de ser válida, **When** el usuario intenta añadir o quitar un
    favorito, **Then** se le solicita acceso de nuevo.
11. **Given** que el usuario añade o quita un favorito, **When** la operación termina, **Then** la
    lista de favoritos refleja el cambio sin recargar manualmente la página.

---

### User Story 2 - Consultar mis favoritos (Priority: P2)

Como usuario autenticado, quiero consultar la lista de anuncios que he guardado, para revisar los
que me interesan y abrir su detalle.

**Why this priority**: la lista es el valor duradero de la feature. Sin ella, guardar un favorito no
tendría una forma práctica de consultarse después.

**Independent Test**: se puede comprobar guardando varios anuncios, abriendo la pantalla de
favoritos y verificando que aparecen los anuncios guardados, que se puede abrir su detalle y que los
anuncios vendidos siguen visibles con su estado.

**Acceptance Scenarios**:

1. **Given** un usuario autenticado con favoritos, **When** abre la pantalla de favoritos, **Then**
   ve los anuncios guardados.
2. **Given** la lista de favoritos, **When** el usuario consulta un elemento, **Then** ve título,
   precio, imagen o marcador, categoría, estado y fecha.
3. **Given** un anuncio guardado, **When** el usuario lo selecciona, **Then** se abre su detalle; la
   lista no ofrece una acción directa para quitarlo.
4. **Given** un anuncio guardado que está vendido, **When** el usuario consulta la lista, **Then**
   sigue apareciendo y muestra su estado.
5. **Given** un usuario sin favoritos, **When** abre la pantalla, **Then** ve un estado vacío
   específico y una invitación a explorar anuncios.
6. **Given** un fallo de carga, **When** el usuario recibe el error, **Then** ve un mensaje
   comprensible y puede reintentar.
7. **Given** que el usuario cierra sesión, **When** vuelve a la aplicación en la misma pestaña,
   **Then** no ve los favoritos de la sesión anterior.
8. **Given** una lista de favoritos, **When** el usuario la consulta, **Then** ve como máximo 20
   elementos por página y el guardado más recientemente primero.
9. **Given** un anuncio guardado que ha sido eliminado, **When** el usuario actualiza la lista,
   **Then** el anuncio desaparece; si intenta abrirlo antes, ve un estado de no encontrado.

---

### User Story 3 - Recorrer todas las páginas de favoritos (Priority: P2)

Como usuario autenticado, quiero recorrer todas las páginas de mi lista de favoritos, para no
perderme los anuncios guardados que no caben en la primera página.

**Why this priority**: la lista puede crecer. La paginación completa permite acceder a todos los
favoritos sin límites artificiales.

**Independent Test**: se puede comprobar con una lista de favoritos que ocupe varias páginas,
recorriéndolas hacia delante y hacia atrás y verificando que no se omiten ni repiten elementos.

**Acceptance Scenarios**:

1. **Given** una lista de favoritos con varias páginas, **When** el usuario avanza o retrocede,
   **Then** ve la página correspondiente.
2. **Given** que el usuario está en la primera página, **When** consulta los controles, **Then** la
   acción de ir a la página anterior está deshabilitada.
3. **Given** que el usuario está en la última página, **When** consulta los controles, **Then** la
   acción de ir a la página siguiente está deshabilitada.
4. **Given** una página intermedia, **When** el usuario consulta la información de paginación,
   **Then** ve la página actual y el total de páginas o resultados.
5. **Given** que el usuario cambia de página, **When** la nueva página termina de cargar, **Then** se
   mantiene el contexto de la lista.
6. **Given** que falla la carga de una página, **When** el usuario recibe el error, **Then** puede
   reintentar la página actual.
7. **Given** que la página solicitada supera el total, **When** se detecta, **Then** la aplicación
   muestra la última página disponible.
8. **Given** una página de favoritos activa, **When** el usuario recarga o comparte la dirección,
   **Then** vuelve a ver la misma página.

---

### User Story 4 - Gestionar favoritos con teclado o en móvil (Priority: P3)

Como usuario, quiero usar la acción de favorito y la lista con teclado o desde una pantalla
pequeña, para poder gestionar mis favoritos sin depender del ratón ni de un dispositivo grande.

**Why this priority**: la acción de favorito y la lista son parte del uso habitual. Deben ser
accesibles y usables en móvil como el resto del catálogo.

**Independent Test**: se puede comprobar recorriendo el botón de favorito, la lista y la paginación
solo con teclado y en una pantalla de 360 píxeles de ancho.

**Acceptance Scenarios**:

1. **Given** el detalle de un anuncio o la lista de favoritos, **When** el usuario navega solo con
   teclado, **Then** puede acceder a todas las acciones y el foco es visible.
2. **Given** el botón de favorito, **When** el usuario lo revisa con un lector de pantalla, **Then**
   entiende si el anuncio está guardado o no y qué acción va a realizar.
3. **Given** una tarjeta de favoritos, **When** el usuario la revisa con un lector de pantalla,
   **Then** la información principal y el enlace al detalle son comprensibles.
4. **Given** una pantalla de 360 píxeles de ancho, **When** el usuario recorre la lista y la
   paginación, **Then** no aparece desplazamiento horizontal no intencionado.
5. **Given** un mensaje visible de la feature, **When** el usuario lo lee, **Then** está en español y
   no contiene detalles técnicos internos.

### Edge Cases

- El usuario no tiene sesión e intenta guardar un favorito.
- La sesión caduca mientras se añade o quita un favorito.
- El usuario intenta guardar su propio anuncio.
- El anuncio se elimina mientras está en la lista de favoritos.
- El anuncio se vende después de guardarlo.
- El usuario guarda un anuncio que ya estaba guardado.
- El usuario quita un anuncio que ya no estaba guardado.
- El usuario pulsa varias veces seguidas el botón de favorito.
- La lista de favoritos está vacía.
- La página solicitada supera el total de páginas.
- La carga de favoritos falla por conexión.
- El usuario cierra sesión y vuelve a la pantalla de favoritos.
- El usuario inicia sesión con otra cuenta.
- El usuario navega con teclado o lector de pantalla.
- La pantalla es muy estrecha.
- La imagen del anuncio no existe o tarda en cargar.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La acción de favorito y la lista de favoritos MUST requerir una sesión válida.
- **FR-002**: La acción de favorito MUST estar disponible en el detalle de anuncios ajenos.
- **FR-003**: La acción de favorito MUST reflejar si el anuncio está guardado o no.
- **FR-004**: Un usuario autenticado MUST poder añadir y quitar un anuncio de favoritos.
- **FR-005**: Añadir un favorito ya existente MUST mantener el estado guardado sin duplicados.
- **FR-006**: Quitar un favorito ya inexistente MUST dejar la interfaz en estado no guardado sin un
  error incomprensible.
- **FR-007**: El número de favoritos mostrado en el detalle MUST actualizarse después de añadir o
  quitar.
- **FR-008**: Un visitante que intenta guardar un favorito MUST ser invitado a acceder y, tras
  autenticarse, MUST volver al anuncio.
- **FR-009**: El autor de un anuncio MUST NOT poder guardarlo en favoritos; la acción MUST ocultarse
  o deshabilitarse y el sistema MUST rechazar la operación.
- **FR-010**: La pantalla de favoritos MUST mostrar solo los anuncios guardados por el usuario
  autenticado.
- **FR-011**: La lista de favoritos MUST mostrar título, precio, imagen o marcador, categoría,
  estado y fecha, y MUST permitir abrir el detalle.
- **FR-012**: Los anuncios vendidos MUST seguir apareciendo en favoritos con su estado.
- **FR-013**: La lista de favoritos MUST mostrar el anuncio guardado más recientemente primero.
- **FR-014**: La lista de favoritos MUST usar un tamaño de página de 20.
- **FR-015**: La lista de favoritos MUST distinguir carga, resultados, vacío y error, y MUST ofrecer
  reintento cuando falle.
- **FR-016**: La paginación MUST permitir ir a la primera, anterior, siguiente y última página y MUST
  deshabilitar los controles cuando no corresponda.
- **FR-017**: Si la página solicitada supera el total, la aplicación MUST mostrar la última página
  disponible.
- **FR-018**: Después de añadir o quitar un favorito, la acción y la lista MUST actualizarse sin
  recargar manualmente la página.
- **FR-019**: Las operaciones en curso MUST mostrar carga y MUST impedir acciones duplicadas.
- **FR-020**: Los errores de conexión MUST mostrar un mensaje comprensible y MUST conservar el estado
  anterior cuando la operación no se complete.
- **FR-021**: Un fallo de sesión durante la operación MUST solicitar un nuevo acceso y MUST NOT dejar
  datos privados obsoletos visibles.
- **FR-022**: El cierre de sesión MUST eliminar los favoritos de la interfaz en la pestaña actual y
  MUST impedir que se muestren a la cuenta anterior.
- **FR-023**: La acción de favorito MUST tener un nombre accesible que indique si añade o quita.
- **FR-024**: La lista y la paginación MUST ser utilizables con teclado, con foco visible y en una
  pantalla de 360 píxeles de ancho.
- **FR-025**: Los mensajes visibles MUST estar en español y MUST NOT exponer detalles técnicos
  internos.
- **FR-026**: Las operaciones correctas MUST proporcionar una confirmación perceptible.
- **FR-027**: Esta feature MUST NOT mostrar el estado de favorito en el listado general.
- **FR-028**: Esta feature MUST NOT incluir favoritos compartidos, notificaciones, acciones masivas,
  búsqueda, filtros ni ordenación personalizada de la lista.
- **FR-029**: Esta feature MUST NOT modificar el backend ni sustituir sus respuestas por datos
  simulados.
- **FR-030**: La página actual de favoritos MUST conservarse en la dirección al recargar o compartir
  la vista.
- **FR-031**: Un anuncio eliminado MUST desaparecer de la lista de favoritos la próxima vez que se
  cargue; si el usuario intenta abrirlo antes, MUST mostrarse un estado de anuncio no encontrado.
- **FR-032**: Quitar un favorito MUST realizarse únicamente desde el detalle; la lista de favoritos
  MUST limitarse a mostrar los anuncios y abrir su detalle.

### Key Entities *(include if feature involves data)*

- **Favorito**: relación entre un usuario y un anuncio guardado, con la fecha en que se guardó.
- **Lista de favoritos**: conjunto paginado de anuncios guardados por el usuario autenticado.
- **Estado de favorito**: indica si el anuncio está guardado o no para el usuario actual.
- **Página de favoritos**: conjunto de anuncios guardados de una página, con página actual, tamaño,
  total y total de páginas.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100 % de los usuarios autenticados puede añadir y quitar un favorito y ve el cambio
  en la acción sin recargar manualmente la página.
- **SC-002**: El 100 % de los intentos de guardar un favorito ya guardado mantiene el estado guardado
  sin duplicados.
- **SC-003**: El 100 % de los visitantes que intenta guardar un favorito recibe una invitación a
  acceder y vuelve al anuncio tras autenticarse.
- **SC-004**: El 100 % de los intentos de guardar el propio anuncio oculta o rechaza la acción.
- **SC-005**: El 100 % de las listas de favoritos muestra solo anuncios guardados por el usuario
  autenticado, con un máximo de 20 elementos por página y el más reciente primero.
- **SC-006**: El 100 % de los anuncios vendidos guardados sigue visible en favoritos con su estado.
- **SC-007**: El 100 % de las listas vacías muestra un estado vacío distinto de un error de carga.
- **SC-008**: El 100 % de las páginas de una lista de favoritos de prueba es accesible mediante los
  controles de paginación, sin omitir ni repetir elementos.
- **SC-009**: El 100 % de los cierres de sesión elimina los favoritos de la interfaz en la pestaña
  actual y solicita acceso para volver a consultarlos.
- **SC-010**: El 100 % de las sesiones caducadas durante una operación de favoritos solicita un nuevo
  acceso y no deja datos privados obsoletos.
- **SC-011**: El 100 % de la acción de favorito, la lista y la paginación puede usarse solo con
  teclado, con foco visible y nombres accesibles.
- **SC-012**: La lista y la paginación se usan sin desplazamiento horizontal no intencionado en una
  pantalla de 360 píxeles de ancho.
- **SC-013**: El 100 % de los mensajes visibles está en español y no expone detalles técnicos
  internos.
- **SC-014**: Un usuario puede guardar un anuncio en favoritos en menos de 10 segundos en una prueba
  manual con los datos de ejemplo.
- **SC-015**: El 100 % de las operaciones en curso impide una segunda acción duplicada.
- **SC-016**: Esta feature no modifica el backend ni introduce respuestas simuladas para las
  operaciones de favoritos.
- **SC-017**: El 100 % de las recargas o aperturas directas de una página de favoritos conserva la
  misma página en la dirección.
- **SC-018**: El 100 % de los anuncios eliminados desaparece de la lista de favoritos al actualizarla;
  si se intenta abrir antes, se muestra un estado de no encontrado.
- **SC-019**: El 100 % de la lista de favoritos se limita a mostrar los anuncios y abrir su detalle;
  quitar un favorito se ofrece únicamente en el detalle.

## Assumptions

- La estructura común, las rutas y los estados de interfaz se apoyan en la spec 001.
- La sesión y la identificación del usuario se apoyan en la spec 002.
- El listado, el detalle y el catálogo de categorías se apoyan en la spec 003.
- El backend existente ofrece añadir, quitar y listar favoritos; no se modifica en esta feature.
- Solo los usuarios autenticados pueden guardar y consultar favoritos.
- El autor de un anuncio no puede guardarlo en sus propios favoritos.
- Guardar un favorito ya existente no crea duplicados.
- Quitar un favorito que ya no existe deja la interfaz en estado no guardado.
- La lista de favoritos incluye anuncios vendidos y los muestra con su estado.
- Los anuncios eliminados no se conservan en favoritos; desaparecen al actualizar la lista.
- La lista se ordena por fecha de guardado, del más reciente al más antiguo.
- El tamaño de página es fijo en 20.
- La página actual de favoritos se conserva en la dirección para permitir recargar o compartir la
  vista.
- La lista no incluye búsqueda, filtros ni ordenación personalizada.
- La acción de favorito se ofrece en el detalle, no en el listado general ni en la lista de favoritos.
- Después del acceso desde una invitación, el usuario vuelve al anuncio y debe confirmar de nuevo la
  acción de favorito.
- El cierre de sesión limpia los favoritos de la interfaz en la pestaña actual.
- No se incluye sincronización entre dispositivos más allá de la sesión.
- Los datos de ejemplo del sistema permiten probar favoritos con varios anuncios.
- La interfaz se usa en escritorio y en móvil, con un único modo claro.

## Out of Scope

- Mostrar el estado de favorito en el listado general.
- Favoritos compartidos entre usuarios o listas públicas.
- Notificaciones cuando cambia un favorito o cambia el estado de un anuncio guardado.
- Acciones masivas para quitar varios favoritos a la vez.
- Quitar favoritos directamente desde la lista de favoritos.
- Búsqueda, filtros u ordenación personalizada dentro de favoritos.
- Recomendaciones basadas en favoritos.
- Perfil, mensajería y valoraciones.
- Sincronización entre dispositivos más allá de la sesión.
- Modificaciones del backend, del esquema o de los contratos del servicio existente.
