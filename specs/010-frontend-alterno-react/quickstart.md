# Quickstart: Frontend alternativo con React

**Feature**: `010-frontend-alterno-react`
**Date**: 2026-11-16

## Prerequisites

- Backend de Clasify arrancado en `http://localhost:3000/clasify_api`.
- Base de datos creada y seed ejecutado.
- Node.js `^20.19.0 || >=22.12.0`.
- Puerto de React permitido por `FRONTEND_ORIGIN`.

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

## Frontend React

```bash
cd frontend-react
npm install
cp .env.example .env
npm run dev
```

Variable de entorno:

```env
VITE_API_URL=http://localhost:3000/clasify_api
```

Si React se ejecuta en `5174` mientras Vue usa `5173`, añadir el origen al `.env` local del backend:

```env
FRONTEND_ORIGIN=http://localhost:5173,http://localhost:4173,http://localhost:5174
```

No se modifica código del backend.

## Test users

| Email | Nombre | Contraseña |
|---|---|---|
| `ana@example.com` | Ana Ruiz | `Clasify123!` |
| `carlos@example.com` | Carlos Díaz | `Clasify123!` |

## Automated checks

```bash
cd frontend-vue
npm run test:unit

cd ../frontend-react
npm run test:unit
npm run build
```

Debe cubrir:

- Login correcto e incorrecto.
- Recuperación de sesión y logout.
- Listado con resultados, vacío y error.
- Paginación y página fuera de rango.
- Borrado solo en anuncios propios.
- Confirmación, cancelación y doble envío.
- Actualización del listado y ajuste de página.
- Errores `401`, `403`, `404` y de conexión.
- Accesibilidad y 360 px.

Prueba de integración opcional contra el backend real:

```bash
cd frontend-react
VALIDACION_BACKEND=1 npx vitest run tests/integracion/backendReal.test.jsx
```

## Manual validation

### 1. Listado público

1. Abrir React sin sesión.
2. Comprobar que aparecen anuncios con título, precio, categoría, estado, fecha e imagen o marcador.

**Expected**: el listado se carga sin pedir login.

### 2. Paginación

1. Avanzar y retroceder por las páginas.

**Expected**: se muestran páginas distintas, sin omitir ni repetir anuncios.

### 3. Login

1. Iniciar sesión con Ana.
2. Recargar la página.

**Expected**: la cabecera muestra a Ana y la sesión se recupera.

### 4. Anuncio propio

1. Iniciar sesión con Ana.
2. Localizar un anuncio de Ana.

**Expected**: aparece la acción de borrar.

### 5. Anuncio ajeno

1. Iniciar sesión con Ana.
2. Localizar un anuncio de Carlos.

**Expected**: no aparece la acción de borrar.

### 6. Crear un anuncio temporal para probar el borrado

Con el backend arrancado, obtener un token y crear un anuncio de Ana:

```bash
TOKEN=$(curl -s -X POST http://localhost:3000/clasify_api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"ana@example.com","password":"Clasify123!"}' \
  | node -pe "JSON.parse(require('fs').readFileSync(0,'utf8')).datos.token")

curl -s -X POST http://localhost:3000/clasify_api/anuncios \
  -H "Authorization: Bearer $TOKEN" \
  -F 'titulo=Anuncio temporal React' \
  -F 'descripcion=Anuncio para probar el borrado del frontend alternativo' \
  -F 'precio=10' \
  -F 'categoria=1'
```

**Expected**: el anuncio temporal aparece en el listado de React.

### 7. Borrado con confirmación

1. Pulsar borrar en el anuncio temporal.
2. Cancelar una vez.
3. Volver a pulsar borrar y confirmar.

**Expected**: al cancelar no cambia nada; al confirmar desaparece del listado y se actualiza la paginación.

### 8. Logout

1. Cerrar sesión.
2. Comprobar que ya no aparece la acción de borrar.

**Expected**: se elimina el token y la interfaz vuelve al estado de visitante.

### 9. Sesión inválida

1. Iniciar sesión.
2. Sustituir el token de `sessionStorage` por uno inválido.
3. Recargar.

**Expected**: se limpia la sesión, se solicita acceso y el listado público sigue disponible.

### 10. Accesibilidad y móvil

1. Recorrer login, listado, paginación y confirmación solo con teclado.
2. Reducir el viewport a 360 px.

**Expected**: foco visible, nombres accesibles y sin scroll horizontal.

### 11. Build

```bash
cd frontend-react
npm run build
```

**Expected**: compilación correcta.

## Registro de validación

Anotar en `docs/validacion.md`:

- comandos ejecutados;
- resultado de Vitest de Vue y React;
- resultado del build;
- recorrido manual con Ana y Carlos;
- resultado del borrado de un anuncio temporal.

## Out of Scope

- Crear, editar o consultar el detalle desde React.
- Favoritos, perfil, mensajería y valoraciones.
- Router y rutas profundas.
- Búsqueda y filtros.
- Tema claro/oscuro.
- Cambios en el backend.
