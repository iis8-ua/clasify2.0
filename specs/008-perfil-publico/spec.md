# Feature Specification: Perfil público

**Feature Branch**: `008-perfil-publico`

**Created**: 2026-11-11

**Status**: Draft

**Input**: User description: "Añadir el perfil público de otros usuarios al frontend de Clasify usando los endpoints existentes del backend, sin modificarlo."

## Clarifications

### Session 2026-11-11

- Q: ¿Quién puede ver el perfil público? → A: Cualquiera; las acciones de valoración se especifican en 009 y exigen sesión.
- Q: ¿Qué muestra el perfil público? → A: Datos públicos, valoraciones recibidas y anuncios publicados.
- Q: ¿Incluye anuncios vendidos? → A: Sí, todos los anuncios con su estado.
- Q: ¿Desde dónde se enlaza? → A: Desde el autor del anuncio, la contraparte de una conversación y el autor de una valoración.
- Q: ¿Se puede editar desde el perfil público? → A: No; la edición de los datos propios sigue en `/perfil`.
- Q: ¿Qué tamaño de página usan las listas? → A: 20 por defecto, con selector de 10, 20 o 50.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consultar el perfil público de un usuario (Priority: P1)

Como visitante, quiero consultar la información pública de un vendedor o comprador, para conocer su
actividad y decidir si me interesa tratar con él.

**Why this priority**: el perfil público es el contexto de confianza que falta en el detalle del
anuncio y en la mensajería.

**Independent Test**: se puede comprobar abriendo el perfil público de un usuario existente y
verificando que muestra su información pública sin datos privados.

**Acceptance Scenarios**:

1. **Given** un usuario existente, **When** se abre su perfil público, **Then** se muestra su nombre,
   biografía, fecha de alta y resumen de valoraciones.
2. **Given** un perfil público, **When** el usuario consulta los datos, **Then** no ve el email, la
   contraseña ni otros datos privados.
3. **Given** un visitante sin sesión, **When** abre un perfil público, **Then** puede verlo igualmente.
4. **Given** un perfil público sin biografía, **When** se muestra, **Then** se usa un texto de ausencia
   comprensible.
5. **Given** un perfil inexistente, **When** se abre, **Then** se muestra un estado de no encontrado.
6. **Given** un fallo de conexión, **When** el perfil no se puede cargar, **Then** el usuario ve un
   mensaje comprensible y puede reintentar.
7. **Given** un perfil cargando, **When** la operación sigue en curso, **Then** el usuario ve un estado
   de carga.

---

### User Story 2 - Consultar las valoraciones recibidas (Priority: P2)

Como visitante, quiero ver las valoraciones que ha recibido un usuario, para valorar su reputación
antes de contactar o comprar.

**Why this priority**: el resumen de valoraciones ya existe, pero el listado aporta el detalle que
permite interpretarlo.

**Independent Test**: se puede comprobar abriendo un perfil con varias valoraciones y verificando que
se muestran con autor, puntuación, comentario y fecha, y que se puede paginar.

**Acceptance Scenarios**:

1. **Given** un perfil con valoraciones, **When** el usuario consulta el listado, **Then** ve autor,
   puntuación, comentario y fecha de cada valoración.
2. **Given** un perfil sin valoraciones, **When** se consulta el listado, **Then** se muestra un estado
   vacío específico y no un error.
3. **Given** una lista de valoraciones con varias páginas, **When** el usuario avanza o retrocede,
   **Then** accede a todas las valoraciones sin omitir ni repetir elementos.
4. **Given** un perfil con valoraciones, **When** el usuario cambia el tamaño de página entre 10, 20 y
   50, **Then** el listado se actualiza y vuelve a la primera página.
5. **Given** un fallo de carga de valoraciones, **When** el usuario recibe el error, **Then** puede
   reintentar.
6. **Given** una página solicitada fuera de rango, **When** se detecta, **Then** se muestra la última
   página disponible.

---

### User Story 3 - Consultar los anuncios publicados (Priority: P2)

Como visitante, quiero ver los anuncios publicados por un usuario, para descubrir qué más ofrece y
abrir los que me interesen.

**Why this priority**: completa el perfil con la actividad pública del usuario y conecta con el
catálogo existente.

**Independent Test**: se puede comprobar abriendo un perfil con anuncios disponibles y vendidos y
verificando que aparecen con su estado y que se puede abrir su detalle.

**Acceptance Scenarios**:

1. **Given** un perfil con anuncios, **When** se consulta su listado, **Then** aparecen los anuncios
   publicados por ese usuario.
2. **Given** un anuncio del perfil, **When** el usuario lo consulta, **Then** ve título, precio,
   imagen o marcador, categoría, estado y fecha.
3. **Given** un anuncio publicado, **When** el usuario lo selecciona, **Then** se abre su detalle.
4. **Given** un anuncio vendido, **When** se consulta el perfil, **Then** sigue apareciendo con su
   estado.
5. **Given** un perfil sin anuncios, **When** se consulta el listado, **Then** se muestra un estado
   vacío específico.
6. **Given** un anuncio que ya no existe, **When** se intenta abrir su detalle, **Then** se muestra no
   encontrado.
7. **Given** una lista de anuncios con varias páginas, **When** el usuario avanza o retrocede, **Then**
   accede a todas sin omitir ni repetir elementos.
8. **Given** el listado de anuncios, **When** el usuario cambia el tamaño de página entre 10, 20 y 50,
   **Then** la lista se actualiza y vuelve a la primera página.
9. **Given** un fallo de carga de anuncios, **When** el usuario recibe el error, **Then** puede
   reintentar.

---

### User Story 4 - Navegar entre perfiles y acciones públicas (Priority: P3)

Como usuario, quiero llegar al perfil público desde los puntos donde aparece una persona, para
consultar su información sin buscarla manualmente.

**Why this priority**: el perfil solo aporta valor si está conectado con el detalle, la mensajería y
las valoraciones.

**Independent Test**: se puede comprobar abriendo un perfil desde el autor de un anuncio, desde una
conversación y desde el autor de una valoración.

**Acceptance Scenarios**:

1. **Given** el detalle de un anuncio, **When** el usuario selecciona al autor, **Then** se abre su
   perfil público.
2. **Given** una conversación, **When** el usuario selecciona a la contraparte, **Then** se abre su
   perfil público.
3. **Given** una valoración, **When** el usuario selecciona a su autor, **Then** se abre su perfil
   público.
4. **Given** el perfil público, **When** el usuario navega con teclado o lector de pantalla, **Then**
   puede recorrer datos, valoraciones, anuncios y paginación con foco visible.
5. **Given** una pantalla de 360 píxeles de ancho, **When** el usuario recorre el perfil, **Then** no
   aparece desplazamiento horizontal no intencionado.

### Edge Cases

- El perfil público no existe.
- El identificador del perfil no es válido.
- El usuario no tiene biografía.
- El usuario no tiene valoraciones.
- El usuario no tiene anuncios.
- El usuario solo tiene anuncios vendidos.
- La página solicitada supera el total de valoraciones o anuncios.
- La carga del perfil, de las valoraciones o de los anuncios falla por conexión.
- El usuario cambia el tamaño de página con una página avanzada activa.
- El usuario abre el perfil público desde un enlace directo o lo recarga.
- El autor de una valoración ya no está disponible.
- El anuncio enlazado ha sido eliminado.
- El usuario navega con teclado o lector de pantalla.
- La pantalla es muy estrecha.
- La imagen de un anuncio no existe o tarda en cargar.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El perfil público MUST ser accesible por una ruta propia y MUST poder abrirse
  directamente por su dirección.
- **FR-002**: El perfil público MUST ser visible para visitantes y usuarios autenticados.
- **FR-003**: El perfil público MUST mostrar nombre, biografía, fecha de alta y resumen de
  valoraciones.
- **FR-004**: El perfil público MUST NOT mostrar email, contraseña ni datos privados.
- **FR-005**: Un perfil inexistente MUST mostrar un estado de no encontrado.
- **FR-006**: Un identificador inválido MUST mostrar un mensaje comprensible y MUST NOT romper la
  vista.
- **FR-007**: El perfil público MUST distinguir carga, contenido, vacío y error, y MUST ofrecer
  reintento cuando falle.
- **FR-008**: El perfil público MUST mostrar el listado de valoraciones recibidas, con autor,
  puntuación, comentario y fecha.
- **FR-009**: Un perfil sin valoraciones MUST mostrar un estado vacío específico.
- **FR-010**: Las valoraciones MUST ser de solo lectura en esta feature; crear, editar y eliminar se
  especifica en la spec 009.
- **FR-011**: El listado de valoraciones MUST paginarse y MUST mostrar la página actual y el total.
- **FR-012**: El perfil público MUST mostrar los anuncios publicados por el usuario, con título,
  precio, imagen o marcador, categoría, estado y fecha.
- **FR-013**: Los anuncios vendidos MUST seguir apareciendo con su estado.
- **FR-014**: Cada anuncio del perfil MUST permitir abrir su detalle.
- **FR-015**: Un perfil sin anuncios MUST mostrar un estado vacío específico.
- **FR-016**: El listado de anuncios del perfil MUST paginarse y MUST mostrar la página actual y el
  total.
- **FR-017**: Los listados de valoraciones y anuncios MUST usar 20 elementos por página por defecto y
  MUST permitir elegir entre 10, 20 y 50.
- **FR-018**: El tamaño de página y la página actual MUST conservarse en la dirección para permitir
  recargar o compartir la vista.
- **FR-019**: Cambiar el tamaño de página MUST volver a la primera página.
- **FR-020**: Si la página solicitada supera el total, la aplicación MUST mostrar la última página
  disponible.
- **FR-021**: El perfil público MUST enlazarse desde el autor del anuncio en el detalle.
- **FR-022**: El perfil público MUST enlazarse desde la contraparte de una conversación.
- **FR-023**: El perfil público MUST enlazarse desde el autor de una valoración.
- **FR-024**: El perfil público propio MUST enlazarse desde `/perfil`.
- **FR-025**: El perfil público MUST NOT ofrecer acciones de edición, eliminación ni cambio de estado
  de los anuncios.
- **FR-026**: El perfil público MUST usar estructura semántica, etiquetas asociadas, navegación por
  teclado, foco visible y textos alternativos.
- **FR-027**: El perfil público MUST ser utilizable en una pantalla de 360 píxeles de ancho sin
  desplazamiento horizontal no intencionado.
- **FR-028**: Los mensajes visibles MUST estar en español y MUST NOT exponer detalles técnicos
  internos.
- **FR-029**: Un fallo de sesión MUST solicitar un nuevo acceso y MUST NOT dejar datos privados
  obsoletos visibles.
- **FR-030**: Esta feature MUST NOT incluir edición de perfiles ajenos, avatares, seguimiento,
  mensajería, moderación ni acciones de gestión de anuncios.
- **FR-031**: Esta feature MUST NOT modificar el backend ni sustituir sus respuestas por datos
  simulados.

### Key Entities *(include if feature involves data)*

- **Perfil público**: datos visibles de un usuario, sin email ni información privada.
- **Resumen de valoraciones**: media y número de valoraciones recibidas.
- **Valoración recibida**: autor, puntuación, comentario y fecha.
- **Anuncios publicados**: conjunto paginado de anuncios del usuario, con su estado.
- **Página de resultados**: conjunto de valoraciones o anuncios de una página, con página actual,
  tamaño, total y total de páginas.

## Success Criteria *(mandatory)*

- **SC-001**: El 100 % de los perfiles públicos existentes muestra nombre, biografía, fecha de alta y
  resumen de valoraciones.
- **SC-002**: El 100 % de los perfiles públicos oculta email y datos privados.
- **SC-003**: El 100 % de los perfiles inexistentes e identificadores inválidos muestra un estado
  comprensible.
- **SC-004**: El 100 % de los perfiles con valoraciones muestra autor, puntuación, comentario y fecha.
- **SC-005**: El 100 % de los perfiles sin valoraciones muestra un estado vacío distinto de un error.
- **SC-006**: El 100 % de los perfiles con anuncios muestra sus publicaciones con estado, incluidos
  los vendidos.
- **SC-007**: El 100 % de los perfiles sin anuncios muestra un estado vacío específico.
- **SC-008**: El 100 % de los anuncios del perfil permite abrir su detalle o muestra no encontrado.
- **SC-009**: El 100 % de los listados de valoraciones y anuncios permite elegir 10, 20 o 50 elementos
  por página y conserva página y tamaño en la dirección.
- **SC-010**: El 100 % de las páginas de valoraciones y anuncios de prueba es accesible mediante los
  controles de paginación.
- **SC-011**: El 100 % de los accesos desde autor, conversación y valoración abre el perfil público
  correspondiente.
- **SC-012**: El 100 % del perfil público puede recorrerse solo con teclado, con foco visible y
  etiquetas accesibles.
- **SC-013**: El perfil público se usa sin desplazamiento horizontal no intencionado en una pantalla
  de 360 píxeles de ancho.
- **SC-014**: El 100 % de los mensajes visibles está en español y no expone detalles técnicos
  internos.
- **SC-015**: Esta feature no modifica el backend ni introduce respuestas simuladas para consultar el
  perfil público.

## Assumptions

- La estructura común, las rutas, los estados y el tema se apoyan en la spec 001.
- La sesión y la identificación del usuario se apoyan en la spec 002.
- El catálogo y el detalle del anuncio se apoyan en la spec 003.
- El perfil propio se apoya en la spec 006.
- Las acciones de valoración se especifican en la spec 009.
- La mensajería que enlaza a la contraparte se especifica en la spec 007.
- El backend existente ofrece perfil público, valoraciones recibidas y anuncios por usuario; no se
  modifica.
- El email solo se muestra en el perfil propio; el perfil público nunca lo incluye.
- El perfil público es de solo lectura.
- Los anuncios del perfil incluyen los vendidos y se ordenan por fecha de creación descendente.
- El tamaño de página por defecto es 20 y se puede cambiar a 10 o 50.
- La interfaz se usa en escritorio y en móvil, con tema claro u oscuro según la preferencia de 001.

## Out of Scope

- Edición del perfil público.
- Avatar o imagen de perfil.
- Seguimiento entre usuarios.
- Mensajería y valoraciones como acciones; se especifican en 007 y 009.
- Acciones de gestión de anuncios desde el perfil.
- Moderación de perfiles, anuncios o valoraciones.
- Historial de actividad.
- Preferencias de privacidad.
- Pagos, envíos o logística.
- Modificaciones del backend, del esquema o de los contratos del servicio existente.
