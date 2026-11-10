# Feature Specification: Perfil propio

**Feature Branch**: `006-perfil`

**Created**: 2026-11-10

**Status**: Draft

**Input**: User description: "Implementa la spec 006-perfil descrita en docs/00-contexto-specs.md. Lee también docs/13-perfil.md. No modifiques el backend."

## Clarifications

### Session 2026-11-10

- Q: ¿Dónde deben estar disponibles las acciones de editar, eliminar y cambiar estado de un anuncio propio? → A: Solo en el detalle; la lista de anuncios propios solo abre el detalle.
- Q: ¿La página actual de favoritos y de anuncios propios debe conservarse en la dirección al recargar o compartir la vista, igual que en el catálogo? → A: Sí; catálogo, favoritos y anuncios propios conservan la página en la dirección.
- Q: Cuando el usuario introduce mal su contraseña actual al cambiarla, ¿debe tratarse como un error del formulario o como una sesión caducada? → A: Error de formulario: mantener la sesión, mostrar el error y conservar los datos introducidos.
- Q: ¿Dónde debe aparecer la acción de crear un anuncio? → A: En la cabecera y en el estado vacío de “Mis anuncios”.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consultar mi perfil (Priority: P1)

Como usuario autenticado, quiero consultar mis datos de perfil, para saber qué información tiene la
aplicación sobre mí y revisar mi actividad.

**Why this priority**: el perfil es la vista de identidad del usuario y el punto de partida para
actualizar sus datos y revisar sus anuncios.

**Independent Test**: se puede comprobar iniciando sesión, abriendo el perfil y verificando que se
muestran el nombre, el email, la biografía, la fecha de alta y el resumen de valoraciones.

**Acceptance Scenarios**:

1. **Given** un usuario autenticado, **When** abre su perfil, **Then** ve su nombre, email,
   biografía, fecha de alta y resumen de valoraciones.
2. **Given** un usuario autenticado, **When** consulta el email, **Then** solo ve el suyo.
3. **Given** que el perfil está cargando, **When** la operación sigue en curso, **Then** el usuario ve
   un estado de carga.
4. **Given** que la carga del perfil falla, **When** el usuario recibe el error, **Then** ve un
   mensaje comprensible y puede reintentar.
5. **Given** que la sesión deja de ser válida, **When** el usuario abre el perfil, **Then** se le
   solicita acceso de nuevo.

---

### User Story 2 - Editar mis datos (Priority: P1)

Como usuario autenticado, quiero actualizar mi nombre y mi biografía, para mantener mi perfil
actualizado.

**Why this priority**: los datos personales cambian. Poder corregirlos es una necesidad básica del
perfil y no requiere cambiar la identidad de la cuenta.

**Independent Test**: se puede comprobar abriendo la edición del perfil, modificando el nombre y la
biografía, guardando y verificando que los cambios aparecen en el perfil y en la interfaz.

**Acceptance Scenarios**:

1. **Given** un usuario autenticado, **When** abre la edición de su perfil, **Then** ve los valores
   actuales del nombre y la biografía.
2. **Given** un formulario con un nombre y una biografía válidos, **When** el usuario guarda,
   **Then** los datos se actualizan, se muestra una confirmación, el perfil refleja los cambios y la
   cabecera muestra el nombre actualizado.
3. **Given** un nombre vacío o demasiado largo, **When** el usuario intenta guardar, **Then** ve el
   error correspondiente y no se actualiza el perfil.
4. **Given** una biografía demasiado larga, **When** el usuario intenta guardar, **Then** ve el error
   correspondiente.
5. **Given** el formulario de perfil, **When** el usuario consulta el email, **Then** el email se
   muestra como dato informativo y no se puede editar.
6. **Given** un envío en curso, **When** el usuario intenta guardar de nuevo, **Then** la acción está
   deshabilitada y no se procesa dos veces.
7. **Given** un fallo de conexión, **When** el guardado no se completa, **Then** el usuario ve un
   mensaje comprensible y conserva los datos introducidos.
8. **Given** que el usuario abandona el formulario con cambios, **When** intenta salir, **Then** se
   le advierte antes de perderlos.
9. **Given** que la sesión deja de ser válida, **When** el usuario intenta guardar el perfil,
   **Then** se le solicita acceso de nuevo.

---

### User Story 3 - Cambiar mi contraseña (Priority: P2)

Como usuario autenticado, quiero cambiar mi contraseña indicando la actual, para proteger mi cuenta
sin depender de un proceso externo de recuperación.

**Why this priority**: el cambio de contraseña es una acción de seguridad básica. Debe poder
realizarse desde el perfil y con una comprobación de la contraseña actual.

**Independent Test**: se puede comprobar abriendo el formulario de contraseña, introduciendo la
contraseña actual y una nueva válida, guardando y verificando que el cambio se acepta. También se
puede comprobar con una contraseña actual incorrecta.

**Acceptance Scenarios**:

1. **Given** un usuario autenticado, **When** abre el cambio de contraseña, **Then** ve los campos de
   contraseña actual y contraseña nueva.
2. **Given** una contraseña actual correcta y una nueva de al menos ocho caracteres, **When** el
   usuario guarda, **Then** el cambio se acepta y se muestra una confirmación.
3. **Given** una contraseña nueva de menos de ocho caracteres, **When** el usuario intenta guardar,
   **Then** ve el error correspondiente y no se cambia la contraseña.
4. **Given** una contraseña actual incorrecta, **When** el usuario intenta guardar, **Then** ve un
   mensaje comprensible, la sesión se mantiene y no se pierde el resto de datos del formulario.
5. **Given** un formulario de contraseña, **When** el usuario lo envía, **Then** la contraseña deja de
   mostrarse en la interfaz.
6. **Given** que el usuario no ha introducido la contraseña actual, **When** intenta cambiar la
   contraseña, **Then** no se realiza el cambio.

---

### User Story 4 - Consultar mis anuncios (Priority: P2)

Como usuario autenticado, quiero consultar los anuncios que he publicado, para revisar mi actividad y
abrir el detalle de cada uno.

**Why this priority**: el perfil debe conectar con la actividad del usuario. Sin esta lista, el
usuario no tiene una visión de sus publicaciones desde su cuenta.

**Independent Test**: se puede comprobar publicando o usando anuncios existentes, abriendo la lista
de anuncios propios y verificando que solo aparecen los del usuario y que se puede abrir su detalle.

**Acceptance Scenarios**:

1. **Given** un usuario autenticado con anuncios, **When** consulta sus anuncios, **Then** ve
   únicamente los anuncios que ha publicado.
2. **Given** la lista de anuncios propios, **When** el usuario consulta un elemento, **Then** ve
   título, precio, imagen o marcador, categoría, estado y fecha.
3. **Given** un anuncio propio, **When** el usuario lo selecciona, **Then** se abre su detalle; las
   acciones de gestión, si procede, se realizan allí y no directamente en la lista.
4. **Given** un anuncio propio vendido, **When** el usuario consulta la lista, **Then** sigue
   apareciendo con su estado.
5. **Given** un usuario sin anuncios, **When** consulta la lista, **Then** ve un estado vacío
   específico con una acción que abre el formulario de creación.
6. **Given** un fallo de carga, **When** el usuario recibe el error, **Then** ve un mensaje
   comprensible y puede reintentar.
7. **Given** una lista con varias páginas, **When** el usuario avanza o retrocede, **Then** accede a
   todas las páginas.
8. **Given** que la página solicitada supera el total, **When** se detecta, **Then** se muestra la
   última página disponible.
9. **Given** una página de anuncios propios activa, **When** el usuario recarga o comparte la
   dirección, **Then** vuelve a ver la misma página.

---

### User Story 5 - Gestionar mi perfil con teclado o en móvil (Priority: P3)

Como usuario, quiero consultar y editar mi perfil con teclado o desde una pantalla pequeña, para
poder mantener mis datos sin depender del ratón ni de un dispositivo grande.

**Why this priority**: el perfil contiene formularios y datos personales. La accesibilidad y el uso
en móvil son necesarios para que el usuario pueda gestionarlos en cualquier contexto.

**Independent Test**: se puede comprobar recorriendo el perfil, sus formularios y la lista de
anuncios propios solo con teclado y en una pantalla de 360 píxeles de ancho.

**Acceptance Scenarios**:

1. **Given** el perfil o sus formularios, **When** el usuario navega solo con teclado, **Then** puede
   acceder a todos los campos y acciones y el foco es visible.
2. **Given** un formulario con errores, **When** el usuario los revisa con un lector de pantalla,
   **Then** cada error está asociado al campo correspondiente y se anuncia de forma comprensible.
3. **Given** una pantalla de 360 píxeles de ancho, **When** el usuario abre el perfil o sus
   formularios, **Then** puede usarlos sin desplazamiento horizontal no intencionado.
4. **Given** un mensaje visible del perfil, **When** el usuario lo lee, **Then** está en español y no
   contiene detalles técnicos internos.
5. **Given** una lista de anuncios propios, **When** el usuario la recorre con teclado, **Then** puede
   abrir cada anuncio y usar la paginación.

### Edge Cases

- El usuario no tiene sesión e intenta abrir el perfil.
- La sesión caduca mientras se consulta o edita el perfil.
- El usuario intenta cambiar el email desde el formulario.
- El nombre está vacío o supera los 100 caracteres.
- La biografía supera los 500 caracteres.
- La contraseña nueva tiene menos de ocho caracteres.
- La contraseña actual es incorrecta.
- El usuario envía el formulario dos veces por una pulsación repetida.
- El usuario abandona el formulario con cambios sin guardar.
- El perfil no tiene biografía.
- El usuario no tiene anuncios publicados.
- La lista de anuncios propios tiene varias páginas.
- La página solicitada supera el total de páginas.
- La carga del perfil o de los anuncios falla por conexión.
- El usuario cierra sesión y vuelve al perfil.
- El usuario navega con teclado o lector de pantalla.
- La pantalla es muy estrecha.
- La imagen de un anuncio propio no existe o tarda en cargar.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El perfil MUST ser accesible solo para usuarios autenticados.
- **FR-002**: El perfil MUST mostrar nombre, email, biografía, fecha de alta y resumen de
  valoraciones.
- **FR-003**: El email MUST mostrarse solo al propio usuario y MUST NOT mostrarse en perfiles de
  otras cuentas.
- **FR-004**: El usuario MUST poder editar su nombre y su biografía.
- **FR-005**: El email MUST mostrarse como dato informativo y MUST NOT poder editarse desde el
  frontend.
- **FR-006**: El nombre MUST ser obligatorio y MUST NOT superar 100 caracteres.
- **FR-007**: La biografía MUST NOT superar 500 caracteres.
- **FR-008**: El usuario MUST poder cambiar su contraseña indicando la contraseña actual y una nueva
  de al menos ocho caracteres.
- **FR-009**: El cambio de contraseña MUST rechazarse si falta la contraseña actual o si la nueva no
  cumple la longitud mínima.
- **FR-010**: Una contraseña actual incorrecta MUST mostrar un mensaje comprensible, MUST NOT cerrar
  la sesión y MUST NOT perder el resto de datos del formulario.
- **FR-011**: Los errores de validación MUST mostrarse en el campo correspondiente.
- **FR-012**: Un guardado correcto MUST actualizar el usuario del estado compartido, reflejarse en la
  cabecera y mostrar una confirmación.
- **FR-013**: Los formularios MUST mostrar carga, impedir envíos duplicados y conservar los datos
  introducidos cuando sea posible si falla la conexión.
- **FR-014**: Si hay cambios sin guardar, el usuario MUST recibir una advertencia antes de salir.
- **FR-015**: La contraseña MUST NOT mostrarse ni conservarse visible después del envío.
- **FR-016**: La lista de anuncios propios MUST mostrar solo los anuncios del usuario autenticado.
- **FR-017**: La lista de anuncios propios MUST ser paginada, con 20 elementos por página y los más
  recientes primero.
- **FR-018**: Cada anuncio propio MUST mostrar título, precio, imagen o marcador, categoría, estado y
  fecha, y MUST permitir abrir su detalle.
- **FR-019**: Los anuncios vendidos MUST seguir apareciendo en la lista de anuncios propios con su
  estado.
- **FR-020**: La lista de anuncios propios MUST distinguir carga, resultados, vacío y error, y MUST
  ofrecer reintento cuando falle.
- **FR-021**: La paginación de anuncios propios MUST permitir ir a la primera, anterior, siguiente y
  última página y MUST deshabilitar los controles cuando no corresponda.
- **FR-022**: Si la página solicitada supera el total, la aplicación MUST mostrar la última página
  disponible.
- **FR-023**: La pantalla de perfil, sus formularios y la lista de anuncios propios MUST usar
  estructura semántica, etiquetas asociadas, navegación por teclado, foco visible y mensajes
  accesibles.
- **FR-024**: El perfil, sus formularios y la lista de anuncios propios MUST ser utilizables en una
  pantalla de 360 píxeles de ancho sin desplazamiento horizontal no intencionado.
- **FR-025**: Los mensajes visibles MUST estar en español y MUST NOT exponer detalles técnicos
  internos.
- **FR-026**: Un fallo de sesión MUST solicitar un nuevo acceso y MUST NOT dejar datos privados
  obsoletos visibles.
- **FR-027**: Esta feature MUST NOT incluir cambio de email, subida de avatar, eliminación de cuenta,
  perfil público, mensajería ni valoraciones.
- **FR-028**: Esta feature MUST NOT modificar el backend ni sustituir sus respuestas por datos
  simulados.
- **FR-029**: La lista de anuncios propios MUST limitarse a mostrar los anuncios y abrir su detalle;
  las acciones de editar, eliminar y cambiar estado MUST realizarse desde el detalle.
- **FR-030**: La página actual de anuncios propios MUST conservarse en la dirección al recargar o
  compartir la vista.
- **FR-031**: El estado vacío de anuncios propios MUST ofrecer una acción que abra el formulario de
  creación de un anuncio.

### Key Entities *(include if feature involves data)*

- **Perfil propio**: datos del usuario autenticado, con nombre, email, biografía, fecha de alta y
  resumen de valoraciones.
- **Datos editables**: nombre, biografía y contraseña; el email es informativo y no editable.
- **Lista de anuncios propios**: conjunto paginado de anuncios publicados por el usuario.
- **Página de anuncios propios**: conjunto de anuncios de una página, con página actual, tamaño,
  total y total de páginas.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100 % de los accesos al perfil con sesión válida muestra nombre, email, biografía,
  fecha de alta y resumen de valoraciones.
- **SC-002**: El 100 % de los usuarios ve únicamente su propio email en el perfil.
- **SC-003**: El 100 % de las ediciones válidas de nombre y biografía actualiza el perfil y la
  cabecera y muestra una confirmación.
- **SC-004**: El 100 % de los intentos de editar el email desde el frontend se impide.
- **SC-005**: El 100 % de los cambios de contraseña exige la contraseña actual y una nueva de al
  menos ocho caracteres.
- **SC-006**: El 100 % de las contraseñas actuales incorrectas muestra un mensaje comprensible,
  mantiene la sesión y no pierde el resto de datos del formulario.
- **SC-007**: El 100 % de los errores de validación se muestra en el campo correspondiente.
- **SC-008**: El 100 % de las listas de anuncios propios muestra solo anuncios del usuario, con un
  máximo de 20 elementos por página y los más recientes primero.
- **SC-009**: El 100 % de los anuncios propios permite abrir su detalle y muestra su estado, incluido
  el estado vendido.
- **SC-010**: El 100 % de las listas vacías de anuncios propios muestra un estado vacío distinto de
  un error de carga.
- **SC-011**: El 100 % de las páginas de una lista de anuncios propios de prueba es accesible
  mediante los controles de paginación.
- **SC-012**: El 100 % de la contraseña introducida deja de mostrarse después del envío.
- **SC-013**: El 100 % del perfil, sus formularios y la lista de anuncios propios puede usarse solo
  con teclado, con foco visible y etiquetas accesibles.
- **SC-014**: El perfil, sus formularios y la lista de anuncios propios se usan sin desplazamiento
  horizontal no intencionado en una pantalla de 360 píxeles de ancho.
- **SC-015**: El 100 % de los mensajes visibles está en español y no expone detalles técnicos
  internos.
- **SC-016**: Un usuario puede actualizar su nombre y biografía en menos de 2 minutos en una prueba
  manual con los datos de ejemplo.
- **SC-017**: Esta feature no modifica el backend ni introduce respuestas simuladas para consultar o
  editar el perfil.
- **SC-018**: El 100 % de la lista de anuncios propios se limita a mostrar los anuncios y abrir su
  detalle; las acciones de gestión se ofrecen únicamente en el detalle.
- **SC-019**: El 100 % de las recargas o aperturas directas de una página de anuncios propios conserva
  la misma página en la dirección.
- **SC-020**: El 100 % de los estados vacíos de anuncios propios ofrece una acción que abre el
  formulario de creación.

## Assumptions

- La estructura común, las rutas y los estados de interfaz se apoyan en la spec 001.
- La sesión y la identificación del usuario se apoyan en la spec 002.
- El listado, el detalle y el catálogo de categorías se apoyan en la spec 003.
- La gestión de anuncios se apoya en la spec 004.
- El backend existente ofrece consulta y edición del perfil y la lista de anuncios propios; no se
  modifica en esta feature.
- Solo el propio usuario puede consultar y editar su perfil.
- El email es inmutable en esta versión.
- El nombre admite hasta 100 caracteres y la biografía hasta 500.
- La contraseña nueva debe tener al menos ocho caracteres y requiere la contraseña actual.
- Una contraseña actual incorrecta no invalida la sesión ni se trata como sesión caducada.
- La sesión actual se mantiene después de cambiar la contraseña.
- La lista de anuncios propios incluye anuncios vendidos y los muestra con su estado.
- La lista de anuncios propios se ordena por fecha de creación, del más reciente al más antiguo, y
  usa 20 elementos por página.
- La página actual de anuncios propios se conserva en la dirección para permitir recargar o compartir
  la vista.
- La lista de anuncios propios no incluye búsqueda, filtros ni ordenación personalizada.
- Las acciones de editar, eliminar o cambiar estado de un anuncio se realizan desde el detalle,
  según la spec 004; la lista de anuncios propios solo abre el detalle.
- La creación de anuncios se inicia desde la cabecera o desde la acción del estado vacío de “Mis
  anuncios”; no se ofrece una acción de creación en cada tarjeta de la lista.
- No se incluye avatar, eliminación de cuenta, cambio de email, perfil público, mensajería ni
  valoraciones.
- No se incluye verificación de email, recuperación de contraseña ni autenticación en dos pasos.
- La interfaz se usa en escritorio y en móvil, con un único modo claro.

## Out of Scope

- Perfil público de otros usuarios.
- Subida de avatar o imagen de perfil.
- Eliminación de la cuenta.
- Cambio de email y verificación de email.
- Recuperación o restablecimiento de contraseña.
- Autenticación en dos pasos.
- Mensajería, conversaciones y valoraciones.
- Preferencias de privacidad o de notificaciones.
- Historial de actividad.
- Búsqueda, filtros u ordenación personalizada de anuncios propios.
- Acciones directas de gestión en la lista de anuncios propios.
- Acciones de creación en cada tarjeta de la lista de anuncios propios.
- Administración de usuarios.
- Modificaciones del backend, del esquema o de los contratos del servicio existente.
