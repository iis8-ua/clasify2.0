# Feature Specification: Valoraciones

**Feature Branch**: `009-valoraciones`

**Created**: 2026-11-11

**Status**: Draft

**Input**: User description: "Añadir la gestión de valoraciones entre usuarios al frontend de Clasify usando los endpoints existentes del backend, sin modificarlo."

## Clarifications

### Session 2026-11-11

- Q: ¿Dónde se crea o edita una valoración? → A: Solo en el perfil público de otro usuario.
- Q: ¿Qué datos solicita una valoración? → A: Puntuación obligatoria de 1 a 5 y comentario opcional de hasta 500 caracteres.
- Q: ¿Quién puede valorar? → A: Cualquier usuario autenticado puede valorar a otro; nunca a sí mismo.
- Q: ¿Se puede cambiar una valoración ya escrita? → A: Sí; guardar de nuevo actualiza la valoración existente.
- Q: ¿Se puede eliminar? → A: Sí, con confirmación desde el perfil público y desde el perfil propio.
- Q: ¿Qué muestra `/perfil`? → A: Resumen, valoraciones recibidas y valoraciones escritas, con edición y borrado de las escritas.
- Q: ¿Qué ocurre si un visitante intenta valorar? → A: Se le pide acceso y vuelve al perfil público.
- Q: ¿Qué tamaño de página usan los listados? → A: 20 por defecto, con selector de 10, 20 o 50.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Valorar a otro usuario (Priority: P1)

Como usuario autenticado, quiero valorar a otro usuario desde su perfil público, para aportar
información sobre mi experiencia y ayudar a otras personas.

**Why this priority**: crear una valoración es la acción principal de la feature. Sin ella, el
listado y el resumen no tendrían nuevos datos.

**Independent Test**: se puede comprobar abriendo el perfil público de otro usuario, enviando una
puntuación y un comentario, y verificando que la valoración aparece y que el resumen se actualiza.

**Acceptance Scenarios**:

1. **Given** un usuario autenticado en el perfil público de otro usuario, **When** consulta la acción
   de valorar, **Then** ve el formulario con puntuación y comentario.
2. **Given** una puntuación válida y un comentario opcional, **When** el usuario guarda, **Then** la
   valoración se crea, aparece en el perfil y se muestra una confirmación.
3. **Given** una valoración ya existente del usuario, **When** abre el formulario, **Then** ve sus
   valores actuales precargados.
4. **Given** una valoración ya existente, **When** el usuario cambia la puntuación o el comentario y
   guarda, **Then** la valoración se actualiza sin crear duplicados.
5. **Given** una puntuación vacía, no entera o fuera de 1 a 5, **When** el usuario intenta guardar,
   **Then** ve un error asociado al campo y no se envía.
6. **Given** un comentario de más de 500 caracteres, **When** el usuario intenta guardar, **Then** ve
   un error asociado al campo y no se envía.
7. **Given** un envío en curso, **When** el usuario intenta guardar de nuevo, **Then** la acción está
   deshabilitada y no se procesa dos veces.
8. **Given** un fallo de conexión, **When** la valoración no se guarda, **Then** el usuario ve un
   mensaje comprensible y conserva los datos introducidos.
9. **Given** que la sesión deja de ser válida, **When** el usuario intenta guardar, **Then** se le
   solicita acceso de nuevo.
10. **Given** un visitante en el perfil público de otro usuario, **When** intenta valorar, **Then** se
    le solicita acceso y vuelve al perfil tras autenticarse.
11. **Given** el perfil público propio, **When** el usuario consulta las acciones, **Then** no se
    ofrece valorarse a sí mismo.

---

### User Story 2 - Eliminar mi valoración (Priority: P2)

Como usuario autenticado, quiero eliminar una valoración que he escrito, para corregir o retirar mi
opinión.

**Why this priority**: la actualización cubre cambios, pero el usuario también debe poder retirar una
valoración sin depender de un administrador.

**Independent Test**: se puede comprobar eliminando una valoración propia desde el perfil público o
desde `/perfil` y verificando que desaparece y que el resumen se actualiza.

**Acceptance Scenarios**:

1. **Given** una valoración propia existente, **When** el usuario solicita eliminarla, **Then** se
   pide confirmación.
2. **Given** la confirmación de eliminación, **When** la operación termina, **Then** la valoración
   desaparece del listado y se muestra una confirmación.
3. **Given** la cancelación de la eliminación, **When** el usuario cancela, **Then** la valoración
   sigue visible y no se modifica.
4. **Given** un fallo de conexión al eliminar, **When** la operación no se completa, **Then** la
   valoración sigue visible y el usuario ve un mensaje comprensible.
5. **Given** una valoración que ya no existe, **When** el usuario intenta eliminarla, **Then** la
   interfaz converge a un estado sin valoración sin mostrar un error incomprensible.

---

### User Story 3 - Consultar mis valoraciones (Priority: P2)

Como usuario autenticado, quiero consultar las valoraciones que he recibido y las que he escrito,
para conocer mi reputación y gestionar lo que he publicado sobre otros.

**Why this priority**: el perfil propio ya muestra el resumen; los listados completan la información y
permiten gestionar las valoraciones escritas.

**Independent Test**: se puede comprobar abriendo `/perfil` con valoraciones recibidas y escritas y
verificando que ambas listas aparecen y que las escritas se pueden editar o eliminar.

**Acceptance Scenarios**:

1. **Given** un usuario con valoraciones recibidas, **When** abre `/perfil`, **Then** ve el listado de
   valoraciones recibidas con autor, puntuación, comentario y fecha.
2. **Given** un usuario con valoraciones escritas, **When** abre `/perfil`, **Then** ve el listado de
   valoraciones escritas con destinatario, puntuación, comentario y fecha.
3. **Given** una valoración escrita, **When** el usuario selecciona editar, **Then** se abre el perfil
   público del destinatario con el formulario precargado.
4. **Given** una valoración escrita, **When** el usuario selecciona eliminar, **Then** se pide
   confirmación y se aplica el resultado.
5. **Given** un usuario sin valoraciones recibidas o escritas, **When** consulta el perfil, **Then**
   cada listado muestra un estado vacío específico.
6. **Given** una lista con varias páginas, **When** el usuario avanza o retrocede, **Then** accede a
   todas las valoraciones sin omitir ni repetir elementos.
7. **Given** un listado de valoraciones, **When** el usuario cambia el tamaño de página entre 10, 20 y
   50, **Then** el listado se actualiza y vuelve a la primera página.
8. **Given** un fallo de carga, **When** el usuario recibe el error, **Then** puede reintentar.

---

### User Story 4 - Gestionar valoraciones con teclado o en móvil (Priority: P3)

Como usuario, quiero consultar y gestionar valoraciones con teclado o en una pantalla pequeña, para
poder hacerlo sin depender del ratón ni de un dispositivo grande.

**Why this priority**: las valoraciones contienen formularios y acciones de eliminación que deben
mantener la accesibilidad del resto de la aplicación.

**Independent Test**: se puede comprobar recorriendo formulario, listados y confirmaciones solo con
teclado y en una pantalla de 360 píxeles de ancho.

**Acceptance Scenarios**:

1. **Given** el formulario de valoración, **When** el usuario navega solo con teclado, **Then** puede
   acceder a puntuación, comentario, guardar y eliminar, y el foco es visible.
2. **Given** un error de valoración, **When** el usuario lo revisa con un lector de pantalla, **Then**
   está asociado al campo y se anuncia de forma comprensible.
3. **Given** una confirmación de eliminación, **When** el usuario la recorre con teclado, **Then**
   puede confirmar o cancelar y el foco vuelve al origen.
4. **Given** una pantalla de 360 píxeles de ancho, **When** el usuario recorre el formulario y los
   listados, **Then** no aparece desplazamiento horizontal no intencionado.
5. **Given** un mensaje visible de la feature, **When** el usuario lo lee, **Then** está en español y
   no contiene detalles técnicos internos.

### Edge Cases

- El usuario intenta valorarse a sí mismo.
- El usuario intenta valorar sin sesión.
- El usuario valora a un usuario que ya no existe.
- El usuario abre una valoración que ya no existe.
- El usuario elimina una valoración que ya no existe.
- El usuario intenta guardar una puntuación vacía, decimal o fuera de 1 a 5.
- El comentario está vacío o supera los 500 caracteres.
- El usuario envía el formulario dos veces por una pulsación repetida.
- La sesión caduca durante el guardado o la eliminación.
- La lista de valoraciones recibidas está vacía.
- La lista de valoraciones escritas está vacía.
- La página solicitada supera el total.
- La carga del perfil o de las valoraciones falla por conexión.
- El autor de una valoración ya no está disponible.
- El usuario navega con teclado o lector de pantalla.
- La pantalla es muy estrecha.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Crear, actualizar y eliminar valoraciones MUST requerir una sesión válida.
- **FR-002**: El formulario de valoración MUST estar disponible en el perfil público de otro usuario
  y MUST NOT aparecer en el perfil propio.
- **FR-003**: Un usuario MUST NOT poder valorarse a sí mismo.
- **FR-004**: Cualquier usuario autenticado MUST poder valorar a cualquier otro usuario.
- **FR-005**: La puntuación MUST ser obligatoria, entera y estar entre 1 y 5.
- **FR-006**: El comentario MUST ser opcional y MUST NOT superar 500 caracteres.
- **FR-007**: Guardar la valoración de un usuario ya valorado MUST actualizarla sin crear duplicados.
- **FR-008**: El formulario MUST precargar la valoración existente del usuario cuando la haya.
- **FR-009**: Una valoración correcta MUST mostrar una confirmación perceptible y reflejarse en los
  listados y en el resumen.
- **FR-010**: Un envío en curso MUST mostrar carga y MUST impedir envíos duplicados.
- **FR-011**: Los errores de validación MUST mostrarse en el campo correspondiente.
- **FR-012**: Un fallo de conexión MUST mostrar un mensaje comprensible y MUST conservar los datos
  introducidos.
- **FR-013**: El usuario MUST poder eliminar su valoración con confirmación explícita.
- **FR-014**: Cancelar la eliminación MUST NOT modificar la valoración.
- **FR-015**: Una eliminación correcta MUST retirar la valoración de los listados y actualizar el
  resumen.
- **FR-016**: Eliminar una valoración que ya no existe MUST dejar la interfaz en un estado sin
  valoración sin un error incomprensible.
- **FR-017**: `/perfil` MUST mostrar el listado de valoraciones recibidas con autor, puntuación,
  comentario y fecha.
- **FR-018**: `/perfil` MUST mostrar el listado de valoraciones escritas con destinatario, puntuación,
  comentario y fecha.
- **FR-019**: Una valoración escrita MUST poder editarse desde `/perfil` abriendo el perfil público del
  destinatario con el formulario precargado.
- **FR-020**: Una valoración escrita MUST poder eliminarse desde `/perfil` con confirmación.
- **FR-021**: Los listados de valoraciones recibidas y escritas MUST distinguir carga, resultados,
  vacío y error, y MUST ofrecer reintento cuando falle.
- **FR-022**: Los listados de valoraciones MUST paginarse y MUST mostrar la página actual y el total.
- **FR-023**: Los listados de valoraciones MUST usar 20 elementos por página por defecto y MUST
  permitir elegir entre 10, 20 y 50.
- **FR-024**: El tamaño de página y la página actual MUST conservarse en la dirección para permitir
  recargar o compartir la vista.
- **FR-025**: Cambiar el tamaño de página MUST volver a la primera página.
- **FR-026**: Si la página solicitada supera el total, la aplicación MUST mostrar la última página
  disponible.
- **FR-027**: Una valoración MUST enlazar al perfil público de su autor.
- **FR-028**: Un visitante que intenta valorar MUST ser invitado a acceder y, tras autenticarse, MUST
  volver al perfil público.
- **FR-029**: Un fallo de sesión MUST solicitar un nuevo acceso y MUST NOT dejar datos privados
  obsoletos visibles.
- **FR-030**: El formulario, los listados y las confirmaciones MUST ser utilizables con teclado, con
  foco visible y en una pantalla de 360 píxeles de ancho.
- **FR-031**: Los mensajes visibles MUST estar en español y MUST NOT exponer detalles técnicos
  internos.
- **FR-032**: Esta feature MUST NOT incluir moderación, respuestas a valoraciones, votos de utilidad,
  valoraciones anónimas ni ordenación personalizada.
- **FR-033**: Esta feature MUST NOT modificar el backend ni sustituir sus respuestas por datos
  simulados.

### Key Entities *(include if feature involves data)*

- **Valoración**: relación entre un usuario que valora y otro valorado, con puntuación, comentario y
  fecha.
- **Valoración recibida**: valoración con autor, puntuación, comentario y fecha.
- **Valoración escrita**: valoración con destinatario, puntuación, comentario y fecha.
- **Resumen de valoraciones**: media y número de valoraciones recibidas.
- **Página de valoraciones**: conjunto de valoraciones de una página, con página actual, tamaño, total
  y total de páginas.

## Success Criteria *(mandatory)*

- **SC-001**: El 100 % de los usuarios autenticados puede crear una valoración válida y ve su
  confirmación y su aparición en el perfil.
- **SC-002**: El 100 % de las valoraciones ya existentes se actualiza sin duplicados.
- **SC-003**: El 100 % de los intentos de valorarse a sí mismo se impide.
- **SC-004**: El 100 % de las puntuaciones vacías, no enteras o fuera de 1 a 5 se rechaza con un
  mensaje comprensible.
- **SC-005**: El 100 % de los comentarios de más de 500 caracteres se rechaza con un mensaje
  comprensible.
- **SC-006**: El 100 % de las valoraciones eliminadas con confirmación desaparece de los listados y
  actualiza el resumen.
- **SC-007**: El 100 % de las cancelaciones de eliminación mantiene la valoración sin cambios.
- **SC-008**: El 100 % de los perfiles propios muestra las valoraciones recibidas y escritas, con
  estados vacíos distintos de errores.
- **SC-009**: El 100 % de las valoraciones escritas permite editar o eliminar desde `/perfil`.
- **SC-010**: El 100 % de los listados de valoraciones permite elegir 10, 20 o 50 elementos por página
  y conserva página y tamaño en la dirección.
- **SC-011**: El 100 % de los errores de sesión durante una valoración solicita un nuevo acceso y no
  deja datos privados obsoletos.
- **SC-012**: El 100 % del formulario, los listados y las confirmaciones puede usarse solo con teclado,
  con foco visible y etiquetas accesibles.
- **SC-013**: El formulario y los listados se usan sin desplazamiento horizontal no intencionado en
  una pantalla de 360 píxeles de ancho.
- **SC-014**: El 100 % de los mensajes visibles está en español y no expone detalles técnicos
  internos.
- **SC-015**: Esta feature no modifica el backend ni introduce respuestas simuladas para las
  valoraciones.

## Assumptions

- La estructura común, las rutas, los estados y el tema se apoyan en la spec 001.
- La sesión y la identificación del usuario se apoyan en la spec 002.
- El perfil público y el listado de valoraciones recibidas se apoyan en la spec 008.
- El perfil propio se apoya en la spec 006.
- El backend existente permite consultar, crear, actualizar y eliminar valoraciones; no se modifica.
- La valoración se crea o actualiza mediante una única operación idempotente.
- El comentario es opcional; una valoración sin comentario es válida.
- El resumen de valoraciones lo calcula el backend y se refresca al recargar o actualizar los datos.
- El tamaño de página por defecto es 20 y se puede cambiar a 10 o 50.
- La interfaz se usa en escritorio y en móvil, con tema claro u oscuro según la preferencia de 001.

## Out of Scope

- Moderación de valoraciones.
- Respuestas a valoraciones.
- Votos de utilidad o reacciones.
- Valoraciones anónimas.
- Ordenación personalizada de valoraciones.
- Historial de cambios de una valoración.
- Notificaciones cuando se recibe una valoración.
- Perfil público editable, avatar o seguimiento.
- Pagos, envíos o logística.
- Modificaciones del backend, del esquema o de los contratos del servicio existente.
