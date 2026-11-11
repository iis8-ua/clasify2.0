---

description: "Task list for the 005-favoritos feature"
---

# Tasks: Favoritos

**Input**: Design documents from `/specs/005-favoritos/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Se incluyen tareas de prueba porque el plan y la constitución exigen Vitest para servicios, stores y componentes clave. Las pruebas deben escribirse antes de la implementación correspondiente y fallar primero.

**Organization**: Las tareas se agrupan por historia de usuario para que cada una pueda implementarse y validarse de forma independiente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede ejecutarse en paralelo (archivos distintos, sin dependencias pendientes)
- **[Story]**: Historia de usuario a la que pertenece la tarea (`US1`–`US4`)
- Todas las tareas incluyen la ruta exacta del archivo afectado

## Path Conventions

- Frontend: `frontend-vue/src/` y `frontend-vue/tests/`
- Backend existente: `backend/` (no se modifica)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirmar la base de 001–004 y preparar la estructura de favoritos.

- [X] T001 Confirmar la base de 001–004, la sesión, el catálogo, las tarjetas y la paginación en `frontend-vue/package.json`, sin añadir dependencias nuevas
- [X] T002 [P] Crear la estructura de componentes y pruebas de favoritos en `frontend-vue/src/components/favoritos/` y `frontend-vue/tests/favoritos/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Servicio, store y ruta que necesitan las historias.

**⚠️ CRITICAL**: Ninguna historia puede empezar hasta completar esta fase.

- [X] T003 [P] Implementar `favoritosService` con añadir, quitar y listar en `frontend-vue/src/services/favoritosService.js`
- [X] T004 [P] Implementar `favoritosStore` con estado de lista, operaciones y errores en `frontend-vue/src/stores/favoritos.js`
- [X] T005 Implementar la limpieza de favoritos al cambiar `sessionVersion` en `frontend-vue/src/stores/favoritos.js`
- [X] T006 Configurar la ruta `/favoritos` apuntando a `PlaceholderView` en `frontend-vue/src/router/routes.js`; la vista real se conecta en T016
- [X] T007 [P] Mapear errores de favoritos a estados de interfaz en `frontend-vue/src/services/errors.js`
- [X] T008 Asegurar que `/favoritos` es una ruta protegida en `frontend-vue/src/router/routes.js` y `frontend-vue/src/router/guards.js`

**Checkpoint**: La base de favoritos está lista para las historias.

---

## Phase 3: User Story 1 - Guardar o quitar un anuncio de favoritos (Priority: P1) 🎯 MVP

**Goal**: Añadir o quitar un favorito desde el detalle y reflejar el estado y el contador.

**Independent Test**: Abrir un anuncio ajeno, guardarlo, comprobar el botón y el contador, y quitarlo después.

### Tests for User Story 1

- [X] T009 [P] [US1] Crear pruebas del botón y de añadir/quitar en `frontend-vue/tests/favoritos/botonFavorito.spec.js`

### Implementation for User Story 1

- [X] T010 [US1] Implementar el botón de favorito en `frontend-vue/src/components/favoritos/BotonFavorito.vue`
- [X] T011 [US1] Integrar el botón en el detalle con `es_favorito` y `num_favoritos` en `frontend-vue/src/views/AnuncioDetalleView.vue`
- [X] T012 [US1] Conectar añadir y quitar con la store y el servicio en `frontend-vue/src/components/favoritos/BotonFavorito.vue` y `frontend-vue/src/stores/favoritos.js`
- [X] T013 [US1] Implementar la invitación a acceso para visitantes y el retorno al anuncio en `frontend-vue/src/components/favoritos/BotonFavorito.vue` y `frontend-vue/src/router/guards.js`
- [X] T014 [US1] Gestionar anuncio propio, carga, doble pulsación, `401`, `400` y `404` en `frontend-vue/src/components/favoritos/BotonFavorito.vue`

**Checkpoint**: Añadir y quitar favoritos funciona de forma independiente.

---

## Phase 4: User Story 2 - Consultar mis favoritos (Priority: P2)

**Goal**: Mostrar la lista personal de favoritos con tarjetas, estados y anuncios vendidos.

**Independent Test**: Guardar varios anuncios, abrir `/favoritos` y comprobar que aparecen, se abre el detalle y los vendidos siguen visibles.

### Tests for User Story 2

- [X] T015 [P] [US2] Crear pruebas de la lista de favoritos en `frontend-vue/tests/favoritos/favoritosView.spec.js`

### Implementation for User Story 2

- [X] T016 [US2] Implementar la vista de favoritos en `frontend-vue/src/views/FavoritosView.vue` y sustituir la ruta `/favoritos` por esa vista
- [X] T017 [US2] Reutilizar las tarjetas del catálogo y mostrar el estado vendido en `frontend-vue/src/views/FavoritosView.vue` y `frontend-vue/src/components/catalog/AnuncioCard.vue`
- [X] T018 [US2] Implementar estados de carga, vacío, error y reintento en `frontend-vue/src/views/FavoritosView.vue`
- [X] T019 [US2] Gestionar anuncios eliminados y detalle no encontrado en `frontend-vue/src/views/FavoritosView.vue` y `frontend-vue/src/views/AnuncioDetalleView.vue`
- [X] T020 [US2] Asegurar que la lista solo muestra favoritos propios y no ofrece acción de quitar en `frontend-vue/src/views/FavoritosView.vue`

**Checkpoint**: La lista de favoritos funciona de forma independiente.

---

## Phase 5: User Story 3 - Recorrer todas las páginas de favoritos (Priority: P2)

**Goal**: Permitir navegar por todas las páginas y conservar la página en la URL.

**Independent Test**: Recorrer una lista de favoritos de varias páginas, comprobar controles y página fuera de rango.

### Tests for User Story 3

- [X] T021 [P] [US3] Crear pruebas de paginación con un fixture de más de 20 favoritos en `frontend-vue/tests/favoritos/pagination.spec.js`

### Implementation for User Story 3

- [X] T022 [US3] Reutilizar los controles de paginación del catálogo en `frontend-vue/src/views/FavoritosView.vue` y `frontend-vue/src/components/catalog/PaginacionCatalogo.vue`
- [X] T023 [US3] Sincronizar la página de favoritos con la URL en `frontend-vue/src/views/FavoritosView.vue`
- [X] T024 [US3] Corregir la página fuera de rango a la última disponible en `frontend-vue/src/stores/favoritos.js` y `frontend-vue/src/views/FavoritosView.vue`

**Checkpoint**: La paginación de favoritos funciona y conserva la página.

---

## Phase 6: User Story 4 - Gestionar favoritos con teclado o en móvil (Priority: P3)

**Goal**: Garantizar accesibilidad del botón, tarjetas y paginación, y uso a 360 px.

**Independent Test**: Recorrer botón, lista y paginación solo con teclado y en una pantalla de 360 px.

### Tests for User Story 4

- [X] T025 [P] [US4] Crear pruebas de accesibilidad de favoritos en `frontend-vue/tests/favoritos/favoritosAccessibility.spec.js`

### Implementation for User Story 4

- [X] T026 [US4] Añadir nombre accesible, estado y foco visible al botón en `frontend-vue/src/components/favoritos/BotonFavorito.vue`
- [X] T027 [US4] Asegurar teclado y foco en tarjetas y paginación en `frontend-vue/src/views/FavoritosView.vue` y `frontend-vue/src/components/catalog/PaginacionCatalogo.vue`
- [X] T028 [US4] Ajustar la lista y la paginación a 360 px en `frontend-vue/src/views/FavoritosView.vue` y `frontend-vue/src/styles/base.css`
- [X] T029 [US4] Revisar mensajes en español y ausencia de detalles técnicos en `frontend-vue/src/components/favoritos/BotonFavorito.vue` y `frontend-vue/src/views/FavoritosView.vue`

**Checkpoint**: Favoritos es accesible y usable en móvil.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Documentación, validación y calidad transversal.

- [X] T030 [P] Actualizar `README.md` con la gestión de favoritos y sus limitaciones
- [X] T031 Ejecutar `npm run test:unit` y `npm run build` en `frontend-vue/` y registrar el resultado
- [X] T032 Ejecutar la validación manual de `specs/005-favoritos/quickstart.md` y registrar el recorrido
- [X] T033 Revisar que no haya comentarios, llamadas directas a `fetch`, favoritos en el listado general, acciones de quitar en la lista ni cambios en `backend/` en `frontend-vue/src/`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias.
- **Foundational (Phase 2)**: depende de Setup y bloquea todas las historias.
- **User Stories (Phase 3–6)**: dependen de Foundational.
- **Polish (Phase 7)**: depende de las historias implementadas.

### User Story Dependencies

- **US1 (P1)**: depende de Foundational; no depende de otras historias.
- **US2 (P2)**: depende de Foundational y de US1 para el estado del favorito.
- **US3 (P2)**: depende de US2.
- **US4 (P3)**: depende de US1, US2 y US3.

### Within Each Story

- Las pruebas se escriben antes de la implementación.
- El botón antes de la integración en el detalle.
- La vista antes de la paginación y la accesibilidad.
- Cada historia se valida antes de pasar a la siguiente.

### Parallel Opportunities

- T003, T004 y T007 pueden ejecutarse en paralelo.
- T010 y T011 pueden coordinarse; T011 depende del botón.
- T016 y T017 comparten la vista y la tarjeta; deben coordinarse.
- T026, T027 y T028 pueden ejecutarse en paralelo sobre archivos distintos.
- Las pruebas de cada historia pueden ejecutarse en paralelo dentro de su fase.

---

## Parallel Example: User Story 1

```bash
Task: "Crear pruebas del botón en frontend-vue/tests/favoritos/botonFavorito.spec.js"
Task: "Implementar el botón de favorito en frontend-vue/src/components/favoritos/BotonFavorito.vue"
```

## Parallel Example: User Story 2

```bash
Task: "Crear pruebas de la lista en frontend-vue/tests/favoritos/favoritosView.spec.js"
Task: "Implementar la vista de favoritos en frontend-vue/src/views/FavoritosView.vue"
```

## Parallel Example: User Story 4

```bash
Task: "Añadir nombre accesible al botón en frontend-vue/src/components/favoritos/BotonFavorito.vue"
Task: "Asegurar teclado en la lista y paginación en frontend-vue/src/views/FavoritosView.vue"
Task: "Ajustar 360 px en frontend-vue/src/styles/base.css"
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Phase 1 y Phase 2.
2. Completar US1.
3. Detenerse y validar añadir/quitar favoritos.
4. No avanzar a US2 hasta que el botón funcione.

### Incremental Delivery

1. Setup + Foundational → base de favoritos.
2. US1 → botón y operaciones.
3. US2 → lista de favoritos.
4. US3 → paginación.
5. US4 → accesibilidad y móvil.
6. Polish → README, pruebas y validación manual.

### Parallel Team Strategy

- Una persona completa Setup y Foundational.
- US1 y US2 pueden avanzar con coordinación en la store y el detalle.
- US3 y US4 se integran después de la lista.

---

## Notes

- [P] indica archivos distintos y sin dependencia pendiente.
- [US1]–[US4] permiten trazabilidad con la spec.
- Cada historia debe poder validarse de forma independiente.
- Verificar que las pruebas fallan antes de implementar.
- Commit después de cada tarea o grupo lógico.
- Detenerse en cada checkpoint para revisar.
- No modificar `backend/`.
- No añadir comentarios al código.
- La acción de quitar solo se ofrece en el detalle.

## Phase 8: Convergence

- [X] T034 Corregir la detección de autoría de `BotonFavorito` usando el detalle normalizado o `autor.id`, ocultar la acción en anuncios propios y probar con el payload real del backend, per FR-009, US1/AC7, SC-004 (partial)
- [X] T035 Alinear las props y eventos de `BotonFavorito` con `contracts/favoritos-ui.md` o actualizar el contrato aprobado, con prueba de contrato, per favoritos-ui §1 (contradicts)
- [X] T036 Secuenciar las cargas de páginas de favoritos con token de solicitud o cancelación para evitar que respuestas antiguas pisen la página nueva, con prueba de respuestas fuera de orden, per FR-016, SC-008 (partial)
- [X] T037 Normalizar a página 1 una URL de favoritos fuera de rango cuando `paginas` sea 0, con prueba para usuario sin favoritos, per FR-017 (partial)

## Phase 9: Convergence

- [X] T038 Reconciliar `research.md`, el contrato de UI y `BotonFavorito`: documentar la variante final de props/eventos y la responsabilidad de la store, per 005 research y favoritos-ui (contradicts)

## Phase 10: Convergence

- [X] T039 CRITICAL: Documentar la evidencia de comprobaciones exigida por la Constitución VIII en un registro de validación del proyecto con los comandos ejecutados, el entorno y el resultado obtenido para backend, frontend y build, y el recorrido manual (acceso, creación, listado, detalle, edición, eliminación, cierre de sesión, favoritos y perfil) con pasos, datos, resultados esperados y resultados obtenidos, per Constitution VIII y T031/T032 (missing)
- [X] T040 Distinguir el `200` de añadir un favorito ya existente y no incrementar `num_favoritos` en ese caso, exponiendo el estado HTTP en la capa HTTP o recargando el detalle, con prueba del caso, per FR-007, US1/AC4 (partial)
- [X] T041 Evitar que «Volver al listado» del detalle regrese al formulario tras crear o editar, usando `router.replace` al abrir el detalle o un retorno explícito al listado, con prueba de navegación, per 003 FR-007 y catalog-ui §3 (partial)
- [X] T042 Alinear la jerarquía de encabezados de catálogo y favoritos para no saltar de `h1` a `h3` en las tarjetas, con prueba de accesibilidad, per 003 FR-030 y 001 FR-019 (partial)
- [X] T043 Retirar `PlaceholderView.vue` si ya no tiene rutas que lo usen o documentar su propósito restante, per 001 FR-025 y plan de 001 (unrequested)

## Phase 11: Convergence

- [X] T044 Documentar en el contrato HTTP de 001 la opción `conEstado` y el retorno `{ estado, datos }` para las respuestas 2xx y 204, o eliminar esa opción y resolver la distinción 200/201 en el servicio de favoritos, per 001 http-contract §2/§4 y T040 (contradicts)
- [X] T045 Alinear el árbol de pruebas del plan de 003 con los archivos reales (`catalogList`, `catalogDetail`, `catalogFilters` y `catalogAccessibility`) en lugar de `catalogView.spec.js`, per 003 plan y T012/T019/T037 (partial)
- [X] T046 Alinear el árbol de código del plan de 001 con el estado final: `PlaceholderView.vue` retirado y `src/assets/` sin uso, per 001 plan y T043 (partial)
- [X] T047 Hacer idempotente la prueba de integración con el backend real, eligiendo un anuncio sin favorito previo y eliminando únicamente el favorito que crea, per Constitution VIII y T039 (partial)

## Phase 12: Convergence

- [X] T048 CRITICAL: Limpiar los datos privados de `anunciosStore` (detalle con `conversacion`, `ultimos_mensajes` y `num_mensajes`) al cambiar `sessionVersion`, integrándolo en `main.js` como favoritos y perfil, con prueba de cierre de sesión, per Constitution V, 005 FR-022 y 002 FR-014/FR-017 (missing)
- [X] T049 CRITICAL: Invalidar las respuestas en vuelo de `perfilStore.cargarPerfil`, `perfilStore.actualizarPerfil` y `anunciosStore.cargarDetalle` al cerrar sesión o cambiar de cuenta, mediante token de solicitud o comprobación de sesión, con prueba de respuesta tardía, per Constitution V, 005 FR-021, 002 FR-017 y 006 FR-026 (partial)
- [X] T050 Añadir pruebas de fallo de conexión al añadir y quitar favorito, de la confirmación perceptible y de la actualización de la lista tras la operación, per 005 FR-018, FR-020, FR-026 y Constitution VIII (missing)
- [X] T051 Mover el foco al primer campo con error de servidor en `PerfilForm` y `CambioContrasenaForm`, con pruebas, per 006 FR-023 y 006 T043 (partial)
- [X] T052 Diferenciar el texto de progreso de añadir y quitar (`Añadiendo…`/`Quitando…`) y exponer el estado en curso con `aria-busy`, con prueba durante la operación, per 005 FR-019 y Constitution VI (partial)
- [X] T053 Alinear el árbol de pruebas de `specs/005-favoritos/plan.md` con los archivos reales, incluyendo `favoritosAccessibility.spec.js`, per 005 plan (partial)

## Phase 13: Convergence

- [X] T054 CRITICAL: Completar la accesibilidad de `LoginForm`, `RegisterForm` y `AnuncioForm`: indicar los campos obligatorios con `required`, `aria-required` y texto visible, anunciar los errores de campo con `role="alert"` y mover el foco al primer campo inválido tras el envío, con pruebas, per Constitution VI, 002 FR-019 y 004 FR-029 (missing)
- [X] T055 Corregir la página solicitada solo cuando la carga haya sido correcta en `FavoritosView`, `MisAnunciosSection` y `AnunciosListView`, conservando la página en la URL y permitiendo reintentar la página actual cuando falle, con pruebas, per 005 FR-015, US3/AC6, 003 FR-008 y 006 FR-020 (partial)
- [X] T056 Limpiar también los errores del servidor al descartar cambios en `PerfilForm` y `PerfilView`, con prueba, per 006 FR-013 y Constitution VI (partial)

## Phase 14: Ampliación de alcance (retirada desde lista y tamaño)

- [X] T057 Crear `frontend-vue/src/components/favoritos/BotonQuitarFavorito.vue` con confirmación, estado de carga, nombre accesible, toast y emisión del anuncio retirado, con pruebas en `frontend-vue/tests/favoritos/` per 005 FR-032, US2/AC10–AC11 (missing)
- [X] T058 Integrar `BotonQuitarFavorito` en las tarjetas de `FavoritosView.vue`, retirar el elemento de la lista sin recargar y corregir la página si queda vacía, con pruebas de lista y navegación per 005 FR-018, FR-032, FR-035 (missing)
- [X] T059 Añadir el tamaño de página 10/20/50 a `favoritosService`, `favoritosStore` y `FavoritosView.vue`, conservarlo en la URL y volver a página 1 al cambiarlo, con pruebas per 005 FR-014, FR-033, FR-034, SC-021–SC-022 (missing)
- [X] T060 Ajustar `data-model.md` y `quickstart.md` de 005 a la retirada desde la tarjeta y al tamaño de página, y cubrir accesibilidad y validación manual de ambos cambios per 005 data-model/quickstart y US4 (partial)

## Phase 15: Convergence

- [X] T061 CRITICAL: Generar identificadores únicos y válidos para cada instancia de `SelectorTamanoPagina` y de las listas de valoraciones, evitando IDs con espacios o repetidos, y cubrirlo con pruebas de accesibilidad en `frontend-vue/src/components/catalog/SelectorTamanoPagina.vue` y `frontend-vue/src/components/valoraciones/ListaValoraciones.vue`, per 001 FR-019 y Constitution VI (partial)
- [X] T062 Conservar la página del hilo en la URL y recuperar anuncio y contraparte al abrir una conversación directamente, sin depender de que la bandeja se haya cargado antes, con pruebas en `frontend-vue/src/views/ConversacionView.vue` y `frontend-vue/src/stores/mensajes.js`, per 007 FR-028 y `mensajeria-ui.md` §3 (partial)
- [X] T063 Normalizar y corregir las páginas fuera de rango de valoraciones recibidas y escritas en `frontend-vue/src/components/valoraciones/MisValoracionesSection.vue`, conservando el tamaño en la URL, con pruebas, per 009 FR-024 y FR-026 (partial)
- [X] T064 Mostrar el estado vacío al retirar el último favorito de la primera página en `frontend-vue/src/views/FavoritosView.vue`, con prueba del caso, per 005 FR-015 y FR-035 (partial)

## Phase 16: Convergence

- [X] T065 Recalcular la paginación de favoritos o recargar la lista después de retirar una tarjeta, de modo que `total` y `paginas` reflejen el nuevo estado y los controles no queden obsoletos, con pruebas de retirada en una lista que cruza el límite de página, per 005 FR-016, FR-018 y FR-035 (partial)
