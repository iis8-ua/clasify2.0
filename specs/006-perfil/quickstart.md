# Quickstart: Perfil propio

**Feature**: `006-perfil`  
**Date**: 2026-11-10

## Prerequisites

- Backend de Clasify arrancado en `http://localhost:3000/clasify_api`.
- Base de datos creada y seed ejecutado.
- Frontend de `001-app-shell` a `005-favoritos` disponible.
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

- Servicio de perfil, edición y anuncios propios.
- Normalización de errores de perfil.
- Store de perfil: carga, edición, contraseña y anuncios propios.
- Formulario de datos: validación, cambios y guardado.
- Formulario de contraseña: contraseña actual, longitud mínima y error de credenciales.
- Lista de anuncios propios: resultados, vacío, error y paginación.
- Página en la URL y corrección de página fuera de rango.
- Accesibilidad del perfil, formularios, lista y paginación.
- Limpieza de perfil al cerrar sesión.

## Manual validation

### 1. Consultar el perfil

1. Iniciar sesión con `ana@example.com`.
2. Abrir `/perfil`.

**Expected**: se muestran nombre, email, biografía, fecha de alta y resumen de valoraciones. El
email solo es visible para Ana.

### 2. Editar nombre y biografía

1. Cambiar el nombre o la biografía.
2. Guardar.

**Expected**: se muestra confirmación, el perfil refleja los cambios y la cabecera muestra el nombre
actualizado.

### 3. Email no editable

1. Abrir la edición de datos.
2. Comprobar el email.

**Expected**: el email es informativo y no se puede editar ni enviar.

### 4. Validaciones de datos

1. Enviar con el nombre vacío.
2. Enviar con un nombre de más de 100 caracteres.
3. Enviar con una biografía de más de 500 caracteres.

**Expected**: errores junto al campo correspondiente y sin guardar.

### 5. Cambios sin guardar

1. Modificar el nombre o la biografía.
2. Intentar salir del formulario.

**Expected**: se advierte antes de perder los cambios.

### 6. Cambio de contraseña correcto

1. Usar una cuenta de prueba desechable o crear una nueva.
2. Abrir el cambio de contraseña.
3. Introducir la contraseña actual y una nueva de al menos 8 caracteres.
4. Guardar.
5. Cerrar sesión y acceder con la nueva contraseña.

**Expected**: el cambio se acepta, se muestra confirmación y la nueva contraseña funciona.

### 7. Contraseña actual incorrecta

1. Abrir el cambio de contraseña.
2. Introducir una contraseña actual incorrecta y una nueva válida.
3. Guardar.

**Expected**: error comprensible, la sesión se mantiene y no se pierde el resto del formulario.

### 8. Contraseña nueva demasiado corta

1. Introducir una contraseña nueva de menos de 8 caracteres.

**Expected**: error de validación y sin cambio de contraseña.

### 9. Mis anuncios

1. Abrir la sección de anuncios propios.
2. Comprobar que solo aparecen anuncios del usuario.
3. Abrir el detalle de uno.
4. Comprobar que no hay acciones de gestión en la lista.

**Expected**: la lista solo muestra anuncios propios, abre el detalle y no ofrece acciones directas.

### 10. Anuncios vendidos

1. Marcar un anuncio propio como vendido desde su detalle.
2. Volver a “Mis anuncios”.

**Expected**: el anuncio sigue apareciendo con el estado vendido.

### 11. Página y tamaño en la URL

1. Abrir `/perfil?pagina=1`.
2. Cambiar el tamaño entre 10, 20 y 50.
3. Recargar y compartir la URL.
4. Intentar abrir una página fuera de rango.

**Expected**: se conservan página y tamaño; una página fuera de rango se corrige a la última disponible.

### 12. Enlace al perfil público propio

1. Abrir `/perfil`.
2. Pulsar “Ver mi perfil público”.

**Expected**: se abre `/usuarios/:id` del usuario autenticado.

### 13. Estado vacío y creación

1. Usar una cuenta sin anuncios.
2. Abrir “Mis anuncios”.

**Expected**: estado vacío específico con una acción para crear un anuncio; la acción abre el
formulario de creación de 004.

### 14. Permisos y sesión

1. Cerrar sesión.
2. Intentar abrir `/perfil`.

**Expected**: se solicita acceso. Tras iniciar sesión, se puede abrir el perfil. Al cerrar sesión,
no se muestran datos privados de la cuenta anterior.

### 15. Sesión caducada

1. Abrir el perfil.
2. Invalidar el token en DevTools.
3. Recargar o intentar guardar.

**Expected**: se limpia la sesión y se solicita acceso.

### 16. Accesibilidad y móvil

1. Recorrer perfil, formularios, lista y paginación solo con teclado.
2. Comprobar foco visible, etiquetas y errores accesibles.
3. Reducir el viewport a 360 px.
4. Comprobar que no hay desplazamiento horizontal no intencionado.

**Expected**: el perfil es usable con teclado y en pantalla estrecha.

### 17. Paginación con datos de prueba

1. Ejecutar las pruebas de paginación de anuncios propios.
2. Si se dispone de más de 20 anuncios propios, comprobar los controles en la interfaz.

**Expected**: todas las páginas son accesibles. Con el seed actual, cada usuario tiene 12 anuncios,
por lo que la paginación de más de 20 se valida con pruebas de componente.

### 18. Build

```bash
npm run build
npm run preview
```

**Expected**: compilación correcta y comportamiento equivalente en la vista previa.

## Out of Scope

- Implementación del perfil público; se especifica en 008 y aquí solo se enlaza.
- Avatar o imagen de perfil.
- Eliminación de cuenta.
- Cambio de email y verificación.
- Recuperación de contraseña.
- Autenticación en dos pasos.
- Mensajería y gestión de valoraciones; se especifican en 007 y 009.
- Preferencias de privacidad o notificaciones.
- Historial de actividad.
- Búsqueda, filtros u ordenación de anuncios propios.
