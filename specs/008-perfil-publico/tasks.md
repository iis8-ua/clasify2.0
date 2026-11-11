---

description: "Task list for the 008-perfil-publico feature"
---

# Tasks: Perfil público

**Input**: Design documents from `/specs/008-perfil-publico/`

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

**Purpose**: Confirmar la base de 001–003 y preparar la estructura del perfil público.

- [ ] T001 Confirmar el shell, el tema, las tarjetas, la paginación, el selector de tamaño y los estados en `frontend-vue/src/`
- [ ] T002 [P] Crear la estructura de componentes y pruebas del perfil público en `frontend-vue/src/components/perfil-publico/` y `frontend-vue/tests/perfil-publico/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Servicio, store, ruta y contrato de datos que necesitan las historias.

**⚠️ CRITICAL**: Ninguna historia puede empezar hasta completar esta fase.

- [X] T003 Implementar `perfilPublicoService` con perfil, anuncios y valoraciones recibidas en `frontend-vue/src/services/perfilPublicoService.js`
- [X] T004 Implementar `perfilPublicoStore` con perfil, listas, estados y limpieza por sesión en `frontend-vue/src/stores/perfilPublico.js`
- [X] T005 Crear la ruta pública `/usuarios/:id` y la vista base `PerfilPublicoView` en `frontend-vue/src/router/routes.js` y `frontend-vue/src/views/PerfilPublicoView.vue`
- [X] T006 [P] Añadir la normalización de errores de perfil, anuncios y valoraciones en `frontend-vue/src/services/perfilPublicoService.js` reutilizando `frontend-vue/src/services/errors.js`

**Checkpoint**: La base del perfil público está lista para las historias.

---

## Phase 3: User Story 1 - Consultar el perfil público de un usuario (Priority: P1) 🎯 MVP

**Goal**: Mostrar los datos públicos de un usuario sin email ni información privada.

**Independent Test**: Abrir `/usuarios/:id` y verificar datos, biografía, fecha y resumen; probar inexistente e inválido.

### Tests for User Story 1

- [ ] T007 [P] [US1] Crear pruebas del servicio de perfil público en `frontend-vue/tests/perfil-publico/perfilPublicoService.spec.js`
- [ ] T008 [P] [US1] Crear pruebas de la vista y estados de perfil en `frontend-vue/tests/perfil-publico/perfilPublicoView.spec.js`

### Implementation for User Story 1

- [ ] T009 [US1] Implementar `PerfilPublicoDatos` con nombre, biografía, fecha, resumen y ausencia de biografía en `frontend-vue/src/components/perfil-publico/PerfilPublicoDatos.vue`
- [ ] T010 [US1] Implementar la carga, éxito, no encontrado, error y reintento en `frontend-vue/src/views/PerfilPublicoView.vue`
- [ ] T011 [US1] Asegurar que el perfil no muestra email ni datos privados y que un identificador inválido no rompe la vista en `frontend-vue/src/views/PerfilPublicoView.vue` y `frontend-vue/src/components/perfil-publico/PerfilPublicoDatos.vue`
- [ ] T012 [US1] Reutilizar `StatePanel` y los formatos de fecha en `frontend-vue/src/components/perfil-publico/PerfilPublicoDatos.vue` y `frontend-vue/src/views/PerfilPublicoView.vue`

**Checkpoint**: El perfil público funciona de forma independiente.

---

## Phase 4: User Story 2 - Consultar las valoraciones recibidas (Priority: P2)

**Goal**: Mostrar las valoraciones recibidas de solo lectura con paginación y tamaño.

**Independent Test**: Abrir un perfil con y sin valoraciones y recorrer las páginas.

### Tests for User Story 2

- [ ] T013 [P] [US2] Crear pruebas de valoraciones recibidas, vacío, paginación y tamaño en `frontend-vue/tests/perfil-publico/valoracionesRecibidas.spec.js`

### Implementation for User Story 2

- [ ] T014 [US2] Implementar `ValoracionesRecibidas` con autor, puntuación, comentario, fecha y enlace al perfil del autor en `frontend-vue/src/components/perfil-publico/ValoracionesRecibidas.vue`
- [ ] T015 [US2] Integrar el listado en `frontend-vue/src/views/PerfilPublicoView.vue` con estados de carga, vacío, error y reintento
- [ ] T016 [US2] Sincronizar `paginaValoraciones` y `limiteValoraciones` con la URL y volver a la primera página al cambiar el tamaño en `frontend-vue/src/views/PerfilPublicoView.vue`
- [ ] T017 [US2] Mantener el listado de valoraciones de solo lectura y sin acciones de alta, edición o borrado en `frontend-vue/src/components/perfil-publico/ValoracionesRecibidas.vue`

**Checkpoint**: Las valoraciones recibidas funcionan de forma independiente.

---

## Phase 5: User Story 3 - Consultar los anuncios publicados (Priority: P2)

**Goal**: Mostrar los anuncios del usuario, incluidos los vendidos, con paginación y tamaño.

**Independent Test**: Abrir un perfil con anuncios disponibles y vendidos y comprobar estado y detalle.

### Tests for User Story 3

- [ ] T018 [P] [US3] Crear pruebas de anuncios del perfil, vendidos, vacío, paginación y tamaño en `frontend-vue/tests/perfil-publico/anunciosUsuario.spec.js`

### Implementation for User Story 3

- [ ] T019 [US3] Implementar `AnunciosUsuario` reutilizando tarjetas y categorías en `frontend-vue/src/components/perfil-publico/AnunciosUsuario.vue`
- [ ] T020 [US3] Integrar anuncios en `frontend-vue/src/views/PerfilPublicoView.vue` con estados independientes de valoraciones
- [ ] T021 [US3] Mostrar anuncios vendidos con su estado y enlazar cada uno al detalle en `frontend-vue/src/components/perfil-publico/AnunciosUsuario.vue`
- [ ] T022 [US3] Sincronizar `paginaAnuncios` y `limiteAnuncios` con la URL y volver a la primera página al cambiar el tamaño en `frontend-vue/src/views/PerfilPublicoView.vue`

**Checkpoint**: Los anuncios del perfil funcionan de forma independiente.

---

## Phase 6: User Story 4 - Navegar entre perfiles y acciones públicas (Priority: P3)

**Goal**: Enlazar al perfil desde autor, conversación, valoración y perfil propio, y garantizar accesibilidad.

**Independent Test**: Abrir el perfil desde los cuatro orígenes y recorrerlo con teclado y a 360 px.

### Tests for User Story 4

- [ ] T023 [P] [US4] Crear pruebas de enlaces desde detalle, conversación, valoración y perfil propio en `frontend-vue/tests/perfil-publico/perfilPublicoLinks.spec.js`
- [ ] T024 [P] [US4] Crear pruebas de accesibilidad y responsive en `frontend-vue/tests/perfil-publico/perfilPublicoAccessibility.spec.js`

### Implementation for User Story 4

- [ ] T025 [US4] Enlazar el autor del detalle a `/usuarios/:id` en `frontend-vue/src/views/AnuncioDetalleView.vue`
- [ ] T026 [US4] Enlazar la contraparte de la conversación a `/usuarios/:id` en `frontend-vue/src/components/mensajeria/TarjetaConversacion.vue` y `frontend-vue/src/views/ConversacionView.vue`
- [ ] T027 [US4] Enlazar el autor de una valoración a `/usuarios/:id` en `frontend-vue/src/components/valoraciones/ValoracionItem.vue`
- [ ] T028 [US4] Enlazar el perfil propio a su vista pública en `frontend-vue/src/views/PerfilView.vue`
- [ ] T029 [US4] Revisar etiquetas, foco, teclado, textos alternativos y 360 px en `frontend-vue/src/components/perfil-publico/` y `frontend-vue/src/views/PerfilPublicoView.vue`

**Checkpoint**: El perfil público está conectado y es accesible.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Documentación y validación.

- [ ] T030 [P] Actualizar `README.md` y `specs/008-perfil-publico/quickstart.md` con el perfil público
- [ ] T031 Ejecutar `npm run test:unit`, `npm run build` y la validación de `specs/008-perfil-publico/quickstart.md`
- [ ] T032 Revisar ausencia de comentarios, llamadas directas a `fetch`, datos privados y cambios en `backend/`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias.
- **Foundational (Phase 2)**: depende de Setup y bloquea las historias.
- **User Stories (Phase 3–6)**: dependen de Foundational.
- **Polish (Phase 7)**: depende de las historias.

### User Story Dependencies

- **US1 (P1)**: depende de Foundational; no depende de otras historias.
- **US2 (P2)**: depende de US1 para mostrar el perfil y el resumen.
- **US3 (P2)**: depende de US1; puede avanzar en paralelo con US2.
- **US4 (P3)**: depende de US1, US2 y US3; los enlaces desde otras vistas dependen de 003, 007 y 009.

### Within Each Story

- Las pruebas se escriben antes de la implementación.
- El servicio y la store antes de la vista.
- El perfil antes de las valoraciones y los anuncios.
- La accesibilidad se valida al final.

### Parallel Opportunities

- T002 y T006 pueden ejecutarse en paralelo.
- T007 y T008 pueden ejecutarse en paralelo.
- T013, T018 y T023 pueden ejecutarse en paralelo sobre archivos distintos.
- T025, T026, T027 y T028 tocan archivos distintos y pueden coordinarse.
- T024 y T030 pueden ejecutarse en paralelo.

---

## Parallel Example: User Story 2

```bash
Task: "Crear pruebas de valoraciones recibidas en frontend-vue/tests/perfil-publico/valoracionesRecibidas.spec.js"
Task: "Implementar ValoracionesRecibidas en frontend-vue/src/components/perfil-publico/ValoracionesRecibidas.vue"
```

## Parallel Example: User Story 3

```bash
Task: "Crear pruebas de anuncios del perfil en frontend-vue/tests/perfil-publico/anunciosUsuario.spec.js"
Task: "Implementar AnunciosUsuario en frontend-vue/src/components/perfil-publico/AnunciosUsuario.vue"
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Phase 1 y Phase 2.
2. Completar US1.
3. Validar perfil, inexistente y datos privados.
4. No avanzar a US2 hasta que el perfil funcione.

### Incremental Delivery

1. Setup + Foundational → base del perfil.
2. US1 → datos públicos.
3. US2 → valoraciones recibidas.
4. US3 → anuncios publicados.
5. US4 → enlaces y accesibilidad.
6. Polish → documentación y validación.

---

## Notes

- [P] indica archivos distintos y sin dependencia pendiente.
- [US1]–[US4] permiten trazabilidad con la spec.
- Cada historia debe poder validarse de forma independiente.
- Verificar que las pruebas fallan antes de implementar.
- No modificar `backend/`.
- No añadir comentarios al código.
- El perfil público es de solo lectura.
