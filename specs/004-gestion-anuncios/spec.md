# Feature Specification: Gestión de anuncios

**Feature Branch**: `004-gestion-anuncios`

**Created**: 2026-11-10

**Status**: Draft

**Input**: User description: "Implementa la spec 004-gestion-anuncios descrita en docs/00-contexto-specs.md. Lee también docs/06-crear.md, docs/07-editar.md, docs/08-cancelar-edicion.md, docs/09-eliminar.md y docs/14-estado-anuncio.md. No modifiques el backend."

## Clarifications

### Session 2026-11-10

- Q: ¿Dónde deben estar disponibles las acciones de editar, eliminar y cambiar estado de un anuncio propio? → A: Solo en el detalle; la lista de anuncios propios solo abre el detalle.
- Q: ¿Dónde debe aparecer la acción de crear un anuncio? → A: En la cabecera; el estado vacío de “Mis anuncios” pertenece a 006 y abre la misma ruta.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Publicar un anuncio (Priority: P1)

Como usuario autenticado, quiero publicar un anuncio con título, descripción, precio, categoría e
imagen opcional, para poner un artículo a la venta.

**Why this priority**: publicar es la acción que crea el contenido del catálogo. Sin ella, la
aplicación solo permitiría consultar anuncios existentes.

**Independent Test**: se puede comprobar iniciando sesión, abriendo el formulario de creación,
publicando un anuncio válido y verificando que aparece en su detalle y en el listado.

**Acceptance Scenarios**:

1. **Given** un usuario autenticado, **When** abre el formulario de creación desde la cabecera,
   **Then** ve los campos título, descripción, precio, categoría e imagen opcional. La llamada
   contextual del estado vacío de “Mis anuncios” se implementa en la spec 006 y abre esta misma
   ruta.
2. **Given** un formulario completo y válido, **When** el usuario lo envía, **Then** el anuncio se
   crea, se muestra una confirmación y se abre su detalle.
3. **Given** un formulario con datos inválidos, **When** el usuario intenta enviarlo, **Then** ve los
   errores en los campos correspondientes y no se crea el anuncio.
4. **Given** una imagen opcional, **When** el usuario selecciona un archivo válido, **Then** puede
   previsualizarlo antes de enviar.
5. **Given** una imagen con formato o tamaño no admitido, **When** el usuario intenta usarla,
   **Then** ve un mensaje comprensible asociado a la imagen.
6. **Given** un envío en curso, **When** el usuario intenta enviar de nuevo, **Then** la acción está
   deshabilitada y no se crea un anuncio duplicado.
7. **Given** un fallo de conexión, **When** la creación no se completa, **Then** el usuario ve un
   mensaje comprensible y conserva los datos del formulario.
8. **Given** que el usuario abandona el formulario con cambios, **When** intenta salir, **Then** se
   le advierte antes de perderlos.
9. **Given** que la sesión deja de ser válida, **When** el usuario intenta crear el anuncio,
   **Then** se le solicita acceso de nuevo.

---

### User Story 2 - Editar un anuncio (Priority: P1)

Como autor de un anuncio, quiero editar sus datos y su imagen, para corregir o actualizar la
información publicada.

**Why this priority**: los anuncios cambian de precio, descripción o imagen. Poder corregirlos evita
tener que eliminarlos y volver a crearlos.

**Independent Test**: se puede comprobar abriendo un anuncio propio, modificando uno o varios campos,
guardando y verificando que el detalle y el listado muestran los datos actualizados.

**Acceptance Scenarios**:

1. **Given** un anuncio propio, **When** el autor abre su edición, **Then** el formulario aparece con
   los valores actuales del anuncio.
2. **Given** un formulario de edición con cambios válidos, **When** el autor lo envía, **Then** el
   anuncio se actualiza, se muestra una confirmación y el detalle refleja los nuevos datos.
3. **Given** un formulario sin cambios, **When** el autor intenta guardar, **Then** no se envía
   ninguna operación de actualización.
4. **Given** una imagen actual, **When** el autor selecciona otra imagen válida, **Then** la nueva
   imagen sustituye a la anterior.
5. **Given** un anuncio ajeno, **When** el usuario intenta editarlo, **Then** la acción no está
   disponible y el sistema rechaza la operación.
6. **Given** un anuncio que ya no existe, **When** el autor intenta editarlo, **Then** ve un estado de
   anuncio no encontrado.
7. **Given** datos inválidos, **When** el autor intenta guardar, **Then** ve los errores en los campos
   correspondientes y el anuncio no se modifica.
8. **Given** un fallo de conexión, **When** la edición no se completa, **Then** el usuario ve un
   mensaje comprensible y conserva los cambios del formulario.
9. **Given** que el usuario abandona el formulario con cambios, **When** intenta salir, **Then** se
   le advierte antes de perderlos.

---

### User Story 3 - Cancelar una edición sin guardar (Priority: P2)

Como autor de un anuncio, quiero cancelar la edición sin guardar los cambios, para dejar el anuncio
exactamente como estaba.

**Why this priority**: cancelar es la salida segura de una edición. Debe existir para evitar que el
usuario guarde cambios por error o quede atrapado en el formulario.

**Independent Test**: se puede comprobar abriendo una edición, modificando campos, cancelando y
verificando que el anuncio conserva los valores anteriores y que no se ha producido ninguna
operación de escritura.

**Acceptance Scenarios**:

1. **Given** una edición abierta, **When** el autor selecciona cancelar, **Then** los cambios se
   descartan y vuelve al detalle o a la vista de origen.
2. **Given** una edición con cambios, **When** el autor cancela, **Then** se le pide confirmación
   antes de descartarlos.
3. **Given** una edición sin cambios, **When** el autor cancela, **Then** puede salir sin confirmación
   adicional.
4. **Given** una imagen nueva seleccionada, **When** el autor cancela, **Then** la imagen nueva se
   descarta.
5. **Given** una cancelación completada, **When** el usuario consulta el anuncio, **Then** mantiene
   los datos anteriores y no ve mensajes de éxito de una edición no realizada.

---

### User Story 4 - Eliminar un anuncio (Priority: P2)

Como autor de un anuncio, quiero eliminarlo con una confirmación previa, para retirarlo
definitivamente de la aplicación.

**Why this priority**: eliminar permite retirar anuncios que ya no se ofrecen. Al ser una acción
destructiva, necesita una confirmación clara y una salida segura.

**Independent Test**: se puede comprobar abriendo un anuncio propio, iniciando la eliminación,
cancelando y confirmando después, verificando que el anuncio desaparece del listado y del detalle.

**Acceptance Scenarios**:

1. **Given** un anuncio propio abierto en su detalle, **When** el autor selecciona eliminar,
   **Then** ve una confirmación que identifica el anuncio y advierte de que la acción es definitiva.
2. **Given** la confirmación de borrado, **When** el autor cancela, **Then** no se elimina nada y el
   anuncio sigue visible.
3. **Given** la confirmación de borrado, **When** el autor confirma, **Then** el anuncio se elimina,
   se muestra una confirmación y se vuelve al listado.
4. **Given** un anuncio ajeno, **When** el usuario intenta eliminarlo, **Then** la acción no está
   disponible y el sistema rechaza la operación.
5. **Given** un anuncio que ya no existe, **When** el autor intenta eliminarlo, **Then** se informa
   de que el anuncio ya no está disponible.
6. **Given** un fallo de conexión, **When** la eliminación no se completa, **Then** el anuncio
   permanece visible y el usuario puede reintentar.
7. **Given** un fallo de permisos, **When** el usuario intenta eliminar, **Then** ve un mensaje
   comprensible y el anuncio no se modifica.

---

### User Story 5 - Cambiar el estado del anuncio (Priority: P3)

Como autor de un anuncio, quiero marcarlo como vendido o volver a ponerlo disponible, para reflejar
su situación real sin eliminarlo.

**Why this priority**: el estado permite distinguir anuncios disponibles de vendidos y mantener el
catálogo actualizado sin perder el historial del anuncio.

**Independent Test**: se puede comprobar abriendo un anuncio propio, marcándolo como vendido,
verificando que desaparece del listado por defecto y que sigue accesible por su detalle, y
volviéndolo a marcar como disponible.

**Acceptance Scenarios**:

1. **Given** un anuncio disponible abierto en su detalle, **When** el autor lo marca como vendido,
   **Then** se solicita confirmación y, al aceptar, el estado se actualiza.
2. **Given** un anuncio vendido, **When** el autor lo marca como disponible, **Then** el estado se
   actualiza y vuelve a aparecer en el listado por defecto.
3. **Given** un anuncio vendido, **When** el usuario abre su detalle directo, **Then** sigue siendo
   accesible y muestra el estado vendido.
4. **Given** un anuncio ajeno, **When** el usuario intenta cambiar su estado, **Then** la acción no
   está disponible y el sistema rechaza la operación.
5. **Given** un cambio de estado en curso, **When** el usuario intenta repetirlo, **Then** la acción
   está deshabilitada y no se procesa dos veces.
6. **Given** un fallo de permisos o un anuncio inexistente, **When** el usuario intenta cambiar el
   estado, **Then** ve un mensaje comprensible.
7. **Given** que la sesión deja de ser válida, **When** el usuario intenta cambiar el estado,
   **Then** se le solicita acceso de nuevo.

---

### User Story 6 - Gestionar anuncios con teclado o en móvil (Priority: P3)

Como usuario, quiero crear y editar anuncios con teclado o desde una pantalla pequeña, para poder
gestionar mis publicaciones sin depender del ratón ni de un dispositivo grande.

**Why this priority**: los formularios de gestión son obligatorios para publicar y corregir
anuncios. Si no son accesibles o no funcionan en móvil, una parte de los usuarios no puede
utilizarlos.

**Independent Test**: se puede comprobar recorriendo los formularios y las confirmaciones solo con
teclado y en una pantalla de 360 píxeles de ancho.

**Acceptance Scenarios**:

1. **Given** un formulario de creación o edición, **When** el usuario lo recorre solo con teclado,
   **Then** puede acceder a todos los campos y acciones y el foco es visible.
2. **Given** un formulario con errores, **When** el usuario los revisa con un lector de pantalla,
   **Then** cada error está asociado al campo correspondiente y se anuncia de forma comprensible.
3. **Given** una pantalla de 360 píxeles de ancho, **When** el usuario abre un formulario de gestión,
   **Then** puede completarlo sin desplazamiento horizontal no intencionado.
4. **Given** una confirmación de eliminación o cambio de estado, **When** el usuario la recorre con
   teclado, **Then** puede confirmar o cancelar y el foco es visible.
5. **Given** una imagen seleccionada, **When** el usuario la revisa, **Then** la previsualización
   tiene un texto alternativo o una descripción accesible.
6. **Given** un mensaje visible de la gestión, **When** el usuario lo lee, **Then** está en español y
   no contiene detalles técnicos internos.

### Edge Cases

- El usuario no tiene sesión e intenta crear, editar, eliminar o cambiar el estado.
- La sesión caduca durante una operación de gestión.
- El usuario intenta editar o eliminar un anuncio que no le pertenece.
- El anuncio ha sido eliminado por otra vía antes de guardar.
- El usuario envía el formulario dos veces por una pulsación repetida.
- El usuario modifica un campo y luego lo devuelve a su valor original.
- El usuario selecciona una imagen y luego cancela la edición.
- La imagen tiene un formato no admitido o supera el tamaño máximo.
- La imagen actual no existe o tarda en cargar.
- El título, la descripción o el precio son inválidos.
- El usuario abandona el formulario con cambios sin guardar.
- La conexión falla durante la creación, edición, eliminación o cambio de estado.
- El usuario intenta marcar como vendido un anuncio ya vendido.
- El usuario intenta volver a disponible un anuncio que ya está disponible.
- El anuncio vendido deja de aparecer en el listado por defecto, pero conserva su detalle directo.
- El usuario usa el botón atrás después de eliminar un anuncio.
- El usuario navega con teclado o lector de pantalla.
- El formulario se usa en una pantalla estrecha.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La creación, edición, eliminación y cambio de estado MUST requerir una sesión válida.
- **FR-002**: El formulario de creación MUST solicitar título, descripción, precio, categoría e
  imagen opcional.
- **FR-003**: El título MUST ser obligatorio y MUST NOT superar 150 caracteres.
- **FR-004**: La descripción MUST ser obligatoria y MUST NOT superar 5000 caracteres.
- **FR-005**: El precio MUST ser obligatorio, no negativo, no superar 99999999.99 y tener como máximo
  dos decimales.
- **FR-006**: La categoría MUST ser obligatoria y MUST obtenerse del catálogo real de categorías.
- **FR-007**: La imagen MUST ser opcional, MUST admitir JPEG, PNG o WebP y MUST NOT superar 5 MB.
- **FR-008**: El formulario MUST NOT permitir introducir ni modificar el autor del anuncio.
- **FR-009**: La creación MUST mostrar carga, impedir envíos duplicados y, si es correcta, mostrar
  confirmación y abrir el detalle del anuncio.
- **FR-010**: La creación MUST actualizar el listado sin recargar manualmente la página.
- **FR-011**: Los errores de creación MUST mostrarse en el campo correspondiente y MUST conservar los
  datos del formulario cuando sea posible.
- **FR-012**: La edición MUST estar disponible solo para el autor y MUST cargar los valores actuales
  del anuncio.
- **FR-013**: La edición MUST enviar solo los campos modificados y MUST NOT enviar una operación si no
  hay cambios ni imagen nueva.
- **FR-014**: La imagen actual MUST mostrarse y MUST poder sustituirse por otra; MUST NOT permitirse
  eliminarla sin subir una nueva.
- **FR-015**: La edición correcta MUST actualizar el detalle y el listado y MUST mostrar una
  confirmación.
- **FR-016**: La edición MUST gestionar errores de validación, permisos, anuncio no encontrado,
  sesión inválida y conexión.
- **FR-017**: Cancelar una edición MUST descartar los cambios, restaurar los valores originales y MUST
  NOT realizar ninguna operación de escritura.
- **FR-018**: Si hay cambios sin guardar, cancelar MUST solicitar confirmación; si no los hay, MUST
  permitir salir sin confirmación adicional.
- **FR-019**: La eliminación MUST estar disponible solo para el autor y MUST solicitar confirmación
  identificando el anuncio.
- **FR-020**: Cancelar la eliminación MUST NOT eliminar el anuncio ni alterar el listado.
- **FR-021**: La eliminación correcta MUST retirar el anuncio del detalle y del listado, mostrar una
  confirmación y llevar al listado.
- **FR-022**: Un fallo de conexión durante la eliminación MUST mantener el anuncio visible y MUST
  permitir reintentar.
- **FR-023**: El cambio de estado MUST estar disponible solo para el autor y MUST permitir pasar de
  disponible a vendido y de vendido a disponible.
- **FR-024**: Marcar un anuncio como vendido MUST solicitar confirmación.
- **FR-025**: El cambio de estado correcto MUST actualizar el detalle y el listado; un anuncio vendido
  MUST desaparecer del listado por defecto y MUST seguir accesible por su detalle directo.
- **FR-026**: Un anuncio que vuelve a disponible MUST reaparecer en el listado por defecto.
- **FR-027**: Las acciones de gestión MUST ocultarse o deshabilitarse para los usuarios que no sean
  el autor, sin sustituir la comprobación del sistema.
- **FR-028**: Después de crear, editar, eliminar o cambiar el estado, los datos afectados MUST
  actualizarse sin recargar manualmente la página.
- **FR-029**: Los formularios MUST usar etiquetas asociadas, mensajes de error accesibles, navegación
  por teclado y foco visible.
- **FR-030**: Los formularios y confirmaciones MUST ser utilizables en una pantalla de 360 píxeles de
  ancho sin desplazamiento horizontal no intencionado.
- **FR-031**: Los mensajes visibles MUST estar en español y MUST NOT exponer detalles técnicos
  internos.
- **FR-032**: Las operaciones correctas MUST proporcionar una confirmación perceptible y las
  operaciones fallidas MUST ofrecer una explicación comprensible.
- **FR-033**: Esta feature MUST NOT incluir favoritos, perfil, mensajería ni valoraciones.
- **FR-034**: Esta feature MUST NOT modificar el backend ni sustituir sus respuestas por datos
  simulados.
- **FR-035**: Las acciones de editar, eliminar y cambiar estado MUST ofrecerse únicamente desde el
  detalle del anuncio; la lista de anuncios propios MUST limitarse a mostrar los anuncios y abrir su
  detalle.
- **FR-036**: La creación de un anuncio MUST iniciarse desde la acción principal de la cabecera. La
  llamada contextual del estado vacío de “Mis anuncios” MUST abrir esta misma ruta y se implementa
  en la spec 006.

### Key Entities *(include if feature involves data)*

- **Anuncio**: publicación con título, descripción, precio, categoría, imagen, estado y autor.
- **Formulario de anuncio**: datos introducidos por el usuario, valores originales y estado de
  cambios sin guardar.
- **Estado del anuncio**: situación del anuncio, disponible o vendido.
- **Imagen del anuncio**: archivo opcional que puede añadirse al crear o sustituirse al editar.
- **Confirmación de acción destructiva**: decisión explícita del usuario antes de eliminar o marcar
  como vendido.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100 % de las creaciones válidas abre el detalle del anuncio y lo incorpora al
  listado sin recargar manualmente la página.
- **SC-002**: El 100 % de las creaciones inválidas muestra los errores correspondientes y no crea el
  anuncio.
- **SC-003**: El 100 % de las imágenes con formato o tamaño no admitido muestra un error
  comprensible y no crea ni actualiza el anuncio.
- **SC-004**: El 100 % de las ediciones válidas actualiza el detalle y el listado y muestra una
  confirmación.
- **SC-005**: El 100 % de las ediciones sin cambios no realiza ninguna operación de actualización.
- **SC-006**: El 100 % de las cancelaciones de edición descarta los cambios y conserva los datos
  anteriores del anuncio.
- **SC-007**: El 100 % de las eliminaciones confirmadas retira el anuncio del detalle y del listado;
  el 100 % de las cancelaciones mantiene el anuncio.
- **SC-008**: El 100 % de los cambios de estado actualiza el detalle y el listado; los anuncios
  vendidos desaparecen del listado por defecto y siguen accesibles por su detalle directo.
- **SC-009**: El 100 % de las acciones de gestión sobre anuncios ajenos se oculta o se rechaza.
- **SC-010**: El 100 % de las operaciones correctas muestra una confirmación perceptible.
- **SC-011**: El 100 % de los formularios de gestión puede completarse solo con teclado, con
  etiquetas y errores accesibles.
- **SC-012**: El 100 % de los formularios y confirmaciones se usa sin desplazamiento horizontal no
  intencionado en una pantalla de 360 píxeles de ancho.
- **SC-013**: El 100 % de los mensajes de error visibles está en español y no expone detalles
  técnicos internos.
- **SC-014**: Un usuario puede publicar un anuncio completo en menos de 2 minutos y editarlo en
  menos de 1 minuto en una prueba manual con los datos de ejemplo.
- **SC-015**: El 100 % de los envíos en curso impide una segunda operación duplicada.
- **SC-016**: Esta feature no modifica el backend ni introduce respuestas simuladas para las
  operaciones de gestión.
- **SC-017**: El 100 % de las acciones de edición, eliminación y cambio de estado se ofrece únicamente
  desde el detalle; la lista de anuncios propios solo permite abrir el detalle.
- **SC-018**: El 100 % de los usuarios autenticados puede iniciar la creación desde la cabecera. La
  acción del estado vacío de “Mis anuncios” se valida en la spec 006 mediante SC-020.

## Assumptions

- La estructura común, las rutas y los estados de interfaz se apoyan en la spec 001.
- La sesión y la identificación del usuario se apoyan en la spec 002.
- El listado, el detalle y el catálogo de categorías se apoyan en la spec 003.
- El backend existente ofrece creación, edición, eliminación y cambio de estado; no se modifica en
  esta feature.
- Solo el autor puede editar, eliminar o cambiar el estado de un anuncio; el sistema lo comprueba
  independientemente de la interfaz.
- Las acciones de editar, eliminar y cambiar estado se realizan únicamente desde el detalle; la lista
  de anuncios propios solo abre el detalle.
- La creación se inicia desde la acción principal de la cabecera. La llamada contextual del estado
  vacío de “Mis anuncios” pertenece a la spec 006 y reutiliza esta ruta.
- Las categorías se obtienen del catálogo real y no se codifican en el formulario.
- La imagen es opcional y única; puede sustituirse, pero no eliminarse sin subir otra.
- El cambio de estado se realiza mediante una acción separada de la edición de datos.
- La eliminación es definitiva y no existe papelera ni restauración.
- La moneda de presentación es el euro y el formato es español; el plan confirmará el detalle.
- Los formularios no guardan borradores ni realizan autoguardado.
- No se admite texto enriquecido ni edición por bloques.
- No se incluyen acciones masivas ni administración de anuncios de otros usuarios.
- No se incluye actualización en tiempo real; las vistas se actualizan al completar la operación.
- Los datos de ejemplo del sistema permiten probar creación, edición, eliminación y cambio de
  estado.

## Out of Scope

- Listado y detalle base del catálogo.
- Favoritos, perfil, mensajería y valoraciones.
- Subida de varias imágenes y eliminación de la imagen sin sustituirla.
- Borradores, autoguardado y edición colaborativa.
- Texto enriquecido o edición por bloques.
- Acciones masivas sobre anuncios.
- Acciones directas de gestión en listas de anuncios.
- Acciones de creación en cada tarjeta del listado general.
- Historial de cambios de estado y programación automática de la venta.
- Papelera, restauración y borrado lógico.
- Moderación o administración de anuncios ajenos.
- Pagos, envíos y logística.
- Actualización en tiempo real.
- Modificaciones del backend, del esquema o de los contratos del servicio existente.
