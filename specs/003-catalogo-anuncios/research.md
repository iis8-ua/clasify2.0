# Research: Catálogo de anuncios

**Feature**: `003-catalogo-anuncios`  
**Date**: 2026-11-10  
**Status**: Complete — no `NEEDS CLARIFICATION` remaining

## Decisions

### 1. Estado de la URL del catálogo

**Decision**: representar `texto`, `categoria`, `estado`, `orden` y `pagina` en la query de la URL. `limite` no se expone porque es fijo en 20.

**Rationale**: permite recargar, compartir y volver al listado sin perder el contexto. Mantiene una sola fuente de verdad para filtros y paginación.

**Alternatives considered**:
- Guardar filtros solo en memoria: descartado porque se perderían al recargar.
- Incluir `limite` en la URL: descartado porque el tamaño de página es fijo.

---

### 2. Valores por defecto

**Decision**: `pagina=1`, `limite=20`, `estado=disponible` y `orden=fecha_desc`. Los valores por defecto no se muestran en la URL si no aportan contexto.

**Rationale**: coincide con el comportamiento del backend y evita URLs innecesariamente largas.

**Alternatives considered**:
- Mostrar siempre todos los parámetros: descartado por ruido.
- Usar otro orden por defecto: descartado para no divergir del backend.

---

### 3. Búsqueda por texto

**Decision**: aplicar la búsqueda al enviar el formulario o pulsar Enter; no buscar en cada pulsación.

**Rationale**: evita peticiones innecesarias y mantiene la interfaz predecible. La búsqueda sigue siendo accesible por teclado.

**Alternatives considered**:
- Debounce de 300 ms: válido, pero añade temporizadores y pruebas adicionales sin ser necesario.
- Búsqueda instantánea por pulsación: descartada por volumen de peticiones y ruido.

---

### 4. Filtros de categoría, estado y orden

**Decision**: aplicar los filtros al cambiar el control; al cambiar cualquier filtro, volver a página 1.

**Rationale**: los filtros son selecciones discretas y no necesitan confirmación. Reiniciar la página evita mostrar una página vacía por un filtro nuevo.

**Alternatives considered**:
- Aplicar todos los filtros con un botón: descartado por peor experiencia.
- Mantener la página al cambiar de filtro: descartado porque puede quedar fuera de rango.

---

### 5. Tamaño de página fijo en 20

**Decision**: usar 20 elementos por página y no mostrar selector de tamaño.

**Rationale**: es el valor por defecto del backend y reduce la complejidad de la primera versión.

**Alternatives considered**:
- Selector 10/20/50: descartado en esta versión.
- Paginación infinita: descartada porque el alcance exige páginas navegables.

---

### 6. Catálogo de categorías

**Decision**: cargar categorías con `limite=100`; si la respuesta indica más de una página, recorrer las páginas restantes. Guardar un mapa `id → nombre`.

**Rationale**: el listado de anuncios solo devuelve `id_categoria`. El mapa permite mostrar el nombre sin hacer una petición por anuncio.

**Alternatives considered**:
- No mostrar categoría en el listado: descartado porque el contexto aprobó mostrar el nombre.
- Pedir categorías por anuncio: descartado por N+1.
- Codificar categorías: descartado por la constitución.

---

### 7. Página fuera de rango

**Decision**: si la página solicitada supera `paginas`, redirigir a la última página disponible y volver a cargar.

**Rationale**: evita dejar al usuario en una página vacía y mantiene la URL coherente con los datos.

**Alternatives considered**:
- Mostrar un estado vacío con enlace a la primera página: válido, pero menos directo.
- Ignorar el problema: descartado.

---

### 8. Estado de favorito en el detalle

**Decision**: mostrar el número de favoritos y, si hay sesión, si el usuario lo tiene guardado. No se muestra botón de añadir o quitar.

**Rationale**: el detalle pertenece al catálogo; la acción de favoritos se implementa en 005. El estado es informativo y respeta la separación entre features.

**Alternatives considered**:
- Incluir el botón en 003: descartado para no solapar con 005.
- Ocultar el estado de favorito: descartado porque el backend lo devuelve y el usuario puede consultarlo.

---

### 9. Autor en el listado y en el detalle

**Decision**: el listado no muestra nombre de autor; el detalle sí muestra nombre, biografía y resumen de valoraciones.

**Rationale**: el listado solo devuelve `id_autor`; pedir el autor por cada tarjeta produciría N+1. El detalle ya devuelve el autor completo.

**Alternatives considered**:
- Cargar autores por anuncio: descartado por coste y ruido.
- Ocultar autor en el detalle: descartado porque el backend lo devuelve y aporta confianza.

---

### 10. Precio, fechas e imágenes

**Decision**: usar los componentes comunes de 001 para precio, fecha e imagen. El precio se trata como cadena decimal y se formatea en EUR/es-ES. Las imágenes del listado usan carga diferida; las del detalle se cargan de forma prioritaria.

**Rationale**: mantiene coherencia con el shell y evita repetir reglas de formato.

**Alternatives considered**:
- Formatear en cada componente: descartado por duplicación.
- Mostrar el precio bruto: descartado por mala experiencia.

---

### 11. Estado de las stores y respuestas obsoletas

**Decision**: `useAnunciosStore` mantiene estado de listado y detalle, y descarta respuestas de solicitudes anteriores mediante un contador de solicitud.

**Rationale**: evita que una respuesta lenta de un filtro anterior sobrescriba los resultados actuales.

**Alternatives considered**:
- Sin control de carreras: descartado porque los filtros pueden cambiar rápido.
- Cancelar todas las peticiones con `AbortController`: válido, pero el contador es suficiente y más simple.

---

### 12. Estados de interfaz y accesibilidad

**Decision**: reutilizar `StatePanel` de 001 para carga, vacío, error, validación, permisos y éxito. Las tarjetas serán enlaces accesibles; la paginación tendrá etiquetas y foco visible.

**Rationale**: garantiza un lenguaje común y evita que el catálogo invente estados distintos.

**Alternatives considered**:
- Estados propios por vista: descartado por duplicación.
- Tarjetas solo clicables con ratón: descartado por accesibilidad.

---

### 13. Pruebas

**Decision**: Vitest cubrirá servicios, stores, query de URL y componentes clave; la validación manual se hará con los 24 anuncios del seed.

**Rationale**: permite probar contratos, paginación, filtros y estados sin sustituir la comprobación real del catálogo.

**Alternatives considered**:
- Solo pruebas manuales: descartado por la constitución.
- E2E automatizado: se deja para el recorrido manual de la Práctica 4.

## Open Questions

Ninguna. Todas las decisiones de `Technical Context` están resueltas para la fase de diseño.
