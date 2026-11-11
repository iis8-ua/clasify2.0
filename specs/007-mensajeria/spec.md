# Feature Specification: Mensajería

**Feature Branch**: `007-mensajeria`

**Created**: 2026-11-11

**Status**: Draft

**Input**: User description: "Añadir mensajería al frontend de Clasify usando los endpoints existentes del backend, sin modificarlo."

## Clarifications

### Session 2026-11-11

- Q: ¿Qué alcance tiene la mensajería? → A: Completa: bandeja, hilo, envío, botón Contactar, no leídos y últimos mensajes en el detalle.
- Q: ¿Cómo se inicia una conversación desde un anuncio? → A: Con un modal en el detalle que envía el primer mensaje.
- Q: ¿Cómo se cargan los hilos? → A: Se abre en los últimos mensajes y se pueden cargar los anteriores.
- Q: ¿Dónde se muestran los no leídos? → A: Solo en la bandeja; no hay contador global en la cabecera.
- Q: ¿Se actualiza en tiempo real? → A: No; se consulta al abrir la bandeja, el hilo o al reintentar.
- Q: ¿Qué ocurre con un anuncio vendido? → A: No se puede iniciar una conversación nueva, pero un hilo ya abierto puede continuar.
- Q: ¿Qué ocurre si un visitante pulsa Contactar? → A: Se le pide acceso y vuelve al anuncio; después debe reabrir el modal.
- Q: ¿Se pueden enviar adjuntos? → A: No; solo texto de hasta 1000 caracteres.
- Q: ¿Qué tamaño de página usan las listas? → A: 20 por defecto, con selector de 10, 20 o 50.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Contactar con el vendedor desde un anuncio (Priority: P1)

Como usuario autenticado interesado en un anuncio ajeno, quiero escribir al vendedor desde el
detalle, para preguntar por el artículo sin salir de la ficha.

**Why this priority**: iniciar la conversación es la acción principal de la mensajería. Sin ella no
existe un hilo que consultar ni una bandeja que llenar.

**Independent Test**: se puede comprobar abriendo un anuncio ajeno, pulsando Contactar, enviando un
primer mensaje y verificando que se abre la conversación con el mensaje enviado.

**Acceptance Scenarios**:

1. **Given** un usuario autenticado en el detalle de un anuncio ajeno sin conversación, **When**
   consulta las acciones, **Then** ve la acción Contactar.
2. **Given** el modal de contacto, **When** el usuario escribe y envía un mensaje válido, **Then** la
   conversación se crea o se reutiliza y se abre su hilo.
3. **Given** un anuncio con una conversación ya iniciada por el usuario, **When** consulta el
   detalle, **Then** ve la acción Ver conversación o Escribir y no se crea un hilo duplicado.
4. **Given** un anuncio propio, **When** el usuario consulta el detalle, **Then** no ve la acción de
   contactar consigo mismo.
5. **Given** un anuncio vendido sin conversación previa, **When** el usuario consulta el detalle,
   **Then** la acción Contactar está deshabilitada y explica que no se puede iniciar un hilo nuevo.
6. **Given** un anuncio vendido con conversación previa, **When** el usuario consulta el detalle,
   **Then** puede abrir el hilo existente y seguir escribiendo.
7. **Given** un visitante sin sesión, **When** pulsa Contactar, **Then** se le solicita acceso y,
   tras autenticarse, vuelve al anuncio para reabrir el modal manualmente.
8. **Given** un envío en curso, **When** el usuario intenta enviar de nuevo, **Then** la acción está
   deshabilitada y no se procesa dos veces.
9. **Given** un fallo de conexión, **When** el primer mensaje no se envía, **Then** el usuario ve un
   mensaje comprensible y el formulario conserva el texto.
10. **Given** que la sesión deja de ser válida, **When** el usuario intenta contactar, **Then** se le
    solicita acceso de nuevo.

---

### User Story 2 - Consultar mi bandeja de conversaciones (Priority: P1)

Como usuario autenticado, quiero consultar todas mis conversaciones, para saber con quién hablo, de
qué anuncio y qué mensajes tengo pendientes.

**Why this priority**: la bandeja es el punto de entrada para vendedores y para cualquier usuario que
quiera retomar una conversación sin volver al anuncio.

**Independent Test**: se puede comprobar con conversaciones como comprador y como vendedor, verificando
que aparecen el anuncio, la contraparte, el último mensaje y los no leídos.

**Acceptance Scenarios**:

1. **Given** un usuario autenticado con conversaciones, **When** abre la bandeja, **Then** ve sus
   conversaciones ordenadas por actividad reciente.
2. **Given** una conversación de la bandeja, **When** el usuario la consulta, **Then** ve el anuncio,
   la contraparte, el último mensaje, su fecha y el número de mensajes no leídos.
3. **Given** una conversación sin mensajes no leídos, **When** el usuario la consulta, **Then** no se
   muestra un contador pendiente.
4. **Given** un usuario sin conversaciones, **When** abre la bandeja, **Then** ve un estado vacío
   específico con una invitación a explorar anuncios.
5. **Given** un fallo de carga, **When** el usuario recibe el error, **Then** ve un mensaje comprensible
   y puede reintentar.
6. **Given** una bandeja con varias páginas, **When** el usuario avanza o retrocede, **Then** accede a
   todas las conversaciones sin omitir ni repetir elementos.
7. **Given** la bandeja, **When** el usuario cambia el tamaño de página entre 10, 20 y 50, **Then** la
   lista se actualiza y vuelve a la primera página.
8. **Given** que el usuario cierra sesión, **When** vuelve a la aplicación en la misma pestaña,
   **Then** no ve conversaciones de la sesión anterior.
9. **Given** que la página solicitada supera el total, **When** se detecta, **Then** se muestra la
   última página disponible.

---

### User Story 3 - Leer y responder un hilo de mensajes (Priority: P2)

Como participante de una conversación, quiero leer los mensajes y responder, para mantener la
comunicación sobre el anuncio.

**Why this priority**: la bandeja y el contacto no tienen valor sin un hilo donde leer y responder.

**Independent Test**: se puede comprobar abriendo una conversación, leyendo los últimos mensajes,
cargando anteriores, enviando una respuesta y verificando que los no leídos desaparecen.

**Acceptance Scenarios**:

1. **Given** una conversación con mensajes, **When** el usuario la abre, **Then** ve los últimos
   mensajes y puede desplazarse para leerlos en orden cronológico.
2. **Given** un hilo con más mensajes de los que caben en una página, **When** el usuario carga
   mensajes anteriores, **Then** accede a las páginas previas sin omitir ni repetir mensajes.
3. **Given** un hilo con varios mensajes, **When** el usuario cambia el tamaño de página entre 10, 20
   y 50, **Then** el hilo se recarga con el tamaño elegido.
4. **Given** un mensaje válido, **When** el usuario lo envía, **Then** aparece en el hilo con su fecha
   y el emisor correspondiente.
5. **Given** un mensaje vacío o de más de 1000 caracteres, **When** el usuario intenta enviarlo,
   **Then** ve un error asociado al campo y no se envía.
6. **Given** un hilo con mensajes no leídos, **When** el usuario lo abre, **Then** se marcan como
   leídos y la bandeja deja de mostrarlos como pendientes.
7. **Given** un fallo de conexión al cargar o enviar, **When** el usuario recibe el error, **Then** ve
   un mensaje comprensible, puede reintentar y no pierde el texto escrito.
8. **Given** una conversación inexistente, **When** el usuario intenta abrirla, **Then** ve un estado
   de no encontrado.
9. **Given** una conversación de otro usuario, **When** el usuario intenta abrirla, **Then** ve un
   error de permisos y no accede a los mensajes.
10. **Given** que la sesión deja de ser válida, **When** el usuario intenta leer o enviar, **Then** se
    le solicita acceso de nuevo.

---

### User Story 4 - Usar la mensajería con teclado o en móvil (Priority: P3)

Como usuario, quiero usar la bandeja, el hilo y el formulario de mensaje con teclado o en una pantalla
pequeña, para comunicarme sin depender del ratón ni de un dispositivo grande.

**Why this priority**: la mensajería es una interacción de uso frecuente y debe mantener la
accesibilidad del resto de la aplicación.

**Independent Test**: se puede comprobar recorriendo bandeja, hilo y formulario solo con teclado y en
una pantalla de 360 píxeles de ancho.

**Acceptance Scenarios**:

1. **Given** la bandeja o el hilo, **When** el usuario navega solo con teclado, **Then** puede acceder
   a todas las acciones y el foco es visible.
2. **Given** una conversación, **When** el usuario la revisa con un lector de pantalla, **Then**
   entiende el anuncio, la contraparte, el último mensaje y los no leídos.
3. **Given** el formulario de mensaje, **When** el usuario lo revisa con un lector de pantalla,
   **Then** el campo tiene etiqueta, el error está asociado y el estado de envío es comprensible.
4. **Given** una pantalla de 360 píxeles de ancho, **When** el usuario recorre bandeja, hilo y
   formulario, **Then** no aparece desplazamiento horizontal no intencionado.
5. **Given** un mensaje visible de la feature, **When** el usuario lo lee, **Then** está en español y
   no contiene detalles técnicos internos.

### Edge Cases

- El usuario intenta contactar con su propio anuncio.
- El anuncio está vendido y no hay conversación previa.
- El anuncio está vendido y la conversación ya existía.
- El anuncio se elimina mientras existe una conversación.
- El usuario intenta abrir una conversación de la que no participa.
- La conversación no existe o el identificador no es válido.
- El usuario no tiene sesión e intenta abrir la bandeja o un hilo.
- La sesión caduca durante la carga o el envío.
- El usuario envía un mensaje vacío o demasiado largo.
- El usuario pulsa varias veces seguidas el botón de enviar.
- El hilo no tiene mensajes.
- La bandeja está vacía.
- La página solicitada supera el total.
- La carga de la bandeja, del hilo o del envío falla por conexión.
- El usuario cambia el tamaño de página con una página avanzada activa.
- El usuario navega con teclado o lector de pantalla.
- La pantalla es muy estrecha.
- La imagen del anuncio no existe o tarda en cargar.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La bandeja, el hilo y el envío de mensajes MUST requerir una sesión válida.
- **FR-002**: La cabecera MUST mostrar el acceso a Mensajes cuando haya sesión y MUST ocultarlo a los
  visitantes.
- **FR-003**: La bandeja MUST estar disponible en una ruta propia y MUST mostrar las conversaciones
  del usuario autenticado como comprador y como vendedor.
- **FR-004**: Cada conversación de la bandeja MUST mostrar el anuncio, la contraparte, el último
  mensaje, su fecha y el número de mensajes no leídos.
- **FR-005**: La bandeja MUST ordenar las conversaciones por actividad reciente.
- **FR-006**: El detalle de un anuncio ajeno MUST ofrecer la acción de contactar con el vendedor.
- **FR-007**: La acción de contactar MUST abrir un formulario para escribir el primer mensaje.
- **FR-008**: Un anuncio propio MUST NOT ofrecer la acción de contactar consigo mismo.
- **FR-009**: Un anuncio vendido sin conversación previa MUST deshabilitar la acción de contactar y
  MUST explicar el motivo.
- **FR-010**: Un anuncio vendido con conversación previa MUST permitir continuar el hilo existente.
- **FR-011**: Si ya existe una conversación del usuario con el anuncio, el detalle MUST ofrecer abrir
  esa conversación en lugar de crear otra.
- **FR-012**: El primer mensaje MUST enviarse con el texto escrito por el usuario y MUST abrir la
  conversación resultante.
- **FR-013**: Un visitante que intenta contactar MUST ser invitado a acceder y, tras autenticarse,
  MUST volver al anuncio.
- **FR-014**: Tras el acceso, el usuario MUST reabrir manualmente el formulario de contacto.
- **FR-015**: El hilo MUST mostrar los mensajes del más antiguo al más nuevo dentro de la página.
- **FR-016**: El hilo MUST abrirse inicialmente en los últimos mensajes.
- **FR-017**: El hilo MUST permitir cargar mensajes anteriores sin omitir ni repetir elementos.
- **FR-018**: Abrir un hilo MUST marcar como leídos los mensajes pendientes del otro participante.
- **FR-019**: La bandeja MUST dejar de mostrar como no leídos los mensajes que se hayan leído.
- **FR-020**: El formulario de mensaje MUST exigir texto no vacío y MUST limitarlo a 1000 caracteres.
- **FR-021**: El envío de un mensaje MUST mostrar carga y MUST impedir envíos duplicados.
- **FR-022**: Un mensaje enviado correctamente MUST aparecer en el hilo sin recargar manualmente la
  página.
- **FR-023**: La bandeja y el hilo MUST distinguir carga, resultados, vacío y error, y MUST ofrecer
  reintento cuando falle la carga.
- **FR-024**: La bandeja MUST mostrar un estado vacío específico cuando el usuario no tiene
  conversaciones.
- **FR-025**: Si la conversación no existe, MUST mostrarse un estado de no encontrado.
- **FR-026**: Si el usuario no participa en la conversación, MUST mostrarse un error de permisos sin
  revelar mensajes.
- **FR-027**: La bandeja y el hilo MUST usar un tamaño de página de 20 por defecto y MUST permitir
  elegir entre 10, 20 y 50.
- **FR-028**: El tamaño de página y la página actual MUST conservarse en la dirección para permitir
  recargar o compartir la vista.
- **FR-029**: Cambiar el tamaño de página MUST volver a la primera página.
- **FR-030**: Si la página solicitada supera el total, la aplicación MUST mostrar la última página
  disponible.
- **FR-031**: El detalle MUST mostrar los últimos mensajes de una conversación existente solo a sus
  participantes.
- **FR-032**: El detalle MUST ofrecer un enlace al perfil público de la contraparte.
- **FR-033**: La bandeja y el hilo MUST ofrecer un enlace al perfil público de la contraparte.
- **FR-034**: Un fallo de sesión durante la operación MUST solicitar un nuevo acceso y MUST NOT dejar
  datos privados obsoletos visibles.
- **FR-035**: El cierre de sesión MUST eliminar de la interfaz la bandeja, el hilo y los mensajes de
  la cuenta anterior.
- **FR-036**: La bandeja, el hilo, el formulario y la paginación MUST ser utilizables con teclado, con
  foco visible y en una pantalla de 360 píxeles de ancho.
- **FR-037**: Los mensajes visibles MUST estar en español y MUST NOT exponer detalles técnicos
  internos.
- **FR-038**: Las operaciones correctas MUST proporcionar una confirmación perceptible.
- **FR-039**: Esta feature MUST NOT incluir mensajería en tiempo real, adjuntos, notificaciones push
  o por email, conversaciones grupales, búsqueda de mensajes ni moderación.
- **FR-040**: Esta feature MUST NOT modificar el backend ni sustituir sus respuestas por datos
  simulados.

### Key Entities *(include if feature involves data)*

- **Conversación**: relación entre un anuncio, un comprador y un vendedor, con fecha de creación y
  actividad reciente.
- **Mensaje**: texto enviado por un participante, con fecha, emisor y estado de lectura.
- **Bandeja**: conjunto paginado de conversaciones de un usuario, con anuncio, contraparte, último
  mensaje y no leídos.
- **Hilo**: conjunto paginado de mensajes de una conversación.
- **Página de resultados**: conjunto de conversaciones o mensajes de una página, con página actual,
  tamaño, total y total de páginas.

## Success Criteria *(mandatory)*

- **SC-001**: El 100 % de los usuarios autenticados puede iniciar una conversación desde un anuncio
  ajeno y ve el hilo resultante.
- **SC-002**: El 100 % de los anuncios propios oculta la acción de contactar consigo mismo.
- **SC-003**: El 100 % de los anuncios vendidos sin conversación previa muestra la acción de contactar
  deshabilitada con un motivo comprensible.
- **SC-004**: El 100 % de los anuncios vendidos con conversación previa permite continuar el hilo.
- **SC-005**: El 100 % de los visitantes que intenta contactar recibe una invitación a acceder y vuelve
  al anuncio tras autenticarse.
- **SC-006**: El 100 % de las bandejas muestra solo conversaciones del usuario autenticado, con el
  anuncio, la contraparte, el último mensaje y los no leídos.
- **SC-007**: El 100 % de las bandejas vacías muestra un estado vacío distinto de un error de carga.
- **SC-008**: El 100 % de los hilos abre en los últimos mensajes y permite cargar anteriores sin
  omitir ni repetir elementos.
- **SC-009**: El 100 % de los mensajes enviados correctamente aparece en el hilo sin recargar
  manualmente la página.
- **SC-010**: El 100 % de los mensajes vacíos o de más de 1000 caracteres se rechaza con un mensaje
  comprensible.
- **SC-011**: El 100 % de las aperturas de un hilo marca como leídos los mensajes pendientes y
  actualiza la bandeja.
- **SC-012**: El 100 % de las conversaciones inexistentes muestra no encontrado y el 100 % de las
  ajenas muestra permisos sin revelar mensajes.
- **SC-013**: El 100 % de las bandejas e hilos permite elegir 10, 20 o 50 elementos por página y
  conserva el tamaño y la página en la dirección.
- **SC-014**: El 100 % de las páginas de una bandeja o un hilo de prueba es accesible mediante los
  controles de paginación.
- **SC-015**: El 100 % de la bandeja, el hilo y el formulario puede usarse solo con teclado, con foco
  visible y nombres accesibles.
- **SC-016**: La bandeja, el hilo y el formulario se usan sin desplazamiento horizontal no intencionado
  en una pantalla de 360 píxeles de ancho.
- **SC-017**: El 100 % de los mensajes visibles está en español y no expone detalles técnicos
  internos.
- **SC-018**: El 100 % de los cierres de sesión elimina la bandeja, el hilo y los mensajes de la
  interfaz.
- **SC-019**: Esta feature no modifica el backend ni introduce respuestas simuladas para la
  mensajería.

## Assumptions

- La estructura común, las rutas, los estados y el tema se apoyan en la spec 001.
- La sesión y la identificación del usuario se apoyan en la spec 002.
- El detalle del anuncio y las tarjetas se apoyan en la spec 003.
- El perfil público enlazado desde la contraparte se especifica en la spec 008.
- El backend existente ofrece bandeja, hilo, envío y conversación por anuncio; no se modifica.
- La conversación se crea al enviar el primer mensaje; no se crea un hilo vacío desde la interfaz.
- El vendedor consulta todas sus conversaciones en la bandeja; el comprador puede llegar al hilo
  desde el anuncio o desde la bandeja.
- Los mensajes son solo de texto y no admiten adjuntos.
- Los no leídos se muestran por conversación en la bandeja; no existe un contador global exacto en la
  cabecera.
- El tamaño de página por defecto es 20 y se puede cambiar a 10 o 50.
- La actualización es por consulta al abrir o reintentar, sin tiempo real.
- Los datos de ejemplo permiten probar conversaciones como comprador y como vendedor.
- La interfaz se usa en escritorio y en móvil, con tema claro u oscuro según la preferencia de 001.

## Out of Scope

- Mensajería en tiempo real o WebSocket.
- Notificaciones push o por email.
- Adjuntos, imágenes o audios en mensajes.
- Conversaciones grupales.
- Búsqueda dentro de conversaciones o mensajes.
- Acciones masivas sobre conversaciones.
- Moderación de mensajes o de conversaciones.
- Bloqueo de usuarios.
- Contador global de no leídos en la cabecera.
- Sincronización en vivo entre pestañas o dispositivos.
- Pagos, envíos o logística.
- Modificaciones del backend, del esquema o de los contratos del servicio existente.
