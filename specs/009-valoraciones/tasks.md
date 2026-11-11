---

description: "Task list for the 009-valoraciones feature"
---

# Tasks: Valoraciones

**Input**: Design documents from `/specs/009-valoraciones/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Se incluyen tareas de prueba porque el plan y la constitución exigen Vitest para servicios, stores y componentes clave.

**Organization**: Las tareas se agrupan por historia de usuario para que cada una pueda implementarse y validarse de forma independiente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede ejecutarse en paralelo (archivos distintos, sin dependencias pendientes)
- **[Story]**: Historia de usuario (`US1`–`US4`)
- Todas las tareas incluyen la ruta exacta del archivo afectado

## Path Conventions

- Frontend: `frontend-vue/src/` y `frontend-vue/tests/`
- Backend existente: `backend/` (no se modifica)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirmar la base de 001–003 y 006–008 y preparar la estructura de valoraciones.

- [X] T001 Confirmar el perfil público de 008, el perfil propio de 006, las confirmaciones y la paginación en `frontend-vue/src/`
- [X] T002 [P] Crear la estructura de componentes y pruebas de valoraciones en `frontend-vue/src/components/valoraciones/` y `frontend-vue/tests/valoraciones/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Servicio, store y estados que necesitan las historias.

**⚠️ CRITICAL**: Ninguna historia puede empezar hasta completar esta fase.

- [X] T003 Implementar `valoracionesService` con listar recibidas, listar escritas, guardar y eliminar en `frontend-vue/src/services/valoracionesService.js`
- [X] T004 Implementar `valoracionesStore` con listas, operaciones, estados y limpieza por sesión en `frontend-vue/src/stores/valoraciones.js`
- [X] T005 [P] Reutilizar `ConfirmAction` y la normalización de errores en `frontend-vue/src/components/states/ConfirmAction.vue` y `frontend-vue/src/services/errors.js`
- [X] T006 [P] Definir los parámetros de URL y la paginación independiente de recibidas y escritas en `frontend-vue/src/views/PerfilView.vue`

**Checkpoint**: La base de valoraciones está lista para las historias.

---

## Phase 3: User Story 1 - Valorar a otro usuario (Priority: P1) 🎯 MVP

**Goal**: Crear o actualizar una valoración desde el perfil público.

**Independent Test**: Abrir el perfil público de otro usuario, valorar, recargar y comprobar la valoración y el resumen.

### Tests for User Story 1

- [X] T007 [P] [US1] Crear pruebas del servicio de guardar y listar valoraciones en `frontend-vue/tests/valoraciones/valoracionesService.spec.js`
- [ ] T008 [P] [US1] Crear pruebas del formulario de valoración, validación y precarga en `frontend-vue/tests/valoraciones/formularioValoracion.spec.js`

### Implementation for User Story 1

- [ ] T009 [US1] Implementar `FormularioValoracion` con puntuación 1–5, comentario opcional de 500, carga, error y confirmación en `frontend-vue/src/components/valoraciones/FormularioValoracion.vue`
- [ ] T010 [US1] Integrar el formulario en `frontend-vue/src/views/PerfilPublicoView.vue`, sin mostrarlo en el perfil propio
- [ ] T011 [US1] Precargar `mi_valoracion` cuando exista y usar `PUT` para crear o actualizar sin duplicados en `frontend-vue/src/components/valoraciones/FormularioValoracion.vue` y `frontend-vue/src/views/PerfilPublicoView.vue`
- [ ] T012 [US1] Gestionar validación por campo, foco en el primer error, `401`, `404` y conexión, conservando el comentario si falla en `frontend-vue/src/components/valoraciones/FormularioValoracion.vue`

**Checkpoint**: Crear y actualizar valoraciones funciona de forma independiente.

---

## Phase 4: User Story 2 - Eliminar mi valoración (Priority: P2)

**Goal**: Eliminar una valoración propia con confirmación y actualizar listas y resumen.

**Independent Test**: Eliminar una valoración desde el perfil público y desde `/perfil`, cancelar y comprobar `404`.

### Tests for User Story 2

- [ ] T013 [P] [US2] Crear pruebas de eliminación, confirmación, cancelación y `404` en `frontend-vue/tests/valoraciones/eliminarValoracion.spec.js`

### Implementation for User Story 2

- [ ] T014 [US2] Añadir la acción de eliminar y la confirmación en `frontend-vue/src/components/valoraciones/FormularioValoracion.vue` y `frontend-vue/src/components/valoraciones/ValoracionItem.vue`
- [ ] T015 [US2] Actualizar listados y resumen tras eliminar en `frontend-vue/src/stores/valoraciones.js` y `frontend-vue/src/views/PerfilPublicoView.vue`
- [ ] T016 [US2] Converger a sin valoración ante `404`, sin error incomprensible en `frontend-vue/src/components/valoraciones/FormularioValoracion.vue` y `frontend-vue/src/components/valoraciones/ValoracionItem.vue`
- [ ] T017 [US2] Asegurar que cancelar no modifica la valoración ni el resumen en `frontend-vue/src/components/valoraciones/FormularioValoracion.vue` y `frontend-vue/src/components/valoraciones/ValoracionItem.vue`

**Checkpoint**: Eliminar valoraciones funciona de forma independiente.

---

## Phase 5: User Story 3 - Consultar mis valoraciones (Priority: P2)

**Goal**: Mostrar valoraciones recibidas y escritas en `/perfil`, con edición y borrado de las escritas.

**Independent Test**: Abrir `/perfil` con recibidas y escritas, paginar, cambiar tamaño, editar una escrita y eliminarla.

### Tests for User Story 3

- [ ] T018 [P] [US3] Crear pruebas de recibidas, escritas, vacío, error, paginación y tamaño en `frontend-vue/tests/valoraciones/valoracionesRecibidas.spec.js` y `frontend-vue/tests/valoraciones/valoracionesEscritas.spec.js`

### Implementation for User Story 3

- [ ] T019 [US3] Implementar `ListaValoraciones` y `ValoracionItem` con autor, destinatario, puntuación, comentario y fecha en `frontend-vue/src/components/valoraciones/`
- [ ] T020 [US3] Implementar `MisValoracionesSection` con listas de recibidas y escritas independientes en `frontend-vue/src/components/valoraciones/MisValoracionesSection.vue`
- [ ] T021 [US3] Integrar `MisValoracionesSection` en `frontend-vue/src/views/PerfilView.vue` sin romper el perfil de 006
- [ ] T022 [US3] Conectar editar con el perfil público del destinatario y el formulario precargado en `frontend-vue/src/components/valoraciones/MisValoracionesSection.vue` y `frontend-vue/src/views/PerfilPublicoView.vue`
- [ ] T023 [US3] Sincronizar `valoracionesRecibidasPagina`, `valoracionesRecibidasLimite`, `valoracionesEscritasPagina` y `valoracionesEscritasLimite` con la URL en `frontend-vue/src/views/PerfilView.vue`
- [ ] T024 [US3] Gestionar estados de carga, vacío, error y reintento de cada lista de forma independiente en `frontend-vue/src/components/valoraciones/MisValoracionesSection.vue`

**Checkpoint**: Las valoraciones del perfil propio funcionan de forma independiente.

---

## Phase 6: User Story 4 - Gestionar valoraciones con teclado o en móvil (Priority: P3)

**Goal**: Garantizar accesibilidad del formulario, listados y confirmación.

**Independent Test**: Recorrer formulario, listados y confirmación solo con teclado y en pantalla de 360 px.

### Tests for User Story 4

- [ ] T025 [P] [US4] Crear pruebas de accesibilidad de valoraciones en `frontend-vue/tests/valoraciones/valoracionesAccessibility.spec.js`

### Implementation for User Story 4

- [ ] T026 [US4] Añadir etiquetas, `role="alert"`, foco inicial y retorno de foco en `frontend-vue/src/components/valoraciones/` y `frontend-vue/src/views/PerfilPublicoView.vue`
- [ ] T027 [US4] Ajustar formulario, listados y confirmación a 360 px en `frontend-vue/src/styles/base.css`
- [ ] T028 [US4] Revisar mensajes en español y ausencia de detalles técnicos en `frontend-vue/src/components/valoraciones/` y `frontend-vue/src/views/PerfilPublicoView.vue`

**Checkpoint**: Valoraciones accesibles y usables en móvil.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Documentación y validación.

- [ ] T029 [P] Actualizar `README.md` y `specs/009-valoraciones/quickstart.md` con las valoraciones y sus límites
- [ ] T030 Ejecutar `npm run test:unit`, `npm run build` y la validación de `specs/009-valoraciones/quickstart.md`
- [ ] T031 Revisar ausencia de comentarios, llamadas directas a `fetch`, moderación y cambios en `backend/`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias.
- **Foundational (Phase 2)**: depende de Setup y bloquea las historias.
- **User Stories (Phase 3–6)**: dependen de Foundational.
- **Polish (Phase 7)**: depende de las historias.

### User Story Dependencies

- **US1 (P1)**: depende de Foundational y del perfil público de 008.
- **US2 (P2)**: depende de US1 para mostrar la valoración propia.
- **US3 (P2)**: depende de US1 y US2 para editar y eliminar desde `/perfil`.
- **US4 (P3)**: depende de US1, US2 y US3.

### Within Each Story

- Las pruebas se escriben antes de la implementación.
- El servicio y la store antes del formulario y los listados.
- El formulario antes de la eliminación.
- Los listados antes de la edición desde `/perfil`.
- La accesibilidad se valida al final.

### Parallel Opportunities

- T002, T005 y T006 pueden ejecutarse en paralelo.
- T007 y T008 pueden ejecutarse en paralelo.
- T019 y T020 comparten listados; deben coordinarse.
- T025 y T027 pueden ejecutarse en paralelo.
- T029 y T030 pueden ejecutarse en paralelo.

---

## Parallel Example: User Story 1

```bash
Task: "Crear pruebas del servicio de valoraciones en frontend-vue/tests/valoraciones/valoracionesService.spec.js"
Task: "Crear pruebas del formulario en frontend-vue/tests/valoraciones/formularioValoracion.spec.js"
```

## Parallel Example: User Story 3

```bash
Task: "Crear pruebas de valoraciones recibidas en frontend-vue/tests/valoraciones/valoracionesRecibidas.spec.js"
Task: "Crear pruebas de valoraciones escritas en frontend-vue/tests/valoraciones/valoracionesEscritas.spec.js"
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Phase 1 y Phase 2.
2. Completar US1.
3. Validar crear, actualizar y precargar.
4. No avanzar a US2 hasta que el formulario funcione.

### Incremental Delivery

1. Setup + Foundational → base de valoraciones.
2. US1 → crear y actualizar.
3. US2 → eliminar.
4. US3 → listados del perfil propio.
5. US4 → accesibilidad y móvil.
6. Polish → documentación y validación.

---

## Notes

- [P] indica archivos distintos y sin dependencia pendiente.
- [US1]–[US4] permiten trazabilidad con la spec.
- Cada historia debe poder validarse de forma independiente.
- Verificar que las pruebas fallan antes de implementar.
- No modificar `backend/`.
- No añadir comentarios al código.
- Sin moderación, respuestas, votos ni valoraciones anónimas.
