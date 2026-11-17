# Research: Perfil público

**Feature**: `008-perfil-publico`  
**Date**: 2026-11-11  
**Status**: Complete — no `NEEDS CLARIFICATION` remaining

## Decisions

### 1. Ruta pública

**Decision**: `/usuarios/:id`, sin sesión obligatoria.

**Rationale**: el backend ofrece el perfil público con token opcional; la vista debe poder compartirse y abrirse desde el detalle.

**Alternatives considered**:
- Ruta protegida: descartada porque reduce la utilidad pública.
- Modal sin URL: descartado porque no se puede compartir ni recargar.

---

### 2. Datos públicos

**Decision**: mostrar nombre, biografía, fecha de alta y resumen de valoraciones. No mostrar email ni password.

**Rationale**: coincide con la proyección pública del backend y con la constitución.

**Alternatives considered**:
- Mostrar email: prohibido.
- Mostrar datos de la cuenta privada: fuera de alcance.

---

### 3. Valoraciones recibidas de solo lectura

**Decision**: mostrar autor, puntuación, comentario y fecha con paginación. No incluir formulario de valoración en 008.

**Rationale**: la escritura y el borrado se especifican en 009; separa lectura pública de acciones autenticadas.

**Alternatives considered**:
- Incluir formulario en 008: duplicaría 009 y mezclaría alcances.
- Mostrar solo el resumen: insuficiente para interpretar la reputación.

---

### 4. Anuncios publicados

**Decision**: mostrar los anuncios del usuario, incluidos los vendidos, con paginación y estado.

**Rationale**: el backend devuelve todos los anuncios del usuario y el perfil debe reflejar su actividad real.

**Alternatives considered**:
- Ocultar vendidos: descartado para no falsear la actividad.

---

### 5. Dos listados con paginación independiente

**Decision**: usar `paginaAnuncios`/`limiteAnuncios` y `paginaValoraciones`/`limiteValoraciones` en la URL, con 10/20/50 y 20 por defecto.

**Rationale**: las dos listas son independientes y no deben compartir página ni tamaño.

**Alternatives considered**:
- Un único paginador para ambas: confuso y frágil.
- Paginación en memoria: descartada por tamaño.

---

### 6. Enlaces de entrada

**Decision**: enlazar desde autor del anuncio, contraparte de conversación, autor de valoración y perfil propio.

**Rationale**: conecta los puntos donde aparece una persona y evita búsquedas manuales.

**Alternatives considered**:
- Buscador de usuarios: no existe endpoint y queda fuera de alcance.
- Sin enlaces: la vista quedaría aislada.

---

### 7. Errores

**Decision**: `404` para perfil inexistente; estado de red con reintento; listados vacíos independientes.

**Rationale**: un perfil sin valoraciones o sin anuncios no es un error.

**Alternatives considered**:
- Un único estado de error para todo: oculta qué recurso falló.

---

### 8. Accesibilidad y tema

**Decision**: reutilizar `StatePanel`, tarjetas y paginación; aplicar contraste y foco visible en tema claro y oscuro.

**Rationale**: mantiene la coherencia con el shell y el catálogo.

**Alternatives considered**:
- Estilos propios por vista: descartado por duplicación.

---

### 9. Pruebas

**Decision**: Vitest cubrirá servicio, store, vista, valoraciones recibidas, anuncios, tamaño, enlaces y accesibilidad. La validación manual usará Ana y Carlos.

**Rationale**: permite probar perfil existente, inexistente, sin valoraciones, con vendidos y navegación desde los tres orígenes.

**Alternatives considered**:
- Solo manual: descartado por la constitución.

## Open Questions

Ninguna. Todas las decisiones de `Technical Context` están resueltas para la fase de diseño.
