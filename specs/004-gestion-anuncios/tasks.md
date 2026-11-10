---

description: "Task list for the 004-gestion-anuncios feature"
---

# Tasks: Gestión de anuncios

**Input**: Design documents from `/specs/004-gestion-anuncios/`

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

**Purpose**: Confirmar la base de 001–003 y preparar la estructura de gestión.

- [X] T001 Confirmar la base de 001–003, la capa HTTP, la sesión y el catálogo en `frontend-vue/package.json`, sin añadir dependencias nuevas
- [X] T002 [P] Crear la estructura de componentes y pruebas de gestión en `frontend-vue/src/components/anuncios/` y `frontend-vue/tests/gestion/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Servicio, store y componentes compartidos de escritura.

**⚠️ CRITICAL**: Ninguna historia puede empezar hasta completar esta fase.

- [X] T003 [P] Ampliar `anunciosService` con crear, editar, cambiar estado y eliminar en `frontend-vue/src/services/anunciosService.js`
- [X] T004 [P] Ampliar `anunciosStore` con las acciones de escritura y la invalidación de listado/detalle en `frontend-vue/src/stores/anuncios.js`
- [X] T005 [P] Crear el esqueleto y la API del formulario compartido en `frontend-vue/src/components/anuncios/AnuncioForm.vue`, sin lógica de envío
- [X] T006 [P] Crear el control de imagen y la previsualización básica en `frontend-vue/src/components/anuncios/CampoImagen.vue`, sin subida
- [X] T007 Verificar los servicios de Toast y el componente compartido `ConfirmAction` en `frontend-vue/src/App.vue` y `frontend-vue/src/main.js`, sin implementar confirmaciones específicas
- [X] T008 Definir las rutas de creación y edición apuntando a `PlaceholderView` en `frontend-vue/src/router/routes.js`; las vistas reales se conectan en T014 y T021
- [X] T009 Mapear errores de escritura, permisos, imagen y conexión en `frontend-vue/src/services/errors.js`
- [X] T010 Definir la invalidación y actualización de detalle y listado en `frontend-vue/src/stores/anuncios.js`, sin conectar operaciones concretas
- [X] T011 Implementar las reglas de validación compartidas en `frontend-vue/src/components/anuncios/AnuncioForm.vue`; la presentación de errores se completa en T016

**Checkpoint**: La base de gestión está lista para las historias.

---

## Phase 3: User Story 1 - Publicar un anuncio (Priority: P1) 🎯 MVP

**Goal**: Crear un anuncio con datos válidos e imagen opcional desde la cabecera.

**Independent Test**: Iniciar sesión, abrir la creación desde la cabecera, crear un anuncio válido y comprobar que aparece en el detalle y el listado.

### Tests for User Story 1

- [X] T012 [P] [US1] Crear pruebas de creación y validación en `frontend-vue/tests/gestion/crearAnuncio.spec.js`

### Implementation for User Story 1

- [X] T013 [US1] Implementar el modo de creación del formulario en `frontend-vue/src/components/anuncios/AnuncioForm.vue`
- [X] T014 [US1] Implementar la vista de creación en `frontend-vue/src/views/AnuncioCrearView.vue` y sustituir la ruta de creación por esa vista
- [X] T015 [US1] Conectar la creación con el servicio y la store en `frontend-vue/src/views/AnuncioCrearView.vue` y `frontend-vue/src/stores/anuncios.js`
- [X] T016 [US1] Mostrar errores de validación por campo y conservar datos ante fallos en `frontend-vue/src/components/anuncios/AnuncioForm.vue`
- [X] T017 [US1] Implementar la subida y previsualización de una imagen opcional en `frontend-vue/src/components/anuncios/CampoImagen.vue`
- [X] T018 [US1] Mostrar confirmación, abrir el detalle y actualizar el listado tras crear en `frontend-vue/src/views/AnuncioCrearView.vue` y `frontend-vue/src/stores/anuncios.js`
- [X] T019 [US1] Gestionar carga, doble envío, sesión caducada y error de imagen en `frontend-vue/src/components/anuncios/AnuncioForm.vue`

**Checkpoint**: La creación funciona de forma independiente.

---

## Phase 4: User Story 2 - Editar un anuncio (Priority: P1)

**Goal**: Editar solo los campos modificados y la imagen de un anuncio propio.

**Independent Test**: Abrir un anuncio propio, modificar un campo, guardar y comprobar que el detalle y el listado se actualizan. Comprobar que sin cambios no se envía nada.

### Tests for User Story 2

- [X] T020 [P] [US2] Crear pruebas de edición y campos modificados en `frontend-vue/tests/gestion/editarAnuncio.spec.js`

### Implementation for User Story 2

- [X] T021 [US2] Implementar la vista de edición en `frontend-vue/src/views/AnuncioEditarView.vue` y sustituir la ruta de edición por esa vista
- [X] T022 [US2] Precargar los valores actuales del anuncio en `frontend-vue/src/views/AnuncioEditarView.vue` y `frontend-vue/src/components/anuncios/AnuncioForm.vue`
- [X] T023 [US2] Enviar solo los campos modificados y evitar el envío sin cambios en `frontend-vue/src/components/anuncios/AnuncioForm.vue`
- [X] T024 [US2] Permitir sustituir la imagen actual y mostrar la imagen existente en `frontend-vue/src/components/anuncios/CampoImagen.vue`
- [X] T025 [US2] Actualizar detalle y listado y mostrar confirmación tras editar en `frontend-vue/src/views/AnuncioEditarView.vue` y `frontend-vue/src/stores/anuncios.js`
- [X] T026 [US2] Gestionar `403`, `404`, `401`, validación y aviso de cambios sin guardar en `frontend-vue/src/views/AnuncioEditarView.vue` y `frontend-vue/src/components/anuncios/AnuncioForm.vue`

**Checkpoint**: La edición funciona de forma independiente.

---

## Phase 5: User Story 3 - Cancelar una edición sin guardar (Priority: P2)

**Goal**: Descartar cambios y restaurar los valores originales sin realizar ninguna petición.

**Independent Test**: Abrir una edición, modificar campos, cancelar y comprobar que el anuncio mantiene los datos anteriores.

### Tests for User Story 3

- [X] T027 [P] [US3] Crear pruebas de cancelación de edición en `frontend-vue/tests/gestion/cancelarEdicion.spec.js`

### Implementation for User Story 3

- [X] T028 [US3] Implementar la restauración de valores originales y el descarte de imagen en `frontend-vue/src/components/anuncios/AnuncioForm.vue`
- [X] T029 [US3] Solicitar confirmación solo cuando haya cambios sin guardar en `frontend-vue/src/views/AnuncioEditarView.vue`
- [X] T030 [US3] Volver al detalle sin mensaje de éxito y sin modificar el anuncio en `frontend-vue/src/views/AnuncioEditarView.vue`

**Checkpoint**: La cancelación funciona de forma independiente.

---

## Phase 6: User Story 4 - Eliminar un anuncio (Priority: P2)

**Goal**: Eliminar un anuncio propio con confirmación previa y actualización del listado.

**Independent Test**: Abrir un anuncio propio, cancelar la eliminación y confirmarla después; comprobar que solo desaparece al confirmar.

### Tests for User Story 4

- [X] T031 [P] [US4] Crear pruebas de eliminación y confirmación en `frontend-vue/tests/gestion/eliminarAnuncio.spec.js`

### Implementation for User Story 4

- [X] T032 [US4] Implementar el componente de acciones del detalle en `frontend-vue/src/components/anuncios/AccionesAnuncio.vue`
- [X] T033 [US4] Implementar la confirmación de eliminación con el título del anuncio usando `ConfirmAction` en `frontend-vue/src/components/anuncios/AccionesAnuncio.vue`
- [X] T034 [US4] Conectar la eliminación con el servicio, la store y la navegación al listado en `frontend-vue/src/components/anuncios/AccionesAnuncio.vue` y `frontend-vue/src/stores/anuncios.js`
- [X] T035 [US4] Gestionar cancelación, `403`, `404`, `401` y error de conexión en `frontend-vue/src/components/anuncios/AccionesAnuncio.vue`
- [X] T036 [US4] Mostrar las acciones de gestión solo al autor en `frontend-vue/src/components/anuncios/AccionesAnuncio.vue`

**Checkpoint**: La eliminación funciona de forma independiente.

---

## Phase 7: User Story 5 - Cambiar el estado del anuncio (Priority: P3)

**Goal**: Marcar como vendido o disponible desde el detalle, actualizando el catálogo.

**Independent Test**: Marcar un anuncio propio como vendido, comprobar que desaparece del listado por defecto y que sigue accesible por detalle. Volver a disponible y comprobar que reaparece.

### Tests for User Story 5

- [X] T037 [P] [US5] Crear pruebas de cambio de estado en `frontend-vue/tests/gestion/cambiarEstado.spec.js`

### Implementation for User Story 5

- [X] T038 [US5] Implementar la acción de cambiar estado en `frontend-vue/src/components/anuncios/AccionesAnuncio.vue`
- [X] T039 [US5] Solicitar confirmación con `ConfirmAction` solo al marcar como vendido en `frontend-vue/src/components/anuncios/AccionesAnuncio.vue`
- [X] T040 [US5] Actualizar detalle, listado y estado local tras el cambio en `frontend-vue/src/stores/anuncios.js` y `frontend-vue/src/components/anuncios/AccionesAnuncio.vue`
- [X] T041 [US5] Gestionar volver a disponible, `403`, `404` y `401` en `frontend-vue/src/components/anuncios/AccionesAnuncio.vue`

**Checkpoint**: El cambio de estado funciona de forma independiente.

---

## Phase 8: User Story 6 - Gestionar anuncios con teclado o en móvil (Priority: P3)

**Goal**: Garantizar accesibilidad y uso de formularios y confirmaciones a 360 px.

**Independent Test**: Recorrer formularios, acciones y diálogos solo con teclado y en una pantalla de 360 px.

### Tests for User Story 6

- [X] T042 [P] [US6] Crear pruebas de accesibilidad y responsive en `frontend-vue/tests/gestion/gestionAccessibility.spec.js`

### Implementation for User Story 6

- [X] T043 [US6] Asociar etiquetas, errores y descripciones a los campos en `frontend-vue/src/components/anuncios/AnuncioForm.vue` y `CampoImagen.vue`
- [X] T044 [US6] Ajustar formularios y acciones a 360 px en `frontend-vue/src/components/anuncios/AnuncioForm.vue` y `frontend-vue/src/styles/base.css`
- [X] T045 [US6] Asegurar teclado, foco visible, cierre de diálogos y texto alternativo en `frontend-vue/src/components/anuncios/AccionesAnuncio.vue` y `CampoImagen.vue`
- [X] T046 [US6] Revisar mensajes en español y ausencia de detalles técnicos en `frontend-vue/src/components/anuncios/AnuncioForm.vue` y `AccionesAnuncio.vue`

**Checkpoint**: La gestión es accesible y usable en móvil.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Documentación, validación y calidad transversal.

- [X] T047 [P] Actualizar `README.md` con creación, edición, cancelación, eliminación y cambio de estado
- [X] T048 Ejecutar `npm run test:unit` y `npm run build` en `frontend-vue/` y registrar el resultado
- [X] T049 Ejecutar la validación manual de `specs/004-gestion-anuncios/quickstart.md` y registrar el recorrido
- [X] T050 Revisar que no haya comentarios, llamadas directas a `fetch`, acciones en listas, favoritos ni cambios en `backend/` en `frontend-vue/src/`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias.
- **Foundational (Phase 2)**: depende de Setup y bloquea todas las historias.
- **User Stories (Phase 3–8)**: dependen de Foundational.
- **Polish (Phase 9)**: depende de las historias implementadas.

### User Story Dependencies

- **US1 (P1)**: depende de Foundational; no depende de otras historias.
- **US2 (P1)**: depende de Foundational y del formulario compartido; puede integrarse con US1.
- **US3 (P2)**: depende de US2.
- **US4 (P2)**: depende de Foundational y del detalle; puede integrarse con US5.
- **US5 (P3)**: depende de Foundational y del detalle; puede integrarse con US4.
- **US6 (P3)**: depende de US1, US2, US4 y US5.

### Within Each Story

- Las pruebas se escriben antes de la implementación.
- Componentes de formulario antes de las vistas.
- La integración con store y servicio se hace después de los componentes.
- Cada historia se valida antes de pasar a la siguiente.

### Parallel Opportunities

- T003, T004, T005 y T006 pueden ejecutarse en paralelo.
- T013 y T014 pueden ejecutarse en paralelo con cuidado por el formulario compartido.
- T032 y T033 pueden ejecutarse en paralelo con la confirmación.
- T043, T044 y T045 pueden ejecutarse en paralelo sobre archivos distintos.
- Las pruebas de cada historia pueden ejecutarse en paralelo dentro de su fase.

---

## Parallel Example: User Story 1

```bash
Task: "Crear pruebas de creación en frontend-vue/tests/gestion/crearAnuncio.spec.js"
Task: "Implementar el modo de creación del formulario en frontend-vue/src/components/anuncios/AnuncioForm.vue"
```

## Parallel Example: User Story 4

```bash
Task: "Implementar el componente de acciones en frontend-vue/src/components/anuncios/AccionesAnuncio.vue"
Task: "Implementar la confirmación de eliminación en frontend-vue/src/components/anuncios/AccionesAnuncio.vue"
```

## Parallel Example: User Story 6

```bash
Task: "Asociar etiquetas y errores en frontend-vue/src/components/anuncios/AnuncioForm.vue"
Task: "Asegurar teclado y foco en frontend-vue/src/components/anuncios/AccionesAnuncio.vue"
Task: "Ajustar 360 px en frontend-vue/src/styles/base.css"
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Phase 1 y Phase 2.
2. Completar US1.
3. Detenerse y validar la creación.
4. No avanzar a US2 hasta que la creación funcione.

### Incremental Delivery

1. Setup + Foundational → base de gestión.
2. US1 → creación.
3. US2 → edición.
4. US3 → cancelación.
5. US4 → eliminación.
6. US5 → cambio de estado.
7. US6 → accesibilidad y móvil.
8. Polish → README, pruebas y validación manual.

### Parallel Team Strategy

- Una persona completa Setup y Foundational.
- Después, US1 y US2 pueden avanzar en paralelo con cuidado por `AnuncioForm`.
- US4 y US5 comparten `AccionesAnuncio`; deben coordinarse.
- US3 y US6 se integran después de los formularios y acciones.

---

## Notes

- [P] indica archivos distintos y sin dependencia pendiente.
- [US1]–[US6] permiten trazabilidad con la spec.
- Cada historia debe poder validarse de forma independiente.
- Verificar que las pruebas fallan antes de implementar.
- Commit después de cada tarea o grupo lógico.
- Detenerse en cada checkpoint para revisar.
- No modificar `backend/`.
- No añadir comentarios al código.
- Las acciones de gestión se realizan solo desde el detalle.
- La llamada de creación del estado vacío de “Mis anuncios” pertenece a `006-perfil`.

## Phase 10: Convergence

- [X] T051 Normalizar de forma única las respuestas de detalle, creación, edición y cambio de estado para exponer `id_autor`/`id_categoria` desde `autor.id`/`categoria.id`, y adaptar todos los consumidores, per FR-012, FR-019, FR-023, FR-035, SC-009 (missing)
- [X] T052 Corregir la cancelación de creación y edición para pedir confirmación cuando haya cambios y no limpiar `hayCambios` antes de decidir, con pruebas de vista, per FR-018, US3/AC2, management-ui §4/§5 (contradicts)
- [X] T053 Pasar el estado de operación a `ConfirmAction`, mostrar carga y deshabilitar confirmar/cancelar mientras se elimina o cambia estado, con pruebas de doble pulsación, per management-ui §6/§7 (partial)

## Phase 11: Convergence

- [ ] T054 Coordinar la redirección central por `401` con el aviso de cambios sin guardar de creación y edición, de modo que la sesión inválida siempre lleve a login y no deje el formulario privado visible, con prueba de regresión, per 004 FR-016, 002 FR-016 (partial)
- [ ] T055 Alinear el plan de 004 con la implementación de `ConfirmAction` o sustituir el diálogo propio por PrimeVue `ConfirmDialog`, documentando la decisión, per 004 plan (contradicts)
- [ ] T056 Alinear la trazabilidad de las pruebas de 004 con los archivos reales, creando los archivos citados o actualizando las tareas para que apunten a la cobertura existente, per T012/T020/T031/T037 (missing)
