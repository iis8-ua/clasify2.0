# Feature Specification: Frontend alternativo con React

**Feature Branch**: `010-frontend-alterno-react`

**Created**: 2026-11-16

**Status**: Draft

**Input**: User description: "Implementar en un proyecto separado un frontend alternativo con React que use el mismo backend y la autenticación para listar y eliminar anuncios, sin repetir el resto del frontend ni modificar el backend."

## Clarifications

### Session 2026-11-16

- Q: ¿Qué framework se usa? → A: React con Vite y JavaScript.
- Q: ¿Qué alcance tiene el frontend alternativo? → A: Listado paginado y borrado del recurso principal, con la autenticación necesaria para borrar.
- Q: ¿Dónde vive el proyecto? → A: En un proyecto separado dentro del repositorio, en `frontend-react/`.
- Q: ¿Se modifica el backend? → A: No; se reutilizan los endpoints existentes.
- Q: ¿Se reutilizan los servicios del frontend Vue? → A: Sí; la capa de servicios independiente del framework se comparte entre ambos frontends.
- Q: ¿El listado requiere sesión? → A: No; el listado es público, como en el frontend principal.
- Q: ¿Qué operaciones requieren sesión? → A: El borrado de anuncios y la identificación del anuncio propio.
- Q: ¿Se implementa router? → A: No; el alcance se resuelve en una única vista.
- Q: ¿Se reimplementan crear, editar, detalle, favoritos, perfil o mensajería? → A: No; quedan fuera del alcance.
- Q: ¿Qué paginación se usa? → A: Fija de 20 elementos por página.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consultar el listado de anuncios (Priority: P1)

Como visitante, quiero ver los anuncios publicados y recorrer sus páginas, para comprobar que el
frontend alternativo consume el mismo backend que la aplicación principal.

**Why this priority**: el listado es la base del apartado adicional. Sin él no hay recurso principal
que mostrar ni anuncio que eliminar.

**Independent Test**: se puede comprobar abriendo el proyecto React con el backend arrancado y
verificando que aparecen anuncios reales, que se puede cambiar de página y que se distinguen los
estados de carga, vacío y error.

**Acceptance Scenarios**:

1. **Given** el backend arrancado con anuncios disponibles, **When** el usuario abre el frontend
   React, **Then** ve un listado con título, precio, categoría, estado, fecha e imagen o marcador.
2. **Given** un listado con más de 20 anuncios, **When** el usuario avanza o retrocede, **Then**
   accede a las páginas disponibles sin omitir ni repetir elementos.
3. **Given** el listado cargándose, **When** el usuario consulta la vista, **Then** ve un estado de
   carga identificable.
4. **Given** un listado sin anuncios, **When** la carga termina, **Then** ve un estado vacío
   específico y no un error.
5. **Given** un fallo de conexión o del backend, **When** la carga falla, **Then** ve un mensaje
   comprensible y puede reintentar.
6. **Given** una página solicitada fuera de rango, **When** la respuesta indica menos páginas,
   **Then** la interfaz corrige la página a la última disponible.
7. **Given** un visitante sin sesión, **When** abre el frontend React, **Then** puede consultar el
   listado público.

---

### User Story 2 - Iniciar y cerrar sesión (Priority: P1)

Como usuario, quiero iniciar sesión con mi cuenta de prueba y cerrar sesión, para poder eliminar mis
anuncios y comprobar que la interfaz deja de mostrar información privada.

**Why this priority**: el borrado requiere autenticación y la identificación del autor. Sin sesión no
se puede completar la operación principal del apartado adicional.

**Independent Test**: se puede comprobar iniciando sesión con un usuario del seed, recargando la
página para recuperar la sesión y cerrando sesión después.

**Acceptance Scenarios**:

1. **Given** un usuario con credenciales válidas, **When** envía el formulario de acceso, **Then**
   la sesión se inicia y la interfaz muestra el nombre del usuario autenticado.
2. **Given** credenciales incorrectas, **When** el usuario intenta acceder, **Then** ve un mensaje
   comprensible y no se muestra información privada.
3. **Given** una sesión válida guardada en la pestaña, **When** el usuario recarga la página,
   **Then** la sesión se recupera y se mantiene la identificación del usuario.
4. **Given** una sesión iniciada, **When** el usuario cierra sesión, **Then** se elimina el token y
   desaparecen las acciones privadas.
5. **Given** una sesión caducada o inválida, **When** el backend responde con un error de sesión,
   **Then** la interfaz limpia la sesión y solicita acceso de nuevo.

---

### User Story 3 - Eliminar un anuncio propio (Priority: P1)

Como usuario autenticado, quiero eliminar un anuncio de mi propiedad con confirmación, para gestionar
el recurso principal desde el frontend alternativo sin borrados accidentales.

**Why this priority**: el borrado es la segunda operación exigida por el apartado adicional y la que
demuestra que la autenticación y los permisos funcionan con otro framework.

**Independent Test**: se puede comprobar iniciando sesión con un usuario del seed, localizando un
anuncio propio, cancelando una vez el borrado y confirmándolo después.

**Acceptance Scenarios**:

1. **Given** un anuncio propio en el listado, **When** el usuario autenticado lo consulta, **Then**
   ve la acción de eliminar.
2. **Given** un anuncio ajeno o una sesión no iniciada, **When** el usuario consulta el listado,
   **Then** no ve la acción de eliminar.
3. **Given** una solicitud de borrado, **When** el usuario la inicia, **Then** se pide confirmación
   antes de llamar al backend.
4. **Given** la confirmación, **When** el borrado termina correctamente, **Then** el anuncio
   desaparece del listado sin recargar manualmente la página.
5. **Given** la cancelación, **When** el usuario cancela, **Then** el anuncio sigue visible y no se
   realiza ninguna petición de borrado.
6. **Given** el último anuncio de una página, **When** se elimina, **Then** la interfaz ajusta la
   página y muestra resultados coherentes.
7. **Given** un anuncio que ya no existe, **When** el backend responde que no se encuentra, **Then**
   la interfaz converge a un estado sin ese anuncio sin mostrar un error incomprensible.
8. **Given** un anuncio ajeno, **When** el backend rechaza el borrado por permisos, **Then** la
   interfaz muestra un mensaje comprensible y no elimina el anuncio.
9. **Given** un borrado en curso, **When** el usuario intenta confirmar de nuevo, **Then** la acción
   está deshabilitada y no se procesa dos veces.
10. **Given** un fallo de conexión durante el borrado, **When** la operación no se completa, **Then**
    el anuncio sigue visible y el usuario puede reintentar.

---

### User Story 4 - Usar el frontend alternativo con teclado o en móvil (Priority: P3)

Como usuario, quiero usar el listado, el acceso y la confirmación de borrado con teclado o en una
pantalla pequeña, para que el proyecto alternativo mantenga la accesibilidad del frontend principal.

**Why this priority**: el apartado adicional debe demostrar una implementación funcional, no una
maqueta que solo funciona con ratón o en escritorio.

**Independent Test**: se puede comprobar recorriendo acceso, listado, paginación y confirmación solo
con teclado y en una pantalla de 360 píxeles de ancho.

**Acceptance Scenarios**:

1. **Given** el formulario de acceso, **When** el usuario navega solo con teclado, **Then** puede
   acceder a todos los campos y acciones con foco visible.
2. **Given** el listado y la paginación, **When** el usuario navega con teclado, **Then** puede
   recorrer los anuncios, cambiar de página y activar las acciones disponibles.
3. **Given** una confirmación de borrado, **When** el usuario la revisa con un lector de pantalla,
   **Then** entiende qué anuncio se va a eliminar y puede confirmar o cancelar.
4. **Given** una pantalla de 360 píxeles de ancho, **When** el usuario recorre la interfaz, **Then**
   no aparece desplazamiento horizontal no intencionado.
5. **Given** cualquier mensaje visible, **When** el usuario lo lee, **Then** está en español y no
   expone detalles técnicos internos.

### Edge Cases

- El backend no está arrancado o no responde.
- El listado no tiene anuncios.
- La página solicitada supera el total de páginas.
- El usuario elimina el último anuncio de la página actual.
- El anuncio desaparece entre la carga del listado y el intento de borrado.
- El usuario intenta borrar un anuncio ajeno.
- La sesión caduca durante la carga, el acceso o el borrado.
- El usuario envía el formulario de acceso dos veces.
- El usuario confirma el borrado dos veces.
- El usuario cancela el borrado.
- El listado contiene anuncios sin imagen.
- El título o el precio son largos.
- La interfaz se usa en una pantalla estrecha o con teclado.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El proyecto alternativo MUST ser un proyecto React separado dentro del repositorio,
  con su propio `package.json`, configuración y punto de entrada.
- **FR-002**: El proyecto MUST usar el mismo backend y la misma autenticación que el frontend
  principal, sin modificar el backend, el esquema ni los contratos de la API.
- **FR-003**: El acceso al backend MUST realizarse mediante una capa de servicios independiente del
  framework, reutilizada por el frontend Vue y el frontend React.
- **FR-004**: Los componentes React MUST NOT realizar llamadas HTTP directas.
- **FR-005**: El listado MUST ser público y MUST mostrar 20 anuncios por página.
- **FR-006**: El listado MUST permitir recorrer todas las páginas disponibles mediante controles de
  paginación.
- **FR-007**: Cada anuncio MUST mostrar al menos título, precio, categoría, estado, fecha e imagen o
  marcador de ausencia.
- **FR-008**: El listado MUST distinguir entre carga, resultados, vacío y error.
- **FR-009**: Un error de carga MUST mostrar un mensaje comprensible y una acción de reintento.
- **FR-010**: Una página fuera de rango MUST corregirse a la última página disponible.
- **FR-011**: El usuario MUST poder iniciar sesión con las credenciales admitidas por el backend.
- **FR-012**: La sesión MUST conservarse en `sessionStorage` y recuperarse al recargar la página.
- **FR-013**: El cierre de sesión MUST eliminar el token y dejar de mostrar acciones privadas.
- **FR-014**: Un error de sesión MUST limpiar la sesión y solicitar acceso de nuevo.
- **FR-015**: La acción de eliminar MUST mostrarse solo en anuncios cuyo autor sea el usuario
  autenticado.
- **FR-016**: El backend MUST seguir siendo la autoridad final sobre los permisos de borrado.
- **FR-017**: El borrado MUST solicitar confirmación y MUST permitir cancelar sin modificar datos.
- **FR-018**: Tras un borrado correcto, el listado MUST actualizarse sin recargar manualmente la
  página.
- **FR-019**: Si el borrado deja vacía la página actual, la interfaz MUST ajustar la página.
- **FR-020**: Un borrado en curso MUST evitar envíos duplicados.
- **FR-021**: Los errores de permisos, recurso inexistente y conexión MUST mostrarse con mensajes
  comprensibles.
- **FR-022**: La interfaz MUST ser usable con teclado, con foco visible y nombres accesibles.
- **FR-023**: Las confirmaciones MUST anunciar el anuncio afectado y permitir confirmar o cancelar.
- **FR-024**: La interfaz MUST ser usable sin desplazamiento horizontal no intencionado en 360
  píxeles de ancho.
- **FR-025**: Los textos visibles MUST estar en español y MUST NOT exponer detalles técnicos
  internos.
- **FR-026**: El proyecto MUST documentar cómo arrancarlo, cómo ejecutar sus pruebas y las
  diferencias de componentes y gestión del estado respecto a Vue.
- **FR-027**: La implementación MUST incluir pruebas automatizadas de listado, sesión, borrado,
  errores y permisos.
- **FR-028**: La feature MUST NOT duplicar las funcionalidades de crear, editar, detalle, favoritos,
  perfil, mensajería o valoraciones.

### Key Entities *(include if feature involves data)*

- **Anuncio**: recurso principal mostrado en el listado, con identificador, título, precio,
  categoría, estado, fecha, imagen e identificador del autor.
- **Página de anuncios**: conjunto de hasta 20 anuncios con página actual, total y total de páginas.
- **Sesión**: token, usuario autenticado y estado de acceso, conservados en la pestaña.
- **Confirmación de borrado**: estado temporal que identifica el anuncio que se va a eliminar y
  permite confirmar o cancelar.

## Success Criteria *(mandatory)*

- **SC-001**: El 100 % de las cargas correctas del listado muestra como máximo 20 anuncios por
  página y permite recorrer todas las páginas disponibles.
- **SC-002**: El 100 % de los listados vacíos se distingue de un error de carga.
- **SC-003**: El 100 % de los errores de carga muestra un mensaje comprensible y una acción de
  reintento.
- **SC-004**: El 100 % de los inicios de sesión válidos identifica al usuario autenticado y el 100 %
  de los inválidos no muestra información privada.
- **SC-005**: El 100 % de los cierres de sesión elimina el token y las acciones privadas de la
  interfaz.
- **SC-006**: El 100 % de los anuncios ajenos o visitantes sin sesión oculta la acción de eliminar.
- **SC-007**: El 100 % de los borrados solicita confirmación y el 100 % de las cancelaciones no
  modifica datos.
- **SC-008**: El 100 % de los borrados correctos actualiza el listado y corrige la página si queda
  vacía.
- **SC-009**: El 100 % de los rechazos por permisos, recurso inexistente o conexión muestra un
  mensaje comprensible.
- **SC-010**: El 100 % del formulario, el listado, la paginación y la confirmación puede usarse solo
  con teclado, con foco visible y nombres accesibles.
- **SC-011**: La interfaz se usa sin desplazamiento horizontal no intencionado en una pantalla de
  360 píxeles de ancho.
- **SC-012**: El 100 % de los textos visibles está en español y no revela detalles técnicos internos.
- **SC-013**: Las pruebas automatizadas del proyecto React y del frontend Vue terminan sin fallos.
- **SC-014**: El build de producción del proyecto React termina correctamente.
- **SC-015**: Esta feature no modifica el backend, el esquema ni los contratos existentes.
- **SC-016**: El README del proyecto React explica cómo ejecutarlo y las diferencias de componentes
  y gestión del estado respecto a Vue.

## Assumptions

- El proyecto usa React con Vite y JavaScript, sin TypeScript.
- El acceso al backend se hace con `fetch`, sin axios.
- El listado es público; la sesión solo es necesaria para identificar anuncios propios y borrarlos.
- La paginación es fija de 20 elementos por página, coherente con el frontend principal.
- El proyecto React no usa router ni biblioteca de componentes; su alcance se resuelve en una única
  vista.
- La capa de servicios independiente del framework se extrae a una ubicación compartida y ambos
  frontends la consumen.
- La extracción de servicios no cambia el comportamiento ni las pruebas del frontend Vue.
- Los usuarios de prueba son los del seed del backend: `ana@example.com` y `carlos@example.com`, con
  la contraseña `Clasify123!`.
- El backend existente ofrece listado, login, recuperación de sesión y borrado de anuncios.
- El backend sigue comprobando permisos aunque la interfaz oculte la acción de borrar.
- El frontend React puede ejecutarse en el puerto permitido por CORS; si se usa otro puerto, se
  ajusta `FRONTEND_ORIGIN` en el entorno local.
- La documentación de esta iteración se limita al proyecto alternativo y no duplica la documentación
  general de las specs 001–009.

## Out of Scope

- Crear anuncios desde React.
- Editar anuncios desde React.
- Ver el detalle de un anuncio en React.
- Favoritos, perfil, mensajería y valoraciones en React.
- Búsqueda, filtros avanzados u ordenación distinta de la paginación básica.
- Gestión de imágenes o subida de archivos.
- Router y rutas profundas.
- Biblioteca de componentes para React.
- Tema claro/oscuro.
- Notificaciones, tiempo real o sincronización entre pestañas.
- Pruebas de navegador interactivo.
- Cambios en el backend, en el esquema o en los contratos existentes.
