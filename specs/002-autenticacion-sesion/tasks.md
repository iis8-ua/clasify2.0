---

description: "Task list for the 002-autenticacion-sesion feature"
---

# Tasks: Registro, acceso y sesión de usuario

**Input**: Design documents from `/specs/002-autenticacion-sesion/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Se incluyen tareas de prueba porque el plan y la constitución exigen Vitest para servicios, stores y componentes clave. Las pruebas deben escribirse antes de la implementación correspondiente y fallar primero.

**Organization**: Las tareas se agrupan por historia de usuario para que cada una pueda implementarse y validarse de forma independiente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede ejecutarse en paralelo (archivos distintos, sin dependencias pendientes)
- **[Story]**: Historia de usuario a la que pertenece la tarea (`US1`–`US6`)
- Todas las tareas incluyen la ruta exacta del archivo afectado

## Path Conventions

- Frontend: `frontend-vue/src/` y `frontend-vue/tests/`
- Backend existente: `backend/` (no se modifica)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirmar la base creada en 001 y preparar la estructura de autenticación.

- [X] T001 Confirmar la base de `frontend-vue/package.json`, Vite y Vitest creada en 001, sin añadir dependencias nuevas
- [X] T002 [P] Crear la estructura de pruebas y componentes de autenticación en `frontend-vue/tests/auth/` y `frontend-vue/src/components/auth/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Servicio, store y frontera de sesión que necesitan todas las historias.

**⚠️ CRITICAL**: Ninguna historia puede empezar hasta completar esta fase.

- [X] T003 [P] Implementar `authService` con registro, acceso y `/auth/yo` en `frontend-vue/src/services/authService.js`
- [X] T004 [P] Implementar el estado de sesión en `frontend-vue/src/stores/session.js` con token, usuario, estado, error y `sessionVersion`
- [X] T005 Implementar el almacenamiento del token en `sessionStorage` con la clave `clasify.session.token` en `frontend-vue/src/stores/session.js`
- [X] T006 Integrar la store de sesión con la capa HTTP en `frontend-vue/src/services/http.js` y `frontend-vue/src/stores/session.js`
- [X] T007 Definir la clasificación de códigos `401` y el contrato de error en `frontend-vue/src/services/errors.js`, sin limpiar la sesión en esta tarea
- [X] T008 Implementar las guardas base de rutas protegidas y de acceso/registro en `frontend-vue/src/router/guards.js`, sin la lógica de retorno tras sesión caducada
- [X] T009 [P] Implementar la tarjeta compartida de autenticación en `frontend-vue/src/components/auth/AuthCard.vue`
- [X] T010 Preparar el punto de arranque para invocar la restauración una sola vez en `frontend-vue/src/main.js` y `frontend-vue/src/App.vue`, sin implementar la lógica de `/auth/yo`
- [X] T011 Implementar el contrato de limpieza de datos privados mediante `sessionVersion` en `frontend-vue/src/stores/session.js`

**Checkpoint**: La base de autenticación está lista para las historias.

---

## Phase 3: User Story 1 - Crear una cuenta (Priority: P1) 🎯 MVP

**Goal**: Permitir registrar una cuenta válida, iniciar sesión automáticamente y mostrar los errores de registro.

**Independent Test**: Abrir el registro, crear una cuenta válida y comprobar que el usuario queda autenticado. Probar email duplicado y datos inválidos.

### Tests for User Story 1

- [X] T012 [P] [US1] Crear pruebas de registro en `frontend-vue/tests/auth/register.spec.js`

### Implementation for User Story 1

- [X] T013 [P] [US1] Implementar el formulario de registro en `frontend-vue/src/components/auth/RegisterForm.vue`
- [X] T014 [US1] Implementar la vista de registro en `frontend-vue/src/views/RegisterView.vue`
- [X] T015 [US1] Conectar el registro correcto con la sesión y la redirección al listado en `frontend-vue/src/components/auth/RegisterForm.vue` y `frontend-vue/src/stores/session.js`
- [X] T016 [US1] Mostrar el error de email duplicado asociado al campo en `frontend-vue/src/components/auth/RegisterForm.vue`
- [X] T017 [US1] Implementar validación de email, nombre de hasta 100 caracteres y contraseña mínima de 8 en `frontend-vue/src/components/auth/RegisterForm.vue`
- [X] T018 [US1] Añadir el enlace de vuelta al acceso y la navegación entre registro y login en `frontend-vue/src/views/RegisterView.vue` y `frontend-vue/src/router/index.js`

**Checkpoint**: El registro funciona de forma independiente.

---

## Phase 4: User Story 2 - Iniciar sesión (Priority: P1)

**Goal**: Permitir acceder con credenciales válidas y redirigir a la vista solicitada o al listado.

**Independent Test**: Acceder con un usuario válido, comprobar la identificación y la redirección. Probar credenciales incorrectas y validaciones.

### Tests for User Story 2

- [X] T019 [P] [US2] Crear pruebas de acceso en `frontend-vue/tests/auth/login.spec.js`

### Implementation for User Story 2

- [X] T020 [P] [US2] Implementar el formulario de acceso en `frontend-vue/src/components/auth/LoginForm.vue`
- [X] T021 [US2] Implementar la vista de acceso en `frontend-vue/src/views/LoginView.vue`
- [X] T022 [US2] Conectar el acceso correcto con la sesión y la redirección a la vista solicitada o al listado en `frontend-vue/src/components/auth/LoginForm.vue` y `frontend-vue/src/stores/session.js`
- [X] T023 [US2] Mostrar un mensaje general ante credenciales incorrectas en `frontend-vue/src/components/auth/LoginForm.vue`
- [X] T024 [US2] Implementar validación de campos, carga y bloqueo de doble envío en `frontend-vue/src/components/auth/LoginForm.vue`

**Checkpoint**: El acceso funciona de forma independiente y redirige correctamente.

---

## Phase 5: User Story 3 - Mantener la sesión al recargar (Priority: P2)

**Goal**: Restaurar la sesión al recargar la misma pestaña y reflejarla en la cabecera.

**Independent Test**: Iniciar sesión, recargar y comprobar que el usuario sigue identificado y que las acciones privadas siguen disponibles.

### Tests for User Story 3

- [X] T025 [P] [US3] Crear pruebas de restauración de sesión en `frontend-vue/tests/auth/sessionRestore.spec.js`

### Implementation for User Story 3

- [X] T026 [US3] Implementar la restauración de sesión con token y `/auth/yo`, incluyendo estados y transiciones, en `frontend-vue/src/stores/session.js`
- [X] T027 [US3] Mostrar el estado de comprobación y evitar acciones privadas prematuras en `frontend-vue/src/App.vue` y `frontend-vue/src/components/layout/AppHeader.vue`
- [X] T028 [US3] Implementar el reintento ante error de conexión al comprobar la sesión en `frontend-vue/src/stores/session.js` y `frontend-vue/src/App.vue`
- [X] T029 [US3] Sincronizar la cabecera con el usuario restaurado en `frontend-vue/src/components/layout/AppHeader.vue`

**Checkpoint**: La sesión se conserva al recargar la misma pestaña.

---

## Phase 6: User Story 4 - Cerrar sesión y proteger la información privada (Priority: P2)

**Goal**: Cerrar la sesión localmente, limpiar datos privados y volver a un estado público.

**Independent Test**: Iniciar sesión, acceder a una sección privada, cerrar sesión y comprobar que no quedan datos privados ni acciones protegidas disponibles.

### Tests for User Story 4

- [X] T030 [P] [US4] Crear pruebas de cierre de sesión en `frontend-vue/tests/auth/logout.spec.js`

### Implementation for User Story 4

- [X] T031 [US4] Implementar el cierre de sesión local y la eliminación del token en `frontend-vue/src/stores/session.js`
- [X] T032 [US4] Incrementar `sessionVersion` y documentar la limpieza de stores privadas en `frontend-vue/src/stores/session.js`
- [X] T033 [US4] Conectar el cierre de sesión con la cabecera y la navegación pública en `frontend-vue/src/components/layout/AppHeader.vue` y `frontend-vue/src/router/index.js`

**Checkpoint**: El cierre de sesión deja la interfaz sin datos privados.

---

## Phase 7: User Story 5 - Recuperarse de una sesión caducada (Priority: P3)

**Goal**: Detectar sesiones caducadas o inválidas y solicitar acceso sin dejar datos obsoletos.

**Independent Test**: Invalidar una sesión y realizar una operación privada; comprobar que se solicita acceso y que no quedan datos privados visibles.

### Tests for User Story 5

- [X] T034 [P] [US5] Crear pruebas de sesión caducada y `401` en `frontend-vue/tests/auth/sessionExpiry.spec.js`

### Implementation for User Story 5

- [X] T035 [US5] Limpiar la sesión ante códigos `SIN_TOKEN`, `TOKEN_INVALIDO`, `TOKEN_CADUCADO` y `USUARIO_NO_EXISTE` en `frontend-vue/src/stores/session.js`
- [X] T036 [US5] Tratar `CREDENCIALES_INVALIDAS` como error de formulario sin cerrar la sesión en `frontend-vue/src/stores/session.js` y `frontend-vue/src/services/errors.js`
- [X] T037 [US5] Redirigir al acceso conservando la ruta solicitada en `frontend-vue/src/router/guards.js` y `frontend-vue/src/views/LoginView.vue`

**Checkpoint**: La sesión caducada se gestiona sin datos obsoletos.

---

## Phase 8: User Story 6 - Formularios accesibles y usables en móvil (Priority: P3)

**Goal**: Garantizar que acceso y registro sean accesibles con teclado y usables a 360 px.

**Independent Test**: Recorrer ambos formularios solo con teclado, con lector de pantalla y en una pantalla de 360 px.

### Tests for User Story 6

- [X] T038 [P] [US6] Crear pruebas de accesibilidad y responsive de formularios en `frontend-vue/tests/auth/formsAccessibility.spec.js`

### Implementation for User Story 6

- [X] T039 [US6] Asociar etiquetas, errores y descripciones a los campos en `frontend-vue/src/components/auth/AuthCard.vue`, `LoginForm.vue` y `RegisterForm.vue`
- [X] T040 [US6] Ajustar los formularios a 360 px sin desplazamiento horizontal en `frontend-vue/src/components/auth/AuthCard.vue` y `frontend-vue/src/styles/base.css`
- [X] T041 [US6] Verificar navegación por teclado, foco visible y envío con Enter en `frontend-vue/src/components/auth/LoginForm.vue` y `RegisterForm.vue`
- [X] T042 [US6] Revisar mensajes en español y ausencia de detalles técnicos en `frontend-vue/src/components/auth/LoginForm.vue` y `RegisterForm.vue`

**Checkpoint**: Los formularios son accesibles y usables en móvil.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Documentación, validación y calidad transversal.

- [X] T043 [P] Actualizar `README.md` con registro, acceso, sesión, variables de entorno y usuarios de prueba
- [X] T044 Ejecutar `npm run test:unit` y `npm run build` en `frontend-vue/` y registrar el resultado
- [X] T045 Ejecutar la validación manual de `specs/002-autenticacion-sesion/quickstart.md` y registrar el recorrido
- [X] T046 Revisar que no haya comentarios, llamadas directas a `fetch` ni cambios en `backend/` en `frontend-vue/src/`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias.
- **Foundational (Phase 2)**: depende de Setup y bloquea todas las historias.
- **User Stories (Phase 3–8)**: dependen de Foundational.
- **Polish (Phase 9)**: depende de las historias implementadas.

### User Story Dependencies

- **US1 (P1)**: depende de Foundational; no depende de otras historias.
- **US2 (P1)**: depende de Foundational; puede compartir AuthCard y sesión con US1.
- **US3 (P2)**: depende de Foundational y de la sesión; puede integrarse con US2.
- **US4 (P2)**: depende de Foundational y de la sesión; puede integrarse con US3.
- **US5 (P3)**: depende de Foundational y de la sesión; puede integrarse con US4.
- **US6 (P3)**: depende de los formularios de US1 y US2.

### Within Each Story

- Las pruebas se escriben antes de la implementación.
- Componentes de formulario antes de las vistas.
- La integración con sesión y router se hace después de los componentes.
- Cada historia se valida antes de pasar a la siguiente.

### Parallel Opportunities

- T003, T004 y T009 pueden ejecutarse en paralelo.
- T012 y T019 pueden ejecutarse en paralelo con los formularios de otras historias.
- T013 y T020 pueden ejecutarse en paralelo.
- T025, T030, T034 y T038 pueden prepararse en paralelo si los archivos no se solapan.
- Las tareas de pruebas de cada historia pueden ejecutarse en paralelo dentro de su fase.

---

## Parallel Example: User Story 1

```bash
Task: "Crear pruebas de registro en frontend-vue/tests/auth/register.spec.js"
Task: "Implementar el formulario de registro en frontend-vue/src/components/auth/RegisterForm.vue"
```

## Parallel Example: User Story 2

```bash
Task: "Crear pruebas de acceso en frontend-vue/tests/auth/login.spec.js"
Task: "Implementar el formulario de acceso en frontend-vue/src/components/auth/LoginForm.vue"
```

## Parallel Example: User Story 6

```bash
Task: "Crear pruebas de accesibilidad de formularios en frontend-vue/tests/auth/formsAccessibility.spec.js"
Task: "Revisar etiquetas y errores en frontend-vue/src/components/auth/AuthCard.vue"
```

## Implementation Strategy

### MVP First (US1 + US2)

1. Completar Phase 1 y Phase 2.
2. Completar US1 y US2.
3. Detenerse y validar registro, acceso, sesión y redirección.
4. No avanzar a US3 hasta que el flujo básico funcione.

### Incremental Delivery

1. Setup + Foundational → base de autenticación.
2. US1 → registro.
3. US2 → acceso.
4. US3 → restauración de sesión.
5. US4 → logout y limpieza.
6. US5 → sesión caducada.
7. US6 → accesibilidad y móvil.
8. Polish → README, pruebas y validación manual.

### Parallel Team Strategy

- Una persona completa Setup y Foundational.
- Después, US1 y US2 pueden avanzar en paralelo si se coordinan AuthCard y la store.
- US3, US4 y US5 comparten la store de sesión; deben coordinarse.
- US6 se integra al final sobre los formularios ya creados.

---

## Notes

- [P] indica archivos distintos y sin dependencia pendiente.
- [US1]–[US6] permiten trazabilidad con la spec.
- Cada historia debe poder validarse de forma independiente.
- Verificar que las pruebas fallan antes de implementar.
- Commit después de cada tarea o grupo lógico.
- Detenerse en cada checkpoint para revisar.
- No modificar `backend/`.
- No usar `localStorage`.
- No añadir comentarios al código.
