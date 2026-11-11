# Research: Valoraciones

**Feature**: `009-valoraciones`  
**Date**: 2026-11-11  
**Status**: Complete — no `NEEDS CLARIFICATION` remaining

## Decisions

### 1. Formulario solo en perfil público

**Decision**: crear o editar la valoración únicamente en `/usuarios/:id`, dentro del perfil público de otro usuario.

**Rationale**: la valoración se asocia al usuario valorado y el perfil público es el contexto natural. El detalle ya enlaza al perfil.

**Alternatives considered**:
- Formulario en el detalle del anuncio: duplicaría la acción.
- Formulario en `/perfil`: no hay destinatario.

---

### 2. Puntuación y comentario

**Decision**: puntuación entera obligatoria de 1 a 5; comentario opcional de hasta 500 caracteres.

**Rationale**: coincide con la validación del backend y permite valorar sin texto.

**Alternatives considered**:
- Comentario obligatorio: descartado por fricción y porque el backend lo permite opcional.
- Puntuación decimal: no admitida por el backend.

---

### 3. Crear o actualizar

**Decision**: usar `PUT /usuarios/:id/valoracion`. Si ya existe, se actualiza sin crear duplicados.

**Rationale**: el backend implementa la operación como idempotente y devuelve `201` o `200`.

**Alternatives considered**:
- Separar crear y editar en endpoints distintos: no existen.

---

### 4. Eliminar con confirmación

**Decision**: eliminar la valoración propia con confirmación y actualizar listados y resumen. Un `404` converge a un estado sin valoración.

**Rationale**: es una acción destructiva y el backend devuelve `404` si ya no existe.

**Alternatives considered**:
- Eliminar sin confirmación: descartado por seguridad.
- Mostrar error técnico ante `404`: descartado.

---

### 5. Cualquier usuario autenticado puede valorar

**Decision**: permitir valorar a cualquier otro usuario; la única restricción es no valorarse a sí mismo.

**Rationale**: es la regla del backend y la opción más simple. No se inventa una regla de compra o conversación previa.

**Alternatives considered**:
- Exigir conversación previa: no lo impone el backend y añade lógica de negocio en el frontend.
- Exigir compra: no existe registro de compras.

---

### 6. Perfil propio

**Decision**: mostrar en `/perfil` las valoraciones recibidas y las escritas. Las escritas permiten editar y eliminar.

**Rationale**: completa la reputación y permite gestionar lo publicado sin buscar cada perfil.

**Alternatives considered**:
- Mostrar solo el resumen: insuficiente.
- Mostrar solo las escritas: oculta la reputación recibida.

---

### 7. Editar una valoración escrita

**Decision**: la acción editar navega al perfil público del destinatario con el formulario precargado.

**Rationale**: reutiliza el único formulario de valoración y mantiene el contexto del usuario valorado.

**Alternatives considered**:
- Editar en línea en `/perfil`: duplicaría el formulario.

---

### 8. Paginación

**Decision**: listas de recibidas y escritas independientes, con `valoracionesRecibidasPagina`/`Limite` y `valoracionesEscritasPagina`/`Limite`; 10/20/50 y 20 por defecto.

**Rationale**: evita que cambiar una lista afecte a la otra.

**Alternatives considered**:
- Un único paginador: confuso.
- Paginación infinita: fuera de alcance.

---

### 9. Errores y sesión

**Decision**: `400` por campo, `401` limpia sesión, `404` converge o muestra no encontrado, y los fallos de red conservan datos y permiten reintento.

**Rationale**: sigue la convención de la aplicación.

**Alternatives considered**:
- Mostrar detalles técnicos: descartado.

---

### 10. Pruebas

**Decision**: Vitest cubrirá servicio, store, formulario, listados, borrado, tamaño, permisos y accesibilidad. La validación manual usará Ana y Carlos.

**Rationale**: permite probar alta, actualización, borrado, autoría, visitante, errores y paginación.

**Alternatives considered**:
- Solo manual: descartado por la constitución.

## Open Questions

Ninguna. Todas las decisiones de `Technical Context` están resueltas para la fase de diseño.
