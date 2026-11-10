# Feature Specification: Registro, acceso y sesión de usuario

**Feature Branch**: `002-autenticacion-sesion`

**Created**: 2026-11-10

**Status**: Draft

**Input**: User description: "Implementa la spec 002-autenticacion-sesion descrita en docs/00-contexto-specs.md. Lee también docs/01-registro.md, docs/02-login.md y docs/03-sesion.md. No modifiques el backend."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Crear una cuenta (Priority: P1)

Como visitante, quiero crear una cuenta con mi email, mi nombre y una contraseña, para poder
acceder a las acciones reservadas a usuarios autenticados.

**Why this priority**: sin registro no se pueden crear usuarios nuevos. Es la puerta de entrada
para usar la aplicación más allá de la consulta pública.

**Independent Test**: se puede comprobar abriendo el formulario de registro, creando una cuenta
válida y verificando que el usuario queda identificado y puede acceder a las acciones privadas. La
prueba puede aislarse del resto de funcionalidades.

**Acceptance Scenarios**:

1. **Given** un visitante en la pantalla de acceso, **When** selecciona la opción de registrarse,
   **Then** ve un formulario con email, nombre y contraseña.
2. **Given** un formulario de registro completo y válido, **When** el visitante lo envía, **Then**
   se crea la cuenta, se inicia la sesión y se le lleva al listado de anuncios.
3. **Given** un email ya registrado, **When** el visitante intenta registrarse, **Then** ve un
   mensaje comprensible asociado al campo de email y no se crea una segunda cuenta.
4. **Given** un formulario con datos inválidos, **When** el visitante intenta enviarlo, **Then** ve
   los errores correspondientes y no se crea la cuenta.
5. **Given** un envío en curso, **When** el visitante intenta enviar de nuevo, **Then** la acción
   está deshabilitada y no se crea una cuenta duplicada.
6. **Given** un fallo de conexión, **When** el registro no se completa, **Then** el visitante ve un
   mensaje comprensible y conserva el email introducido.

---

### User Story 2 - Iniciar sesión (Priority: P1)

Como visitante, quiero iniciar sesión con mi email y mi contraseña, para acceder a las acciones
reservadas a usuarios autenticados.

**Why this priority**: el acceso permite identificar al usuario y condiciona todas las operaciones
privadas. Sin él, el resto de funcionalidades protegidas no pueden utilizarse.

**Independent Test**: se puede comprobar desde la pantalla de acceso con un usuario válido y con
credenciales incorrectas, verificando la identificación, la redirección y los mensajes mostrados.

**Acceptance Scenarios**:

1. **Given** un visitante sin sesión, **When** abre la pantalla de acceso, **Then** ve un formulario
   con email y contraseña.
2. **Given** credenciales válidas, **When** el visitante las envía, **Then** se inicia la sesión, la
   interfaz refleja al usuario y se le lleva a la vista solicitada o al listado.
3. **Given** credenciales incorrectas, **When** el visitante las envía, **Then** ve un mensaje
   general que no revela si el email existe.
4. **Given** un formulario incompleto o con email inválido, **When** el visitante intenta enviarlo,
   **Then** ve el error correspondiente y no se inicia la sesión.
5. **Given** un envío en curso, **When** el visitante intenta enviar de nuevo, **Then** la acción
   está deshabilitada y no se procesa dos veces.
6. **Given** un fallo de conexión, **When** el acceso no se completa, **Then** el visitante ve un
   mensaje comprensible y conserva el email introducido.
7. **Given** un usuario que ya tiene sesión, **When** abre la pantalla de acceso o la de registro,
   **Then** se le redirige a una vista principal.

---

### User Story 3 - Mantener la sesión al recargar (Priority: P2)

Como usuario autenticado, quiero que mi sesión se recupere al recargar la aplicación, para no tener
que introducir mis credenciales constantemente.

**Why this priority**: la recarga es una acción habitual. Perder la sesión en cada recarga rompe la
continuidad y obliga a repetir el acceso sin necesidad.

**Independent Test**: se puede comprobar iniciando sesión, recargando la misma pestaña y verificando
que el usuario sigue identificado y que las acciones privadas siguen disponibles.

**Acceptance Scenarios**:

1. **Given** un usuario con una sesión válida, **When** recarga la aplicación en la misma pestaña,
   **Then** la sesión se restaura sin volver a introducir credenciales.
2. **Given** una sesión que se está comprobando, **When** la aplicación aún no ha terminado,
   **Then** se muestra un estado de carga y no se habilitan acciones privadas de forma prematura.
3. **Given** una sesión que ya no es válida, **When** el usuario recarga o intenta una operación
   privada, **Then** la sesión se descarta y se le solicita acceso de nuevo.
4. **Given** un usuario autenticado, **When** consulta la cabecera, **Then** ve su identidad y las
   acciones privadas disponibles.

---

### User Story 4 - Cerrar sesión y proteger la información privada (Priority: P2)

Como usuario autenticado, quiero cerrar sesión y eliminar mi información privada de la interfaz,
para dejar la aplicación en un estado seguro cuando termino.

**Why this priority**: el cierre de sesión evita que otra persona que use el mismo dispositivo vea
datos privados o realice acciones en nombre del usuario anterior.

**Independent Test**: se puede comprobar iniciando sesión, accediendo a una sección privada,
cerrando sesión y verificando que ya no se muestran datos privados ni acciones protegidas.

**Acceptance Scenarios**:

1. **Given** un usuario autenticado, **When** cierra sesión, **Then** la sesión se descarta y la
   interfaz vuelve a un estado público.
2. **Given** un cierre de sesión completado, **When** el usuario consulta la interfaz, **Then** no
   ve datos privados del usuario anterior.
3. **Given** un cierre de sesión completado, **When** el usuario intenta una acción protegida,
   **Then** se le solicita acceso de nuevo.
4. **Given** un cierre de sesión completado, **When** el usuario vuelve atrás en el navegador,
   **Then** no se muestran datos privados como si la sesión siguiera activa.

---

### User Story 5 - Recuperarse de una sesión caducada (Priority: P3)

Como usuario, quiero que la aplicación me avise cuando mi sesión ya no es válida, para volver a
acceder sin quedarme en una pantalla bloqueada o con datos obsoletos.

**Why this priority**: la sesión tiene una duración limitada. La aplicación debe reaccionar de forma
comprensible cuando deja de ser válida, sin mostrar información privada ni errores técnicos.

**Independent Test**: se puede comprobar invalidando una sesión y realizando una operación privada,
verificando que se solicita acceso y que no quedan datos privados visibles.

**Acceptance Scenarios**:

1. **Given** una sesión caducada o inválida, **When** el usuario intenta una operación privada,
   **Then** se le informa y se le solicita acceso de nuevo.
2. **Given** una sesión caducada, **When** la interfaz se actualiza, **Then** no muestra datos
   privados como si el usuario siguiera autenticado.
3. **Given** una operación privada interrumpida por falta de sesión, **When** el usuario vuelve a
   acceder, **Then** puede continuar desde la vista solicitada.
4. **Given** un fallo de conexión al comprobar la sesión, **When** no se puede confirmar su validez,
   **Then** el usuario ve un estado de error comprensible y no se inventa una sesión válida.

---

### User Story 6 - Formularios accesibles y usables en móvil (Priority: P3)

Como usuario, quiero completar el registro y el acceso con teclado o desde una pantalla pequeña,
para poder autenticarme sin depender del ratón ni de un dispositivo grande.

**Why this priority**: los formularios de autenticación son la puerta de entrada. Si no son
accesibles o no funcionan en móvil, una parte de los usuarios no puede utilizar la aplicación.

**Independent Test**: se puede comprobar recorriendo ambos formularios solo con teclado, con lector
de pantalla y en una pantalla de 360 píxeles de ancho.

**Acceptance Scenarios**:

1. **Given** el formulario de registro o acceso, **When** el usuario lo recorre solo con teclado,
   **Then** puede llegar a todos los campos y acciones y el foco es visible.
2. **Given** un formulario con errores, **When** el usuario los revisa con un lector de pantalla,
   **Then** cada error está asociado al campo correspondiente y se anuncia de forma comprensible.
3. **Given** una pantalla de 360 píxeles de ancho, **When** el usuario abre cualquiera de los dos
   formularios, **Then** puede completarlo sin desplazamiento horizontal no intencionado.
4. **Given** un formulario enviado, **When** la operación termina, **Then** la contraseña deja de
   mostrarse en la interfaz.
5. **Given** cualquier mensaje del formulario, **When** el usuario lo lee, **Then** está en español
   y no contiene detalles técnicos internos.

### Edge Cases

- El visitante intenta registrarse con un email que ya existe.
- El email tiene formato inválido o supera la longitud admitida.
- El nombre está vacío o supera los 100 caracteres.
- La contraseña tiene menos de ocho caracteres.
- El usuario introduce credenciales incorrectas y no debe saber si el email existe.
- El usuario envía el formulario dos veces por una pulsación repetida.
- El usuario recarga mientras se está comprobando la sesión.
- La sesión guardada ha caducado, es inválida o el usuario ya no existe.
- La comprobación de sesión falla por conexión.
- El usuario cierra sesión y usa el botón atrás del navegador.
- El usuario inicia sesión con otra cuenta después de cerrar la sesión anterior.
- El usuario abre la aplicación en otra pestaña; la sesión puede requerir un nuevo acceso.
- El usuario intenta abrir la pantalla de acceso o registro cuando ya tiene sesión.
- El usuario navega con teclado o con lector de pantalla.
- El formulario se usa en una pantalla estrecha.
- El usuario abandona el formulario sin enviarlo.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El visitante MUST poder abrir el registro desde la pantalla de acceso.
- **FR-002**: El registro MUST solicitar email, nombre y contraseña.
- **FR-003**: El registro MUST validar que el email tiene formato válido y no supera la longitud
  admitida, que el nombre no está vacío y no supera los 100 caracteres, y que la contraseña tiene al
  menos ocho caracteres.
- **FR-004**: Un email ya registrado MUST mostrar un mensaje comprensible asociado al campo de
  email y MUST NOT crear una cuenta duplicada.
- **FR-005**: Un registro correcto MUST crear la cuenta, iniciar la sesión y llevar al usuario al
  listado de anuncios.
- **FR-006**: El acceso MUST solicitar email y contraseña.
- **FR-007**: El acceso MUST validar que ambos campos están presentes y que el email tiene formato
  válido.
- **FR-008**: Unas credenciales incorrectas MUST mostrar un mensaje general que no revele si el
  email existe.
- **FR-009**: Un acceso correcto MUST iniciar la sesión, identificar al usuario y llevarlo a la vista
  solicitada o, si no había ninguna, al listado.
- **FR-010**: La sesión MUST conservarse al recargar la misma pestaña y MUST restaurarse sin volver a
  pedir credenciales.
- **FR-011**: Mientras se comprueba una sesión guardada, la interfaz MUST mostrar un estado de carga
  y MUST NOT habilitar acciones privadas de forma prematura.
- **FR-012**: Una sesión caducada, inválida o de un usuario inexistente MUST descartarse y MUST
  solicitar un nuevo acceso.
- **FR-013**: La cabecera MUST reflejar el estado de sesión y MUST actualizarse después de un
  registro, un acceso o un cierre de sesión.
- **FR-014**: El cierre de sesión MUST descartar la sesión y MUST eliminar de la interfaz los datos
  privados del usuario anterior.
- **FR-015**: Después del cierre de sesión, las acciones protegidas MUST volver a solicitar acceso.
- **FR-016**: Un fallo de sesión durante una operación privada MUST informar al usuario y MUST
  solicitar un nuevo acceso sin mostrar datos privados obsoletos.
- **FR-017**: El sistema MUST impedir que se muestren datos privados de una cuenta anterior después
  de cerrar sesión o de acceder con otra cuenta.
- **FR-018**: La contraseña MUST NOT mostrarse en la interfaz ni conservarse visible después del
  envío.
- **FR-019**: Los formularios MUST usar etiquetas asociadas, mensajes de error accesibles,
  navegación por teclado y foco visible.
- **FR-020**: Los formularios MUST ser utilizables en una pantalla de 360 píxeles de ancho sin
  desplazamiento horizontal no intencionado.
- **FR-021**: Durante un envío, la acción MUST mostrar un estado de carga y MUST impedir envíos
  duplicados.
- **FR-022**: Los errores de conexión MUST mostrar un mensaje comprensible y MUST conservar el email
  introducido.
- **FR-023**: La interfaz de registro y acceso MUST estar redactada en español y MUST NOT mostrar
  detalles técnicos internos.
- **FR-024**: El usuario MUST poder consultar y cerrar su sesión desde la interfaz cuando esté
  autenticado.
- **FR-025**: Las personas que ya tienen sesión MUST ser redirigidas fuera de las pantallas de
  acceso y registro.
- **FR-026**: La sesión MUST mantenerse por pestaña; abrir otra pestaña MAY requerir un nuevo
  acceso.
- **FR-027**: Esta feature MUST NOT modificar el backend ni sustituir sus respuestas por datos
  simulados.
- **FR-028**: Esta feature MUST NOT incluir recuperación de contraseña, verificación de email,
  cambio de email, proveedores externos de acceso, perfil público, mensajería ni valoraciones.

### Key Entities *(include if feature involves data)*

- **Cuenta**: identidad del usuario con email, nombre y contraseña; la contraseña nunca se muestra
  después del envío.
- **Sesión**: estado que identifica al usuario autenticado, su validez y los datos privados que deben
  mostrarse o limpiarse.
- **Credenciales**: email y contraseña introducidos para acceder; no deben quedar visibles en la
  interfaz después del envío.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100 % de los registros válidos crea una cuenta, inicia la sesión y lleva al usuario
  al listado de anuncios.
- **SC-002**: El 100 % de los registros inválidos muestra los errores correspondientes y no crea
  una cuenta.
- **SC-003**: El 100 % de los intentos con un email ya registrado muestra un mensaje asociado al
  email y no duplica la cuenta.
- **SC-004**: El 100 % de los accesos válidos inicia la sesión y lleva al usuario a la vista
  solicitada o al listado.
- **SC-005**: El 100 % de los accesos con credenciales incorrectas muestra un mensaje general sin
  revelar si el email existe.
- **SC-006**: El 100 % de las recargas en la misma pestaña con una sesión válida restaura la sesión
  sin volver a pedir credenciales.
- **SC-007**: El 100 % de las sesiones caducadas o inválidas se descarta y solicita un nuevo acceso.
- **SC-008**: El 100 % de los cierres de sesión elimina los datos privados de la interfaz y vuelve
  a solicitar acceso para las acciones protegidas.
- **SC-009**: El 100 % de las operaciones privadas interrumpidas por falta de sesión informa al
  usuario y no deja datos privados obsoletos visibles.
- **SC-010**: El 100 % de las contraseñas introducidas deja de mostrarse después del envío.
- **SC-011**: El 100 % de los formularios de registro y acceso puede completarse solo con teclado,
  con etiquetas y errores accesibles.
- **SC-012**: El 100 % de los formularios de registro y acceso se usa sin desplazamiento horizontal
  no intencionado en una pantalla de 360 píxeles de ancho.
- **SC-013**: Un usuario puede completar el acceso en menos de 30 segundos desde que abre el
  formulario, en condiciones normales.
- **SC-014**: El 100 % de los mensajes de error visibles está en español y no expone detalles
  técnicos internos.
- **SC-015**: Esta feature no modifica el backend ni introduce respuestas simuladas para las
  operaciones de registro, acceso o sesión.

## Assumptions

- El backend existente ofrece registro, acceso y comprobación de sesión; no se modifica en esta
  feature.
- La sesión tiene una duración limitada y no se renueva automáticamente.
- La sesión se conserva al recargar la misma pestaña; abrir otra pestaña puede requerir un nuevo
  acceso.
- El cierre de sesión afecta a la pestaña actual; otras pestañas pueden conservar su propia sesión.
- El registro inicia la sesión automáticamente.
- Los usuarios de prueba del sistema siguen siendo válidos para comprobar el acceso.
- No se exige verificación de email ni confirmación por correo.
- No se incluye recuperación de contraseña, cambio de email ni proveedores externos de acceso.
- La interfaz se redacta en español y se usa en escritorio y en móvil.
- La estructura común, las rutas y los estados de interfaz se apoyan en la spec 001.
- El perfil propio y el cambio de contraseña se implementan en una spec posterior.
- El email solo se muestra al propio usuario; no se expone el de otras cuentas.
- No se incluye “recordarme” entre reinicios del navegador ni entre dispositivos.

## Out of Scope

- Recuperación o restablecimiento de contraseña.
- Verificación de email y cambio de email.
- Inicio de sesión con proveedores externos.
- Renovación automática de la sesión.
- Cierre de sesión en el servidor o revocación centralizada.
- “Recordarme” entre pestañas, reinicios o dispositivos.
- Eliminación de cuenta.
- Edición de perfil y cambio de contraseña.
- Perfil público, mensajería y valoraciones.
- Modificaciones del backend, del esquema o de los contratos de la API.
