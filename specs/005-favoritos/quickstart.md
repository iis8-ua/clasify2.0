# Quickstart: Favoritos

**Feature**: `005-favoritos`  
**Date**: 2026-11-10

## Prerequisites

- Backend de Clasify arrancado en `http://localhost:3000/clasify_api`.
- Base de datos creada y seed ejecutado.
- Frontend de `001-app-shell`, `002-autenticacion-sesion`, `003-catalogo-anuncios` y
  `004-gestion-anuncios` disponible.
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

- Servicio de añadir, quitar y listar favoritos.
- Normalización de errores de favoritos.
- Store de favoritos: añadir, quitar, cargar, paginación y limpieza de sesión.
- Botón de favorito: estado guardado/no guardado, carga, visitante y autor.
- Lista de favoritos: resultados, vacío, error y tarjetas.
- Paginación de favoritos.
- Página en la URL y corrección de página fuera de rango.
- Accesibilidad del botón, tarjetas y paginación.

## Manual validation

### 1. Añadir un favorito

1. Iniciar sesión con `ana@example.com`.
2. Abrir un anuncio de Carlos.
3. Pulsar el botón de favorito.

**Expected**: el botón cambia a guardado, el número de favoritos aumenta y se muestra confirmación.

### 2. Quitar un favorito

1. Abrir el mismo anuncio de Carlos.
2. Pulsar de nuevo el botón.

**Expected**: el botón cambia a no guardado, el número de favoritos disminuye y se muestra
confirmación.

### 3. Lista de favoritos

1. Guardar varios anuncios de Carlos.
2. Abrir `/favoritos`.

**Expected**: aparecen los anuncios guardados, con título, precio, imagen o marcador, categoría,
estado y fecha. Cada tarjeta abre el detalle.

### 4. Página en la URL

1. Abrir `/favoritos?pagina=1`.
2. Recargar.
3. Intentar abrir una página fuera de rango.

**Expected**: se conserva la página; una página fuera de rango se corrige a la última disponible.

### 5. Anuncio vendido

1. Guardar un anuncio de Carlos.
2. Iniciar sesión como Carlos y marcarlo como vendido.
3. Volver a la lista de favoritos de Ana.

**Expected**: el anuncio sigue apareciendo con el estado vendido.

### 6. Anuncio eliminado

1. Guardar un anuncio de Carlos con Ana.
2. Iniciar sesión como Carlos y eliminar el anuncio.
3. Volver a la lista de favoritos de Ana y recargar.

**Expected**: el anuncio desaparece de la lista. Si se intenta abrir su detalle antes de actualizar,
se muestra no encontrado.

### 7. Visitante

1. Cerrar sesión.
2. Abrir un anuncio ajeno.
3. Pulsar favorito.

**Expected**: se solicita acceso y, tras iniciar sesión, se vuelve al anuncio. El usuario debe pulsar
de nuevo para guardar el favorito.

### 8. Anuncio propio

1. Iniciar sesión con Ana.
2. Abrir un anuncio de Ana.

**Expected**: la acción de favorito no está disponible.

### 9. Quitar desde la lista

1. Abrir la lista de favoritos.
2. Pulsar Quitar en una tarjeta.
3. Confirmar y comprobar el toast.
4. Repetir y cancelar.

**Expected**: al confirmar, la tarjeta desaparece sin recargar; al cancelar, permanece.

### 10. Cerrar sesión

1. Iniciar sesión y abrir `/favoritos`.
2. Cerrar sesión.
3. Intentar volver a `/favoritos`.

**Expected**: la lista se limpia, no se muestran favoritos de la cuenta anterior y se solicita
acceso.

### 11. Sesión caducada

1. Iniciar sesión y abrir `/favoritos`.
2. Invalidar el token en DevTools.
3. Recargar o intentar una operación.

**Expected**: se limpia la sesión y se solicita acceso, sin datos privados obsoletos.

### 12. Estado vacío y error

1. Usar una cuenta sin favoritos.
2. Abrir `/favoritos`.
3. Detener el backend y recargar.

**Expected**: primero se muestra un estado vacío con invitación a explorar; después, un error
comprensible con reintento. Nunca se confunde vacío con error.

### 13. Tamaño de página

1. Abrir `/favoritos`.
2. Cambiar el tamaño entre 10, 20 y 50.
3. Recargar y compartir la URL.

**Expected**: el tamaño se conserva y se vuelve a la primera página al cambiarlo.

### 14. Paginación con datos de prueba

1. Ejecutar las pruebas de paginación de favoritos.
2. Si se dispone de más de 20 favoritos, comprobar los controles en la interfaz.

**Expected**: todas las páginas son accesibles. Con el seed actual, cada usuario solo puede guardar
anuncios del otro usuario, por lo que la paginación de más de 20 se valida con pruebas de componente.

### 15. Accesibilidad y móvil

1. Recorrer el botón, la lista y la paginación solo con teclado.
2. Comprobar foco visible, nombre accesible del botón y textos alternativos.
3. Reducir el viewport a 360 px.
4. Comprobar que no hay desplazamiento horizontal no intencionado.

**Expected**: favoritos es usable con teclado y en pantalla estrecha.

### 16. Build

```bash
npm run build
npm run preview
```

**Expected**: compilación correcta y comportamiento equivalente en la vista previa.

## Out of Scope

- Favoritos compartidos o públicos.
- Notificaciones.
- Acciones masivas.
- Búsqueda, filtros u ordenación personalizada.
- Sincronización entre dispositivos.
- Estado de favorito en el listado general.
- Modo oscuro.
- Cambios en el backend.
