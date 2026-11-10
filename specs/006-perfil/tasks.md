---

description: "Task list for the 006-perfil feature"
---

# Tasks: Perfil propio

**Input**: Design documents from `/specs/006-perfil/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Se incluyen tareas de prueba porque el plan y la constitución exigen Vitest para servicios, stores y componentes clave. Las pruebas deben escribirse antes de la implementación correspondiente y fallar primero.

**Organization**: Las tareas se agrupan por historia de usuario para que cada una pueda implementarse y validarse de forma independiente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede ejecutarse en paralelo (archivos distintos, sin dependencias pendientes)
- **[Story]**: Historia de usuario a la que pertenece la tarea (`US1`–`US5`)
- Todas las tareas incluyen la ruta exacta del archivo afectado

## Path Conventions

- Frontend: `frontend-vue/src/` y `frontend-vue/tests/`
- Backend existente: `backend/` (no se modifica)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirmar la base de 001–005 y preparar la estructura del perfil.

- [X] T001 Confirmar la base de 001–005, la sesión, el catálogo y las tarjetas en `frontend-vue/package.json`, sin añadir dependencias nuevas
- [X] T002 [P] Crear la estructura de componentes y pruebas de perfil en `frontend-vue/src/components/perfil/` y `frontend-vue/tests/perfil/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Servicio, store y ruta que necesitan las historias.

**⚠️ CRITICAL**: Ninguna historia puede empezar hasta completar esta fase.

- [X] T003 [P] Implementar `usuariosService` con perfil, edición y anuncios propios en `frontend-vue/src/services/usuariosService.js`
- [X] T004 [P] Implementar `perfilStore` con perfil, anuncios propios y estados en `frontend-vue/src/stores/perfil.js`
- [X] T005 Implementar la limpieza de perfil y anuncios propios al cambiar `sessionVersion` en `frontend-vue/src/stores/perfil.js`
- [X] T006 Configurar la ruta `/perfil` apuntando a `PlaceholderView` en `frontend-vue/src/router/routes.js`; la vista real se conecta en T011
- [X] T007 [P] Mapear errores de perfil y contraseña a estados de interfaz en `frontend-vue/src/services/errors.js`
- [X] T008 Asegurar que `/perfil` es una ruta protegida en `frontend-vue/src/router/routes.js` y `frontend-vue/src/router/guards.js`

**Checkpoint**: La base del perfil está lista para las historias.

---

## Phase 3: User Story 1 - Consultar mi perfil (Priority: P1) 🎯 MVP

**Goal**: Mostrar los datos del perfil propio y su resumen de valoraciones.

**Independent Test**: Iniciar sesión, abrir `/perfil` y comprobar nombre, email, biografía, fecha de alta y resumen de valoraciones.

### Tests for User Story 1

- [X] T009 [P] [US1] Crear pruebas de consulta del perfil en `frontend-vue/tests/perfil/perfilView.spec.js`

### Implementation for User Story 1

- [X] T010 [US1] Implementar el bloque de datos del perfil en `frontend-vue/src/components/perfil/PerfilDatos.vue`
- [X] T011 [US1] Implementar la vista de perfil en `frontend-vue/src/views/PerfilView.vue` y sustituir la ruta `/perfil` por esa vista
- [X] T012 [US1] Cargar el perfil con estados de carga, error y reintento en `frontend-vue/src/views/PerfilView.vue` y `frontend-vue/src/stores/perfil.js`
- [X] T013 [US1] Mostrar el email como dato informativo y no editable en `frontend-vue/src/components/perfil/PerfilDatos.vue`
- [X] T014 [US1] Mostrar fecha de alta y resumen de valoraciones en `frontend-vue/src/components/perfil/PerfilDatos.vue`

**Checkpoint**: La consulta del perfil funciona de forma independiente.

---

## Phase 4: User Story 2 - Editar mis datos (Priority: P1)

**Goal**: Editar nombre y biografía y reflejar el cambio en la sesión y la cabecera.

**Independent Test**: Cambiar nombre o biografía, guardar y comprobar perfil y cabecera. Probar validaciones y cambios sin guardar.

### Tests for User Story 2

- [X] T015 [P] [US2] Crear pruebas de edición de datos en `frontend-vue/tests/perfil/perfilForm.spec.js`

### Implementation for User Story 2

- [X] T016 [US2] Implementar el formulario de datos en `frontend-vue/src/components/perfil/PerfilForm.vue`
- [X] T017 [US2] Precargar valores y detectar cambios sin guardar en `frontend-vue/src/components/perfil/PerfilForm.vue`
- [X] T018 [US2] Enviar solo nombre y biografía modificados en `frontend-vue/src/components/perfil/PerfilForm.vue` y `frontend-vue/src/stores/perfil.js`
- [X] T019 [US2] Actualizar el usuario de sesión y la cabecera tras guardar en `frontend-vue/src/stores/perfil.js`, `frontend-vue/src/stores/session.js` y `frontend-vue/src/components/layout/AppHeader.vue`
- [X] T020 [US2] Gestionar validación, error de conexión y aviso de cambios sin guardar en `frontend-vue/src/components/perfil/PerfilForm.vue`

**Checkpoint**: La edición de datos funciona de forma independiente.

---

## Phase 5: User Story 3 - Cambiar mi contraseña (Priority: P2)

**Goal**: Cambiar la contraseña con la actual y una nueva de al menos 8 caracteres.

**Independent Test**: Cambiar la contraseña de una cuenta de prueba y acceder con la nueva. Probar contraseña actual incorrecta y nueva demasiado corta.

### Tests for User Story 3

- [X] T021 [P] [US3] Crear pruebas de cambio de contraseña en `frontend-vue/tests/perfil/cambioContrasena.spec.js`

### Implementation for User Story 3

- [X] T022 [P] [US3] Implementar el formulario de contraseña en `frontend-vue/src/components/perfil/CambioContrasenaForm.vue`
- [X] T023 [US3] Validar contraseña actual obligatoria y nueva de mínimo 8 caracteres en `frontend-vue/src/components/perfil/CambioContrasenaForm.vue`
- [X] T024 [US3] Tratar la contraseña actual incorrecta como error de formulario sin cerrar sesión en `frontend-vue/src/components/perfil/CambioContrasenaForm.vue` y `frontend-vue/src/stores/perfil.js`
- [X] T025 [US3] Mostrar confirmación, limpiar campos y conservar la sesión tras el cambio en `frontend-vue/src/components/perfil/CambioContrasenaForm.vue`

**Checkpoint**: El cambio de contraseña funciona de forma independiente.

---

## Phase 6: User Story 4 - Consultar mis anuncios (Priority: P2)

**Goal**: Mostrar los anuncios propios paginados, con estado y acceso al detalle.

**Independent Test**: Abrir “Mis anuncios”, comprobar que solo aparecen los propios, abrir un detalle y probar página y estado vacío.

### Tests for User Story 4

- [X] T026 [P] [US4] Crear pruebas de anuncios propios en `frontend-vue/tests/perfil/misAnuncios.spec.js`

### Implementation for User Story 4

- [X] T027 [US4] Implementar la sección de anuncios propios en `frontend-vue/src/components/perfil/MisAnunciosSection.vue`
- [X] T028 [US4] Cargar la lista y sincronizar `pagina` con la URL en `frontend-vue/src/components/perfil/MisAnunciosSection.vue`
- [X] T029 [US4] Reutilizar tarjetas, mostrar vendidos y limitar la lista a abrir el detalle en `frontend-vue/src/components/perfil/MisAnunciosSection.vue` y `frontend-vue/src/components/catalog/AnuncioCard.vue`
- [X] T030 [US4] Añadir la acción de creación al estado vacío en `frontend-vue/src/components/perfil/MisAnunciosSection.vue` y `frontend-vue/src/router/index.js`
- [X] T031 [US4] Implementar paginación y corrección de página fuera de rango en `frontend-vue/src/components/perfil/MisAnunciosSection.vue` y `frontend-vue/src/stores/perfil.js`

**Checkpoint**: Los anuncios propios funcionan de forma independiente.

---

## Phase 7: User Story 5 - Gestionar mi perfil con teclado o en móvil (Priority: P3)

**Goal**: Garantizar accesibilidad y uso del perfil, formularios y lista a 360 px.

**Independent Test**: Recorrer perfil, formularios, lista y paginación solo con teclado y en una pantalla de 360 px.

### Tests for User Story 5

- [X] T032 [P] [US5] Crear pruebas de accesibilidad del perfil en `frontend-vue/tests/perfil/perfilAccessibility.spec.js`

### Implementation for User Story 5

- [X] T033 [US5] Asociar etiquetas, errores y descripciones a los campos en `frontend-vue/src/components/perfil/PerfilForm.vue` y `frontend-vue/src/components/perfil/CambioContrasenaForm.vue`
- [X] T034 [US5] Ajustar perfil, formularios y lista a 360 px en `frontend-vue/src/views/PerfilView.vue` y `frontend-vue/src/styles/base.css`
- [X] T035 [US5] Asegurar teclado y foco en perfil, lista y paginación en `frontend-vue/src/components/perfil/MisAnunciosSection.vue` y `frontend-vue/src/components/catalog/PaginacionCatalogo.vue`
- [X] T036 [US5] Revisar mensajes en español y ausencia de detalles técnicos en `frontend-vue/src/components/perfil/PerfilForm.vue` y `frontend-vue/src/components/perfil/CambioContrasenaForm.vue`

**Checkpoint**: El perfil es accesible y usable en móvil.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Documentación, validación y calidad transversal.

- [X] T037 [P] Actualizar `README.md` con perfil, contraseña y anuncios propios
- [X] T038 Ejecutar `npm run test:unit` y `npm run build` en `frontend-vue/` y registrar el resultado
- [X] T039 Ejecutar la validación manual de `specs/006-perfil/quickstart.md` y registrar el recorrido
- [X] T040 Revisar que no haya comentarios, llamadas directas a `fetch`, perfil público, avatar, cambio de email, búsqueda/filtros ni cambios en `backend/` en `frontend-vue/src/`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias.
- **Foundational (Phase 2)**: depende de Setup y bloquea todas las historias.
- **User Stories (Phase 3–7)**: dependen de Foundational.
- **Polish (Phase 8)**: depende de las historias implementadas.

### User Story Dependencies

- **US1 (P1)**: depende de Foundational; no depende de otras historias.
- **US2 (P1)**: depende de US1 y de la store de sesión.
- **US3 (P2)**: depende de Foundational y de la sesión; puede integrarse con US2.
- **US4 (P2)**: depende de Foundational y de las tarjetas de 003.
- **US5 (P3)**: depende de US1, US2, US3 y US4.

### Within Each Story

- Las pruebas se escriben antes de la implementación.
- Componentes antes de la vista o de la integración.
- La sincronización con sesión, URL y paginación se hace después de los componentes.
- Cada historia se valida antes de pasar a la siguiente.

### Parallel Opportunities

- T003, T004 y T007 pueden ejecutarse en paralelo.
- T010, T016, T022 y T027 pueden prepararse en paralelo sobre archivos distintos.
- T033, T034 y T035 pueden ejecutarse en paralelo.
- Las pruebas de cada historia pueden ejecutarse en paralelo dentro de su fase.

---

## Parallel Example: User Story 1

```bash
Task: "Crear pruebas de perfil en frontend-vue/tests/perfil/perfilView.spec.js"
Task: "Implementar el bloque de datos en frontend-vue/src/components/perfil/PerfilDatos.vue"
```

## Parallel Example: User Story 3

```bash
Task: "Crear pruebas de contraseña en frontend-vue/tests/perfil/cambioContrasena.spec.js"
Task: "Implementar el formulario de contraseña en frontend-vue/src/components/perfil/CambioContrasenaForm.vue"
```

## Parallel Example: User Story 5

```bash
Task: "Asociar etiquetas y errores en frontend-vue/src/components/perfil/PerfilForm.vue"
Task: "Asegurar teclado en la lista en frontend-vue/src/components/perfil/MisAnunciosSection.vue"
Task: "Ajustar 360 px en frontend-vue/src/styles/base.css"
```

## Implementation Strategy

### MVP First (US1 + US2)

1. Completar Phase 1 y Phase 2.
2. Completar US1 y US2.
3. Detenerse y validar perfil y edición de datos.
4. No avanzar a US3 hasta que el perfil y la edición funcionen.

US1 y US2 son P1; el perfil necesita ambos para ser útil.

### Incremental Delivery

1. Setup + Foundational → base del perfil.
2. US1 → consulta.
3. US2 → edición de datos.
4. US3 → cambio de contraseña.
5. US4 → anuncios propios.
6. US5 → accesibilidad y móvil.
7. Polish → README, pruebas y validación manual.

### Parallel Team Strategy

- Una persona completa Setup y Foundational.
- US1 y US2 pueden avanzar con coordinación en la vista y la sesión.
- US3 y US4 pueden avanzar en paralelo sobre archivos distintos.
- US5 se integra al final.

---

## Notes

- [P] indica archivos distintos y sin dependencia pendiente.
- [US1]–[US5] permiten trazabilidad con la spec.
- Cada historia debe poder validarse de forma independiente.
- Verificar que las pruebas fallan antes de implementar.
- Commit después de cada tarea o grupo lógico.
- Detenerse en cada checkpoint para revisar.
- No modificar `backend/`.
- No añadir comentarios al código.
- Las acciones de gestión de anuncios se realizan desde el detalle.
- El email no se puede editar.

## Phase 9: Convergence

- [X] T041 Verificar y cubrir con prueba de integración el flujo «Mis anuncios → detalle → acciones del autor» usando la forma real del detalle normalizado, ajustando cualquier consumidor restante, per FR-029, US4/AC3 (contradicts)
- [X] T042 Añadir obligatoriedad visible y `required`/`aria-required` a nombre, contraseña actual y contraseña nueva, con pruebas de accesibilidad, per FR-006, FR-008, FR-009, FR-023 (missing)
- [X] T043 Anunciar los errores de campo mediante región viva o `role="alert"` y mover el foco al primer campo inválido tras el envío, con pruebas, per FR-023, US5/AC2 (partial)
- [X] T044 Secuenciar las cargas de páginas de anuncios propios con token de solicitud o cancelación para evitar respuestas fuera de orden, con prueba, per FR-021, SC-011 (partial)
- [X] T045 Normalizar a página 1 una URL de anuncios propios fuera de rango cuando `paginas` sea 0, con prueba para usuario sin anuncios, per FR-022 (partial)
- [X] T046 Añadir aviso `beforeunload` con cambios sin guardar y reordenar el cierre de sesión para no limpiar la sesión antes de confirmar la salida, con pruebas, per FR-014, US2/AC8 (partial)

## Phase 10: Convergence

- [ ] T047 Evitar que el aviso de cambios sin guardar del perfil bloquee una redirección motivada por sesión inválida desde el cambio de contraseña o “Mis anuncios”, con prueba de regresión, per 006 FR-026, 002 FR-016 (partial)
