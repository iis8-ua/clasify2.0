# Feature Specification: Estructura común y navegación del frontend

**Feature Branch**: `001-app-shell`

**Created**: 2026-11-10

**Status**: Draft

**Input**: User description: "Implementa la spec 001-app-shell descrita en docs/00-contexto-specs.md. Lee también docs/15-router.md y docs/16-estados.md. No modifiques el backend."

## Clarifications

### Session 2026-11-10

- Q: ¿Dónde debe aparecer la acción de crear un anuncio? → A: En la cabecera y en el estado vacío de “Mis anuncios”.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Estructura y navegación principal (Priority: P1)

Como visitante, quiero reconocer la aplicación y moverme entre sus vistas principales desde
cualquier página, para saber dónde estoy y qué puedo hacer.

**Why this priority**: es la base sobre la que se montan todas las demás funcionalidades. Sin una
estructura común y una navegación estable, cada vista tendría que resolver por su cuenta la
cabecera, el contenido principal y el acceso a las secciones.

**Independent Test**: se puede comprobar abriendo la aplicación y recorriendo las rutas principales.
La estructura, la marca y la navegación deben mantenerse visibles y coherentes en todas ellas.

**Acceptance Scenarios**:

1. **Given** que la aplicación se abre en cualquier ruta principal, **When** la vista termina de
   mostrarse, **Then** el usuario ve la cabecera con la marca Clasify, la navegación principal y la
   zona de contenido.
2. **Given** que el usuario está en una vista principal, **When** selecciona otra entrada de la
   navegación, **Then** se muestra la vista correspondiente y la entrada activa queda identificada.
3. **Given** que el usuario está en una vista principal, **When** cambia el tamaño de la ventana,
   **Then** la estructura y la navegación siguen siendo utilizables.
4. **Given** que el usuario no tiene sesión, **When** consulta la cabecera, **Then** ve las acciones
   de acceso y no ve como disponibles las secciones privadas.
5. **Given** que el usuario tiene sesión, **When** consulta la cabecera, **Then** ve el acceso a las
   secciones privadas, a su información de sesión y a la acción principal de crear un anuncio.
6. **Given** que el usuario no tiene sesión, **When** consulta la cabecera, **Then** no ve la acción
   de crear un anuncio como disponible.

---

### User Story 2 - Direcciones directas, historial y rutas no encontradas (Priority: P2)

Como usuario, quiero abrir una dirección directa y usar los botones de atrás y adelante, para
recuperar el contexto y saber qué hacer si la dirección no existe.

**Why this priority**: la navegación debe funcionar más allá de los clics internos. Los enlaces
directos, las recargas y el historial son necesarios para compartir vistas y para que la aplicación
no se rompa con direcciones desconocidas.

**Independent Test**: se puede comprobar abriendo directamente cada ruta conocida, recargando la
página, usando atrás y adelante y visitando una dirección inexistente.

**Acceptance Scenarios**:

1. **Given** una ruta conocida, **When** el usuario la abre directamente o recarga la página,
   **Then** se muestra la vista correspondiente sin perder la estructura de la aplicación.
2. **Given** que el usuario ha navegado entre varias vistas, **When** usa atrás o adelante,
   **Then** vuelve a la vista anterior o siguiente con su contexto.
3. **Given** una dirección que no corresponde a ninguna ruta, **When** el usuario la abre,
   **Then** ve una página de no encontrado con una acción para volver al inicio.
4. **Given** una ruta protegida y ningún usuario autenticado, **When** el usuario intenta abrirla,
   **Then** se le solicita acceso y, tras autenticarse, vuelve a la ruta solicitada.
5. **Given** que el usuario ya tiene sesión, **When** abre la vista de acceso o de registro,
   **Then** se le redirige a una vista principal.
6. **Given** una vista cuyo contenido todavía no está implementado, **When** el usuario la abre,
   **Then** ve un estado de sustitución claro y no una pantalla vacía o rota.

---

### User Story 3 - Estados y mensajes consistentes (Priority: P3)

Como usuario, quiero que la aplicación me indique de forma clara si está cargando, no tiene
contenido, ha fallado o ha completado una acción, para entender qué ocurre en cada momento.

**Why this priority**: un listado vacío no es un error y un fallo de carga no debe parecer una
ausencia de datos. La aplicación necesita un lenguaje visual común para los estados antes de
implementar las vistas de negocio.

**Independent Test**: se puede comprobar recorriendo las vistas de ejemplo del shell y verificando
que cada estado se distingue del resto y ofrece la información o acción esperada.

**Acceptance Scenarios**:

1. **Given** una vista que está obteniendo información, **When** la operación sigue en curso,
   **Then** el usuario ve un estado de carga identificable.
2. **Given** una vista sin resultados, **When** la operación termina correctamente, **Then** el
   usuario ve un estado vacío y no un mensaje de error.
3. **Given** una operación que falla, **When** el usuario recibe el error, **Then** ve un mensaje
   comprensible y, cuando procede, una acción para reintentar.
4. **Given** una operación correcta, **When** termina, **Then** el usuario recibe una confirmación
   perceptible.
5. **Given** un error de validación, **When** se muestra, **Then** queda asociado al campo
   correspondiente.
6. **Given** un error de permisos, **When** se muestra, **Then** el usuario entiende que la acción
   no está permitida.
7. **Given** una acción destructiva, **When** el usuario la inicia, **Then** debe confirmarla y
   puede cancelarla sin que se ejecute.

---

### User Story 4 - Presentación accesible y coherente (Priority: P4)

Como usuario, quiero una interfaz clara, coherente y accesible, para poder usarla con teclado, con
lector de pantalla o desde una pantalla pequeña.

**Why this priority**: la accesibilidad y la coherencia visual son requisitos transversales. Si se
resuelven desde la base, las vistas posteriores no tienen que repetir decisiones ni corregir
problemas estructurales.

**Independent Test**: se puede comprobar navegando solo con teclado, revisando el foco visible, las
etiquetas, los textos alternativos, el contraste y la presentación en una pantalla estrecha.

**Acceptance Scenarios**:

1. **Given** que el usuario navega solo con teclado, **When** recorre la cabecera, la navegación y
   la página de no encontrado, **Then** puede acceder a todos los elementos interactivos y el foco
   es visible.
2. **Given** que el usuario utiliza un lector de pantalla, **When** recorre la estructura, **Then**
   encuentra una jerarquía comprensible, etiquetas asociadas y mensajes legibles.
3. **Given** una imagen disponible, **When** se muestra, **Then** tiene un texto alternativo
   adecuado; si no hay imagen, **Then** se muestra un marcador accesible.
4. **Given** una pantalla de 360 píxeles de ancho, **When** el usuario recorre las vistas
   principales, **Then** no aparece desplazamiento horizontal no intencionado.
5. **Given** dos vistas distintas, **When** el usuario las compara, **Then** comparten la misma
   cabecera, navegación, tipografía, espaciado y paleta.
6. **Given** dos vistas con precios, fechas o imágenes, **When** el usuario las compara, **Then**
   los formatos y los marcadores de ausencia son coherentes.
7. **Given** cualquier vista, **When** el usuario consulta la pestaña del navegador, **Then** el
   título describe la vista de forma comprensible.
8. **Given** cualquier vista, **When** el usuario lee los textos de la interfaz, **Then** están
   redactados en español.

### Edge Cases

- El usuario abre una ruta inexistente con parámetros o fragmento en la dirección.
- El usuario recarga una ruta protegida después de que su sesión haya dejado de ser válida.
- El usuario usa atrás o adelante después de haber visto una página de no encontrado.
- El usuario abre una ruta de detalle con un identificador inválido; la estructura no debe romperse
  aunque la vista de detalle gestione el error en una spec posterior.
- El usuario llega a una vista cuyo contenido aún no está implementado; debe ver un estado de
  sustitución claro y no una pantalla rota.
- El título o la descripción de un contenido son muy largos y afectan al layout.
- La imagen no existe, está rota o tarda en cargar.
- El usuario navega con teclado o con un lector de pantalla.
- La ventana es muy estrecha y la navegación necesita adaptarse.
- Una operación falla por conexión mientras la estructura de la aplicación sigue visible.
- El usuario intenta cancelar una confirmación o cerrarla con el teclado.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La aplicación MUST mostrar una estructura común con cabecera, navegación principal y
  zona de contenido en todas las vistas.
- **FR-002**: La cabecera MUST mostrar la marca Clasify y las acciones principales de navegación.
- **FR-003**: La navegación MUST incluir el acceso al listado, a favoritos, al perfil, a las acciones
  de sesión y a la acción principal de crear un anuncio cuando haya sesión, mostrando u ocultando
  las secciones privadas según el estado de sesión.
- **FR-004**: La aplicación MUST disponer de las rutas de listado, detalle, acceso, registro,
  creación, edición, favoritos, perfil y no encontrado.
- **FR-005**: Cada ruta conocida MUST poder abrirse directamente por su dirección y sobrevivir a una
  recarga.
- **FR-006**: La navegación MUST respetar el historial del navegador y permitir atrás y adelante.
- **FR-007**: Las rutas protegidas MUST solicitar acceso cuando no haya una sesión válida y MUST
  recordar la ruta solicitada para volver a ella después del acceso.
- **FR-008**: Las vistas de acceso y registro MUST redirigir a una vista principal cuando el
  usuario ya tenga sesión.
- **FR-009**: Una dirección desconocida MUST mostrar una página de no encontrado con una acción para
  volver al inicio.
- **FR-010**: Las vistas MUST distinguir de forma visible entre carga, contenido, vacío, error,
  validación, permisos y éxito.
- **FR-011**: Un listado vacío MUST presentarse como ausencia de resultados y no como error.
- **FR-012**: Los errores MUST mostrarse con mensajes comprensibles y sin detalles técnicos
  internos.
- **FR-013**: Los errores de validación MUST asociarse al campo correspondiente cuando el sistema
  lo identifique.
- **FR-014**: Los errores de permisos MUST comunicarse como una acción no permitida.
- **FR-015**: Las operaciones correctas MUST proporcionar una confirmación perceptible.
- **FR-016**: Las acciones destructivas MUST solicitar confirmación y MUST permitir cancelarlas sin
  ejecutarlas.
- **FR-017**: La presentación MUST usar una base visual neutral con un color de acento y un único
  modo claro, manteniendo coherencia entre vistas.
- **FR-018**: La estructura MUST ser utilizable en escritorio y en pantallas estrechas sin
  desplazamiento horizontal no intencionado.
- **FR-019**: La interfaz MUST usar estructura semántica, etiquetas asociadas, navegación por
  teclado, foco visible, contraste suficiente y textos alternativos.
- **FR-020**: Los precios MUST mostrarse con un formato decimal coherente y comprensible para el
  usuario.
- **FR-021**: Las fechas MUST mostrarse con un formato coherente y comprensible para el usuario.
- **FR-022**: Las imágenes MUST mostrarse con un texto alternativo y, cuando no existan, con un
  marcador accesible.
- **FR-023**: La cabecera MUST reflejar el estado de sesión y MUST actualizarse cuando cambie.
- **FR-024**: Cada vista MUST tener un título de página descriptivo.
- **FR-025**: Las vistas aún no implementadas MUST mostrar un estado de sustitución claro en lugar
  de una pantalla vacía o rota.
- **FR-026**: La interfaz MUST estar redactada en español.
- **FR-027**: Esta feature MUST NOT implementar los flujos de acceso, registro, listado real,
  detalle real, creación, edición, eliminación, favoritos ni perfil. La acción de la cabecera solo
  navega a las rutas correspondientes; esos flujos se implementan en specs posteriores.
- **FR-028**: Esta feature MUST NOT modificar el backend ni sustituir sus datos por contenido
  simulado.

### Key Entities *(include if feature involves data)*

- **Ruta**: dirección de una vista, propósito, nivel de acceso y vista asociada.
- **Vista**: pantalla con título, contenido y estado de presentación.
- **Estado de interfaz**: situación mostrada al usuario, como carga, vacío, error, validación,
  permisos o éxito, con su mensaje y acción disponible.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100 % de las rutas definidas puede abrirse directamente y muestra su vista o su
  estado de sustitución sin romper la estructura.
- **SC-002**: El 100 % de las direcciones desconocidas muestra la página de no encontrado con una
  acción para volver al inicio.
- **SC-003**: El 100 % de las rutas protegidas solicita acceso cuando no hay sesión y conserva la
  ruta solicitada para volver después del acceso.
- **SC-004**: El 100 % de las vistas comparte la misma cabecera, navegación y paleta; ninguna vista
  implementa una estructura visual independiente.
- **SC-005**: El 100 % de las vistas asíncronas distingue carga, contenido, vacío y error, sin
  presentar un vacío como error.
- **SC-006**: El 100 % de las acciones destructivas solicita confirmación y permite cancelar sin
  ejecutar la acción.
- **SC-007**: Un usuario puede recorrer la navegación principal y la página de no encontrado usando
  solo el teclado, con foco visible en todos los elementos interactivos.
- **SC-008**: Las vistas principales se muestran sin desplazamiento horizontal no intencionado en
  una pantalla de 360 píxeles de ancho.
- **SC-009**: El 100 % de los precios, fechas e imágenes de las vistas principales se presenta con
  un formato coherente y accesible.
- **SC-010**: El 100 % de los mensajes de error visibles está en español y no expone detalles
  técnicos internos.
- **SC-011**: Esta feature no implementa ningún flujo de negocio de acceso, listado, detalle,
  creación, edición, eliminación, favoritos o perfil; su verificación debe confirmar que esas
  pantallas siguen siendo sustituciones o quedan para specs posteriores.
- **SC-012**: El 100 % de los usuarios autenticados ve la acción de crear un anuncio en la cabecera;
  el 100 % de los visitantes no la ve como disponible.

## Assumptions

- El backend existente está terminado y no se modifica en esta feature.
- Esta feature es fundacional: las vistas de negocio se implementan en las specs 002 a 006.
- La creación de anuncios se inicia desde la acción principal de la cabecera; el estado vacío de
  “Mis anuncios” ofrece una llamada contextual al mismo formulario.
- El estado de sesión será proporcionado por la spec de autenticación; hasta entonces, el shell
  trata al usuario como visitante.
- Las rutas protegidas se probarán con un estado de sesión controlado y con la vista de acceso
  prevista para la spec 002.
- La interfaz se redacta en español y se dirige a usuarios de escritorio y de móvil.
- La presentación usa un único modo claro, con una base neutral y un color de acento.
- Se asume el euro como moneda de presentación; el plan confirmará el formato exacto.
- Se reutiliza la pila tecnológica y la arquitectura aprobadas en la constitución y en
  `docs/00-contexto-specs.md`.
- Las vistas de las funcionalidades posteriores pueden existir como sustituciones claras para que
  las rutas funcionen, sin implementar su contenido real.
- No se incluye perfil público, mensajería, valoraciones, modo oscuro ni selector de tamaño de
  página.

## Out of Scope

- Formularios de acceso y registro.
- Listado y detalle con datos reales.
- Formularios y flujos de creación, edición, cancelación de edición y eliminación de anuncios.
- Favoritos y perfil propio.
- Mensajería, conversaciones y valoraciones.
- Modificaciones del backend, del esquema o de los contratos de la API.
- Modo oscuro y selector de tamaño de página.
- Subida de varias imágenes.
- Implementación parcial con otro framework.
