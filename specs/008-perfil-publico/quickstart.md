# Quickstart: Perfil público

**Feature**: `008-perfil-publico`  
**Date**: 2026-11-11

## Prerequisites

- Backend de Clasify arrancado en `http://localhost:3000/clasify_api`.
- Base de datos creada y seed ejecutado.
- Frontend de 001–003 disponible.
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

## Frontend

```bash
cd frontend-vue
npm install
cp .env.example .env
npm run dev
```

## Test users

| Email | Nombre | Contraseña |
|---|---|---|
| `ana@example.com` | Ana Ruiz | `Clasify123!` |
| `carlos@example.com` | Carlos Díaz | `Clasify123!` |

## Automated checks

```bash
cd frontend-vue
npm run test:unit
npm run build
```

Debe cubrir:

- Servicio de perfil, anuncios y valoraciones.
- Store y estados de carga, vacío, error y no encontrado.
- Datos públicos sin email.
- Valoraciones recibidas y anuncios paginados.
- Tamaño de página y URL independiente.
- Enlaces desde autor, conversación, valoración y perfil propio.
- Accesibilidad y 360 px.

## Manual validation

### 1. Abrir un perfil público

1. Abrir `/usuarios/1` directamente.

**Expected**: se muestran nombre, biografía, fecha de alta y resumen; no se muestra email.

### 2. Acceder desde el detalle

1. Abrir un anuncio de Ana.
2. Pulsar el nombre del autor.

**Expected**: se abre `/usuarios/1`.

### 3. Valoraciones

1. Abrir un perfil con valoraciones.
2. Recorrer las páginas y cambiar el tamaño.

**Expected**: se muestran autor, puntuación, comentario y fecha; página y tamaño se conservan en la URL.

### 4. Anuncios

1. Abrir un perfil con anuncios disponibles y vendidos.
2. Abrir un anuncio.

**Expected**: aparecen todos con su estado; el enlace abre el detalle.

### 5. Estados vacíos

1. Abrir un perfil sin valoraciones.
2. Abrir un perfil sin anuncios.

**Expected**: cada sección muestra su propio estado vacío.

### 6. Perfil inexistente

1. Abrir `/usuarios/999999`.

**Expected**: estado de perfil no encontrado.

### 7. Enlaces desde mensajería y valoraciones

1. Abrir una conversación y pulsar la contraparte.
2. Abrir una valoración y pulsar su autor.

**Expected**: se abre el perfil público correspondiente.

### 8. Accesibilidad y móvil

1. Recorrer el perfil solo con teclado.
2. Reducir el viewport a 360 px.
3. Cambiar el tema claro/oscuro.

**Expected**: foco visible, sin scroll horizontal y contraste correcto.

### 9. Build

```bash
npm run build
```

**Expected**: compilación correcta.

## Out of Scope

- Edición del perfil público.
- Avatar.
- Seguimiento.
- Acciones de valoración; se especifican en 009.
- Mensajería; se especifica en 007.
- Gestión de anuncios.
- Moderación.
- Cambios en el backend.
