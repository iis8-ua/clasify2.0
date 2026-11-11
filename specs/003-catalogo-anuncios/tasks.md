---

description: "Task list for the 003-catalogo-anuncios feature"
---

# Tasks: Catálogo de anuncios

**Input**: Design documents from `/specs/003-catalogo-anuncios/`

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

**Purpose**: Confirmar la base de 001/002 y preparar la estructura del catálogo.

- [X] T001 Confirmar la base de `frontend-vue/package.json`, la capa HTTP y la sesión de 001/002, sin añadir dependencias nuevas
- [X] T002 [P] Crear la estructura de componentes y pruebas de catálogo en `frontend-vue/src/components/catalog/` y `frontend-vue/tests/catalog/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Servicios, stores y query de URL que necesitan todas las historias.

**⚠️ CRITICAL**: Ninguna historia puede empezar hasta completar esta fase.

- [X] T003 [P] Implementar `anunciosService` con listado y detalle en `frontend-vue/src/services/anunciosService.js`
- [X] T004 [P] Implementar `categoriasService` en `frontend-vue/src/services/categoriasService.js`
- [X] T005 Implementar `anunciosStore` con listado, detalle, paginación y filtros en `frontend-vue/src/stores/anuncios.js`
- [X] T006 Implementar `categoriasStore` con mapa `id → nombre` en `frontend-vue/src/stores/categorias.js`
- [X] T007 Implementar lectura y escritura de query de URL en `frontend-vue/src/router/catalogQuery.js`
- [X] T008 Definir las rutas `/` y `/anuncios/:id` apuntando a `PlaceholderView` en `frontend-vue/src/router/routes.js`; las vistas reales se conectan en T015 y T020
- [X] T009 Mapear errores de catálogo a estados de interfaz en `frontend-vue/src/services/errors.js`
- [X] T010 Implementar el contador de solicitud para descartar respuestas obsoletas en `frontend-vue/src/stores/anuncios.js`
- [X] T011 Cargar todas las categorías, recorriendo páginas si es necesario, en `frontend-vue/src/stores/categorias.js`

**Checkpoint**: La base del catálogo está lista para las historias.

---

## Phase 3: User Story 1 - Explorar el listado de anuncios (Priority: P1) 🎯 MVP

**Goal**: Mostrar un listado público con tarjetas y estados de carga, vacío y error.

**Independent Test**: Abrir `/`, comprobar que aparecen anuncios disponibles y que cada tarjeta muestra la información esperada y abre el detalle.

### Tests for User Story 1

- [X] T012 [P] [US1] Crear pruebas del listado y las tarjetas en `frontend-vue/tests/catalog/catalogList.spec.js`

### Implementation for User Story 1

- [X] T013 [P] [US1] Implementar la tarjeta y el badge de estado en `frontend-vue/src/components/catalog/AnuncioCard.vue` y `frontend-vue/src/components/catalog/EstadoAnuncioBadge.vue`
- [X] T014 [P] [US1] Implementar la cuadrícula de anuncios en `frontend-vue/src/components/catalog/AnuncioGrid.vue`
- [X] T015 [US1] Implementar la vista del listado en `frontend-vue/src/views/AnunciosListView.vue` y sustituir la ruta `/` por esa vista
- [X] T016 [US1] Conectar el listado con `anunciosStore` en `frontend-vue/src/views/AnunciosListView.vue` y `frontend-vue/src/stores/anuncios.js`
- [X] T017 [US1] Implementar estados de carga, vacío y error con reintento en `frontend-vue/src/views/AnunciosListView.vue`
- [X] T018 [US1] Resolver el nombre de categoría y evitar el nombre de autor en `frontend-vue/src/components/catalog/AnuncioCard.vue`

**Checkpoint**: El listado funciona de forma independiente.

---

## Phase 4: User Story 2 - Consultar el detalle de un anuncio (Priority: P2)

**Goal**: Mostrar el detalle público completo y gestionar anuncio inexistente o identificador inválido.

**Independent Test**: Abrir un anuncio desde el listado y por URL directa; comprobar todos los datos públicos y los estados de error.

### Tests for User Story 2

- [X] T019 [P] [US2] Crear pruebas del detalle en `frontend-vue/tests/catalog/catalogDetail.spec.js`

### Implementation for User Story 2

- [X] T020 [US2] Implementar la vista de detalle en `frontend-vue/src/views/AnuncioDetalleView.vue` y sustituir la ruta `/anuncios/:id` por esa vista
- [X] T021 [US2] Conectar el detalle con `anunciosStore` en `frontend-vue/src/views/AnuncioDetalleView.vue` y `frontend-vue/src/stores/anuncios.js`
- [X] T022 [US2] Mostrar autor, biografía, categoría y resumen de valoraciones en `frontend-vue/src/views/AnuncioDetalleView.vue`
- [X] T023 [US2] Mostrar número de favoritos y estado de favorito informativo en `frontend-vue/src/views/AnuncioDetalleView.vue`
- [X] T024 [US2] Implementar estados de anuncio no encontrado, identificador inválido y error de conexión en `frontend-vue/src/views/AnuncioDetalleView.vue`

**Checkpoint**: El detalle funciona de forma independiente.

---

## Phase 5: User Story 3 - Recorrer todas las páginas del listado (Priority: P2)

**Goal**: Permitir navegar por todas las páginas y conservar el contexto.

**Independent Test**: Recorrer un listado de varias páginas, comprobar controles, página fuera de rango y conservación de filtros al volver del detalle.

### Tests for User Story 3

- [X] T025 [P] [US3] Crear pruebas de paginación en `frontend-vue/tests/catalog/pagination.spec.js`

### Implementation for User Story 3

- [X] T026 [US3] Implementar los controles de paginación en `frontend-vue/src/components/catalog/PaginacionCatalogo.vue`
- [X] T027 [US3] Sincronizar la página con la URL en `frontend-vue/src/router/catalogQuery.js` y `frontend-vue/src/views/AnunciosListView.vue`
- [X] T028 [US3] Corregir la página fuera de rango a la última disponible en `frontend-vue/src/stores/anuncios.js`
- [X] T029 [US3] Conservar página y filtros al volver desde el detalle en `frontend-vue/src/views/AnunciosListView.vue` y `frontend-vue/src/views/AnuncioDetalleView.vue`

**Checkpoint**: La paginación funciona y conserva el contexto.

---

## Phase 6: User Story 4 - Buscar y filtrar anuncios (Priority: P3)

**Goal**: Permitir búsqueda por texto y filtros por categoría, estado y orden.

**Independent Test**: Aplicar una búsqueda y combinarla con categoría, estado y orden; comprobar resultados, URL, página 1 y estado vacío.

### Tests for User Story 4

- [X] T030 [P] [US4] Crear pruebas de búsqueda, filtros y query en `frontend-vue/tests/catalog/catalogFilters.spec.js`

### Implementation for User Story 4

- [X] T031 [P] [US4] Implementar el panel de filtros en `frontend-vue/src/components/catalog/FiltrosCatalogo.vue`
- [X] T032 [P] [US4] Implementar el selector de categoría en `frontend-vue/src/components/catalog/SelectorCategoria.vue`
- [X] T033 [US4] Implementar la búsqueda al enviar o pulsar Enter en `frontend-vue/src/components/catalog/FiltrosCatalogo.vue`
- [X] T034 [US4] Sincronizar texto, categoría, estado y orden con la URL en `frontend-vue/src/router/catalogQuery.js` y `frontend-vue/src/views/AnunciosListView.vue`
- [X] T035 [US4] Volver a página 1 al cambiar un filtro en `frontend-vue/src/stores/anuncios.js`
- [X] T036 [US4] Implementar limpiar filtros, indicador de filtros activos y estado sin coincidencias en `frontend-vue/src/components/catalog/FiltrosCatalogo.vue` y `frontend-vue/src/views/AnunciosListView.vue`

**Checkpoint**: La búsqueda y los filtros funcionan de forma independiente.

---

## Phase 7: User Story 5 - Leer el catálogo en cualquier dispositivo (Priority: P3)

**Goal**: Garantizar accesibilidad, formatos coherentes y uso a 360 px.

**Independent Test**: Recorrer listado, filtros, paginación y detalle con teclado y en una pantalla de 360 px.

### Tests for User Story 5

- [X] T037 [P] [US5] Crear pruebas de accesibilidad y formatos en `frontend-vue/tests/catalog/catalogAccessibility.spec.js`

### Implementation for User Story 5

- [X] T038 [US5] Hacer accesibles las tarjetas y enlaces con teclado y foco visible en `frontend-vue/src/components/catalog/AnuncioCard.vue` y `frontend-vue/src/components/catalog/AnuncioGrid.vue`
- [X] T039 [US5] Añadir etiquetas y foco visible a filtros y paginación en `frontend-vue/src/components/catalog/FiltrosCatalogo.vue` y `frontend-vue/src/components/catalog/PaginacionCatalogo.vue`
- [X] T040 [US5] Ajustar listado, filtros y detalle a 360 px en `frontend-vue/src/views/AnunciosListView.vue`, `frontend-vue/src/views/AnuncioDetalleView.vue` y `frontend-vue/src/styles/base.css`
- [X] T041 [US5] Aplicar textos alternativos y formatos de precio, fecha e imagen en `frontend-vue/src/components/catalog/AnuncioCard.vue` y `frontend-vue/src/views/AnuncioDetalleView.vue`

**Checkpoint**: El catálogo es accesible y usable en móvil.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Documentación, validación y calidad transversal.

- [X] T042 [P] Actualizar `README.md` con el catálogo, filtros, paginación y datos de ejemplo
- [X] T043 Ejecutar `npm run test:unit` y `npm run build` en `frontend-vue/` y registrar el resultado
- [X] T044 Ejecutar la validación manual de `specs/003-catalogo-anuncios/quickstart.md` y registrar el recorrido
- [X] T045 Revisar que no haya comentarios, llamadas directas a `fetch`, operaciones de gestión ni cambios en `backend/` en `frontend-vue/src/`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias.
- **Foundational (Phase 2)**: depende de Setup y bloquea todas las historias.
- **User Stories (Phase 3–7)**: dependen de Foundational.
- **Polish (Phase 8)**: depende de las historias implementadas.

### User Story Dependencies

- **US1 (P1)**: depende de Foundational; no depende de otras historias.
- **US2 (P2)**: depende de Foundational y del listado; puede integrarse con US1.
- **US3 (P2)**: depende de Foundational y de US1.
- **US4 (P3)**: depende de Foundational, US1 y US3.
- **US5 (P3)**: depende de US1 y US2.

### Within Each Story

- Las pruebas se escriben antes de la implementación.
- Componentes de tarjeta y filtros antes de las vistas.
- La integración con stores y URL se hace después de los componentes.
- Cada historia se valida antes de pasar a la siguiente.

### Parallel Opportunities

- T003, T004, T007 y T009 pueden ejecutarse en paralelo.
- T013 y T014 pueden ejecutarse en paralelo.
- T031 y T032 pueden ejecutarse en paralelo.
- T038, T039 y T041 pueden ejecutarse en paralelo sobre archivos distintos.
- Las pruebas de cada historia pueden ejecutarse en paralelo dentro de su fase.

---

## Parallel Example: User Story 1

```bash
Task: "Implementar la tarjeta de anuncio en frontend-vue/src/components/catalog/AnuncioCard.vue"
Task: "Implementar la cuadrícula de anuncios en frontend-vue/src/components/catalog/AnuncioGrid.vue"
```

## Parallel Example: User Story 4

```bash
Task: "Implementar el panel de filtros en frontend-vue/src/components/catalog/FiltrosCatalogo.vue"
Task: "Implementar el selector de categoría en frontend-vue/src/components/catalog/SelectorCategoria.vue"
```

## Parallel Example: User Story 5

```bash
Task: "Hacer accesibles las tarjetas en frontend-vue/src/components/catalog/AnuncioCard.vue"
Task: "Añadir etiquetas a filtros y paginación en frontend-vue/src/components/catalog/FiltrosCatalogo.vue"
Task: "Aplicar formatos en frontend-vue/src/views/AnuncioDetalleView.vue"
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Phase 1 y Phase 2.
2. Completar US1.
3. Detenerse y validar el listado público.
4. No avanzar a US2 hasta que el listado funcione.

### Incremental Delivery

1. Setup + Foundational → base del catálogo.
2. US1 → listado.
3. US2 → detalle.
4. US3 → paginación.
5. US4 → búsqueda y filtros.
6. US5 → accesibilidad y móvil.
7. Polish → README, pruebas y validación manual.

### Parallel Team Strategy

- Una persona completa Setup y Foundational.
- Después, US1 y US2 pueden avanzar en paralelo con cuidado por las stores compartidas.
- US3 y US4 comparten query y store; deben coordinarse.
- US5 se integra al final sobre las vistas y componentes.

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
- No implementar creación, edición, eliminación, cambio de estado ni acciones de favoritos.

## Phase 9: Convergence

- [X] T046 Rechazar textos de búsqueda de más de 150 caracteres con un mensaje comprensible asociado al campo, sin truncarlos silenciosamente ni ejecutar la búsqueda, con prueba de SC-009, per SC-009, US4/AC9, FR-023 (partial)
- [X] T047 Reutilizar `urlImagen()` de `services/media.js` en `AnuncioCard` y `AnuncioDetalleView`, eliminando la construcción directa de URLs del backend, per Constitución II y plan 003 (contradicts)
- [X] T048 Corregir los contratos y el data-model del detalle para documentar la forma real del backend (`autor.id`, `categoria.id`) y la normalización que hace el frontend, per 003 catalog-api y 004 write-api (contradicts)

## Phase 10: Ampliación de alcance (paginación y detalle)

- [X] T049 Extender `catalogQuery.js`, `anunciosService` y `anunciosStore` con el tamaño de página 10/20/50, su valor por defecto y la vuelta a página 1 al cambiarlo, con pruebas en `frontend-vue/tests/catalog/` per 003 FR-022, FR-036, US3/AC10–AC12 (missing)
- [X] T050 Crear `frontend-vue/src/components/catalog/SelectorTamanoPagina.vue` y conectarlo al listado de `AnunciosListView.vue`, conservando página, tamaño y filtros en la URL, con pruebas per 003 FR-022, FR-036, SC-016 (missing)
- [ ] T051 Crear `frontend-vue/src/components/catalog/CompartirAnuncio.vue` con Web Share API, copia de enlace como alternativa y confirmación perceptible, e integrarlo en `AnuncioDetalleView.vue`, con pruebas per 003 FR-037, FR-038, SC-017 (missing)
- [ ] T052 Crear `frontend-vue/src/components/catalog/AnunciosRelacionados.vue` para anuncios similares y “Más de este vendedor”, con máximo 4, solo disponibles y exclusión del actual, integrado en `AnuncioDetalleView.vue`, con pruebas per 003 FR-039, FR-040, SC-018, SC-019 (missing)
- [ ] T053 Enlazar al perfil público del autor desde `AnuncioDetalleView.vue` y desde la sección “Más de este vendedor”, con pruebas de navegación per 003 FR-041, SC-020 y 008 FR-021 (missing)
- [ ] T054 Actualizar `specs/003-catalogo-anuncios/data-model.md` y `quickstart.md` con tamaño de página, compartir, relacionados, más del vendedor y enlace al perfil público, y registrar la validación manual per 003 data-model/quickstart (partial)
