# Quickstart: Valoraciones

**Feature**: `009-valoraciones`  
**Date**: 2026-11-11

## Prerequisites

- Backend de Clasify arrancado en `http://localhost:3000/clasify_api`.
- Base de datos creada y seed ejecutado.
- Frontend de 001–003 y perfil público de 008 disponible.
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

- Servicio de listar recibidas, listar escritas, guardar y eliminar.
- Store y limpieza por sesión.
- Formulario con puntuación y comentario.
- Crear, actualizar y eliminar.
- Validación de puntuación y comentario.
- Listados de recibidas y escritas.
- Tamaño de página y URL independiente.
- Permisos y accesibilidad.

## Manual validation

### 1. Crear una valoración

1. Iniciar sesión como Ana.
2. Abrir el perfil público de Carlos.
3. Elegir puntuación 5 y escribir un comentario.
4. Guardar.

**Expected**: aparece confirmación y la valoración en el listado.

### 2. Actualizar una valoración

1. Volver al perfil de Carlos.

**Expected**: el formulario aparece precargado; al cambiar la puntuación se actualiza sin duplicar.

### 3. Eliminar una valoración

1. Pulsar eliminar sobre la valoración propia.
2. Confirmar.

**Expected**: desaparece del listado y se actualiza el resumen.

### 4. Cancelar eliminación

1. Pulsar eliminar y cancelar.

**Expected**: la valoración sigue visible.

### 5. Perfil propio

1. Abrir `/perfil`.
2. Consultar valoraciones recibidas y escritas.
3. Editar una escrita.

**Expected**: se abre el perfil público del destinatario con el formulario precargado.

### 6. Validación

1. Intentar guardar sin puntuación.
2. Introducir un comentario de más de 500 caracteres.
3. Intentar valorarse a sí mismo.

**Expected**: errores comprensibles y ninguna operación enviada.

### 7. Visitante

1. Cerrar sesión.
2. Abrir un perfil público e intentar valorar.
3. Iniciar sesión.

**Expected**: vuelve al perfil público.

### 8. Tamaño y accesibilidad

1. Cambiar el tamaño de las listas de recibidas y escritas.
2. Recorrer formulario, listados y confirmación con teclado.
3. Reducir el viewport a 360 px.

**Expected**: página y tamaño se conservan; foco visible y sin scroll horizontal.

### 9. Build

```bash
npm run build
```

**Expected**: compilación correcta.

## Out of Scope

- Moderación.
- Respuestas a valoraciones.
- Votos de utilidad.
- Valoraciones anónimas.
- Ordenación personalizada.
- Formulario en perfil propio o detalle del anuncio.
- Cambios en el backend.
