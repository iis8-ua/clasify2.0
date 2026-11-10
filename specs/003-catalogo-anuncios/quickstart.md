# Quickstart: Catálogo de anuncios

**Feature**: `003-catalogo-anuncios`  
**Date**: 2026-11-10

## Prerequisites

- Backend de Clasify arrancado en `http://localhost:3000/clasify_api`.
- Base de datos creada y seed ejecutado.
- Frontend de `001-app-shell` y `002-autenticacion-sesion` disponibles.
- Node.js `^20.19.0 || >=22.12.0`.

## Backend

```bash
cd backend
npm install
cp .env.example .env
npm run db:create-databases
npm run db:schema
npm run db:seed
npm start
```

Comprobación:

```bash
curl http://localhost:3000/clasify_api/salud
```

Expected:

```json
{"datos":{"estado":"ok"}}
```

## Frontend

```bash
cd frontend-vue
npm install
cp .env.example .env
npm run dev
```

`.env`:

```env
VITE_API_URL=http://localhost:3000/clasify_api
```

Abrir `http://localhost:5173`.

## Test data

El seed crea:

- 8 categorías.
- 24 anuncios.
- 22 disponibles y 2 vendidos.
- Con el límite de 20, el listado por defecto tiene 2 páginas: 20 + 2.

## Automated checks

```bash
npm run test:unit
```

Debe cubrir:

- Servicio de listado, detalle y categorías.
- Normalización de errores.
- Store de anuncios: listado, paginación, filtros y detalle.
- Store de categorías y mapa `id → nombre`.
- Query de URL: lectura, escritura, valores por defecto y normalización.
- Cambio de filtro a página 1.
- Página fuera de rango a última página.
- Tarjetas, paginación y estados.
- Accesibilidad básica de listado y detalle.

## Manual validation

### 1. Listado por defecto

1. Abrir `/`.
2. Comprobar que se muestran 20 anuncios disponibles.
3. Comprobar título, precio, imagen o marcador, categoría, estado y fecha.

**Expected**: primera página correcta, sin nombre de autor y con categorías resueltas.

### 2. Segunda página

1. Pulsar siguiente o ir a la página 2.
2. Comprobar que aparecen los anuncios restantes.
3. Volver a la página 1.

**Expected**: 2 páginas; la segunda muestra 2 anuncios disponibles; los controles se deshabilitan en
los extremos.

### 3. Estado vendido

1. Cambiar el filtro de estado a `vendido`.
2. Cambiar a `todos`.

**Expected**: con `vendido` se muestran los 2 anuncios vendidos; con `todos` se muestran los 24.

### 4. Búsqueda por texto

1. Escribir `mesa` en la búsqueda.
2. Pulsar Enter o el botón de buscar.

**Expected**: solo aparecen anuncios cuyo título o descripción coincide; la búsqueda ignora
mayúsculas y acentos.

### 5. Búsqueda sin resultados

1. Buscar un texto que no exista, por ejemplo `zzzzzz`.

**Expected**: estado vacío específico, distinto de un error.

### 6. Filtros combinados

1. Seleccionar una categoría.
2. Seleccionar un orden, por ejemplo precio ascendente.
3. Cambiar de página.

**Expected**: los filtros y el orden se conservan al cambiar de página; al cambiar un filtro se
vuelve a la página 1.

### 7. URL compartible

1. Aplicar texto, categoría, estado, orden y página.
2. Copiar la URL.
3. Abrirla en otra pestaña o recargar.

**Expected**: se recupera el mismo estado del listado.

### 8. Detalle

1. Abrir un anuncio desde el listado.
2. Comprobar título, descripción, precio, estado, imagen, fecha, categoría, autor, biografía,
   valoraciones y número de favoritos.
3. Comprobar que no se muestra el email del autor.
4. Comprobar que no hay acciones de gestión ni de favoritos.

**Expected**: detalle completo y público, sin acciones de otras features.

### 9. URL directa del detalle

1. Abrir `/anuncios/1` directamente.
2. Recargar.
3. Volver al listado.

**Expected**: el detalle se abre y el listado conserva la página y filtros anteriores.

### 10. Anuncio inexistente e identificador inválido

1. Abrir `/anuncios/999999`.
2. Abrir `/anuncios/abc`.

**Expected**: el primero muestra “no encontrado”; el segundo muestra un error comprensible de
identificador inválido. Ninguno rompe la estructura.

### 11. Error de conexión

1. Detener el backend.
2. Recargar el listado.
3. Pulsar reintentar tras arrancar el backend.

**Expected**: error comprensible con reintento; el vacío no se confunde con el error.

### 12. Accesibilidad y móvil

1. Recorrer listado, filtros, paginación y detalle solo con teclado.
2. Comprobar foco visible.
3. Reducir el viewport a 360 px.
4. Comprobar que no hay desplazamiento horizontal no intencionado.
5. Revisar textos alternativos y jerarquía de encabezados.

**Expected**: catálogo usable con teclado y en pantalla estrecha.

### 13. Build

```bash
npm run build
npm run preview
```

**Expected**: compilación correcta y comportamiento equivalente en la vista previa.

## Out of Scope

- Crear, editar, eliminar o cambiar estado.
- Añadir o quitar favoritos.
- Acciones de autor en el detalle.
- Filtros por precio.
- Mapa, recomendaciones o historial de búsquedas.
- Selector de tamaño de página.
- Paginación infinita.
- Modo oscuro.
