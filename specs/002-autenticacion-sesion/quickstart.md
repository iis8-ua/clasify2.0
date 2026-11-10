# Quickstart: Registro, acceso y sesión de usuario

**Feature**: `002-autenticacion-sesion`  
**Date**: 2026-11-10

## Prerequisites

- Backend de Clasify arrancado en `http://localhost:3000/clasify_api`.
- Base de datos creada y seed ejecutado.
- Node.js `^20.19.0 || >=22.12.0`.
- npm.
- Frontend de `001-app-shell` implementado o, al menos, su estructura y capa HTTP base.

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

Comprobación rápida:

```bash
curl http://localhost:3000/clasify_api/salud
```

Expected:

```json
{"datos":{"estado":"ok"}}
```

## Frontend setup

```bash
cd frontend-vue
npm install
cp .env.example .env
```

`.env`:

```env
VITE_API_URL=http://localhost:3000/clasify_api
```

## Run

```bash
npm run dev
```

Abrir `http://localhost:5173`.

## Test users

| Email | Nombre | Contraseña |
|---|---|---|
| `ana@example.com` | Ana Ruiz | `Clasify123!` |
| `carlos@example.com` | Carlos Díaz | `Clasify123!` |

## Automated checks

```bash
npm run test:unit
```

Debe cubrir:

- Servicio de registro, acceso y `/auth/yo`.
- Normalización de errores de autenticación.
- Store de sesión: registro, acceso, restauración, logout y códigos de sesión.
- Guardas de rutas protegidas y de acceso/registro.
- Formularios: campos obligatorios, email inválido, nombre largo, contraseña corta, carga y doble envío.
- Asociación de errores de validación al campo.
- Accesibilidad básica de los formularios.
- Limpieza de sesión ante un `401` de sesión.
- Conservación de sesión ante un `CREDENCIALES_INVALIDAS` de formulario.

## Manual validation

### 1. Acceso correcto

1. Abrir `/login`.
2. Introducir `ana@example.com` y `Clasify123!`.
3. Enviar el formulario.

**Expected**: se inicia sesión, la cabecera muestra a Ana y se redirige al listado o a la ruta
solicitada. La acción de crear anuncio aparece.

### 2. Acceso incorrecto

1. Abrir `/login`.
2. Introducir un email válido y una contraseña incorrecta.
3. Enviar.

**Expected**: mensaje general comprensible, sin revelar si el email existe. La sesión no se inicia.

### 3. Registro correcto

1. Abrir `/registro`.
2. Introducir un email nuevo, un nombre y una contraseña de al menos 8 caracteres.
3. Enviar.

**Expected**: se crea la cuenta, se inicia sesión, se muestra confirmación y se redirige al listado.

### 4. Email duplicado

1. Intentar registrar `ana@example.com`.

**Expected**: mensaje asociado al campo `email`; no se crea una cuenta nueva.

### 5. Validaciones del formulario

1. Enviar el registro con email inválido.
2. Enviar con nombre vacío o de más de 100 caracteres.
3. Enviar con contraseña de menos de 8 caracteres.
4. Enviar el acceso con campos vacíos.

**Expected**: errores visibles junto al campo correspondiente y sin envío al backend cuando el
formulario es inválido.

### 6. Persistencia de sesión

1. Iniciar sesión.
2. Recargar la misma pestaña.
3. Comprobar que la cabecera sigue mostrando al usuario y que las acciones privadas siguen
   disponibles.

**Expected**: la sesión se restaura sin volver a pedir credenciales.

### 7. Logout

1. Iniciar sesión.
2. Acceder a una sección privada, por ejemplo `/favoritos`.
3. Cerrar sesión.
4. Volver atrás en el navegador.

**Expected**: la sesión desaparece, no se muestran datos privados y las rutas protegidas vuelven a
solicitar acceso. El cierre afecta a la pestaña actual.

### 8. Ruta protegida y retorno

1. Sin sesión, abrir `/anuncios/nuevo`.
2. Comprobar que redirige a `/login`.
3. Iniciar sesión.

**Expected**: tras el acceso se vuelve a `/anuncios/nuevo`.

### 9. Acceso o registro con sesión

1. Iniciar sesión.
2. Abrir `/login` y `/registro`.

**Expected**: se redirige a una vista principal.

### 10. Sesión inválida

1. Iniciar sesión.
2. En DevTools, sustituir `clasify.session.token` por un valor inválido.
3. Recargar.

**Expected**: la sesión se descarta y se solicita acceso. No se muestran datos privados.

### 11. Error de conexión al comprobar sesión

1. Iniciar sesión.
2. Detener el backend.
3. Recargar la aplicación.

**Expected**: se muestra un estado de error comprensible, no se inventa una sesión válida y se
ofrece reintento. Al arrancar el backend, el reintento restaura la sesión.

### 12. Accesibilidad y móvil

1. Recorrer acceso y registro solo con teclado.
2. Comprobar etiquetas, foco visible y errores accesibles.
3. Reducir el viewport a 360 px.
4. Comprobar que no hay desplazamiento horizontal no intencionado.

**Expected**: ambos formularios son usables con teclado y en pantalla estrecha.

### 13. Doble envío

1. Pulsar dos veces seguidas el botón de acceso o registro.

**Expected**: solo se procesa una operación y el botón se deshabilita mientras está en curso.

## Out of Scope

- Perfil propio y cambio de contraseña.
- Recuperación de contraseña.
- Verificación de email.
- Proveedores externos.
- Refresh tokens.
- Logout en servidor.
- Sincronización entre pestañas.
- Modo oscuro.
