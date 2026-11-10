# Quickstart: Gestión de anuncios

**Feature**: `004-gestion-anuncios`  
**Date**: 2026-11-10

## Prerequisites

- Backend de Clasify arrancado en `http://localhost:3000/clasify_api`.
- Base de datos creada y seed ejecutado.
- Frontend de `001-app-shell`, `002-autenticacion-sesion` y `003-catalogo-anuncios` disponible.
- Node.js `^20.19.0 || >=22.12.0`.
- Una imagen de prueba JPEG, PNG o WebP de menos de 5 MB.

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

- Servicio de creación, edición, cambio de estado y eliminación.
- Normalización de errores de escritura y de imagen.
- Store de anuncios: inserción, actualización, eliminación y cambio de estado.
- Formulario de creación: campos válidos e inválidos.
- Formulario de edición: precarga, solo campos modificados y ausencia de cambios.
- Cancelación con y sin cambios.
- Confirmación de eliminación y de venta.
- Permisos de autor.
- Actualización de detalle y listado.
- Accesibilidad de formularios y diálogos.

## Manual validation

### 1. Crear un anuncio

1. Iniciar sesión con `ana@example.com`.
2. Abrir la acción de crear desde la cabecera.
3. Introducir título, descripción, precio, categoría e imagen opcional.
4. Enviar.

**Expected**: el anuncio se crea, se muestra confirmación y se abre su detalle. El listado lo
incluye sin recargar manualmente.

### 2. Crear sin imagen

1. Repetir la creación sin seleccionar imagen.

**Expected**: el anuncio se crea correctamente y usa el marcador de imagen ausente.

### 3. Validaciones de creación

1. Enviar con título vacío o de más de 150 caracteres.
2. Enviar con descripción vacía o de más de 5000 caracteres.
3. Enviar con precio negativo, con más de dos decimales o superior a 99999999.99.
4. Enviar sin categoría.
5. Enviar una imagen con formato no admitido o de más de 5 MB.

**Expected**: errores junto al campo correspondiente y sin crear el anuncio.

### 4. Imagen

1. Seleccionar una imagen válida.
2. Comprobar la previsualización.
3. Crear el anuncio.
4. Editar el anuncio y sustituir la imagen.

**Expected**: la imagen se sube y se muestra en el detalle; la nueva imagen sustituye a la anterior.
No existe una acción para dejar el anuncio sin imagen.

### 5. Editar un anuncio propio

1. Abrir un anuncio de Ana.
2. Pulsar editar.
3. Cambiar solo el precio.
4. Guardar.

**Expected**: solo se envía el cambio, el detalle y el listado se actualizan y se muestra
confirmación.

### 6. Editar sin cambios

1. Abrir la edición de un anuncio propio.
2. No modificar nada.
3. Intentar guardar.

**Expected**: no se envía ninguna operación de actualización.

### 7. Cancelar edición con cambios

1. Abrir la edición.
2. Modificar un campo o seleccionar una imagen.
3. Pulsar cancelar.
4. Confirmar el descarte.

**Expected**: se restauran los valores originales, se descarta la imagen nueva y no se modifica el
anuncio.

### 8. Cancelar edición sin cambios

1. Abrir la edición sin modificar nada.
2. Pulsar cancelar.

**Expected**: se sale sin confirmación adicional y sin mensaje de éxito.

### 9. Eliminar un anuncio

1. Abrir un anuncio propio.
2. Pulsar eliminar.
3. Cancelar la confirmación.
4. Volver a pulsar eliminar y confirmar.

**Expected**: la cancelación no elimina nada; la confirmación elimina el anuncio, muestra
confirmación y vuelve al listado.

### 10. Cambiar estado a vendido

1. Abrir un anuncio disponible propio.
2. Pulsar marcar como vendido.
3. Confirmar.

**Expected**: el estado cambia a vendido, el anuncio desaparece del listado por defecto y sigue
accesible por su detalle directo.

### 11. Volver a disponible

1. Abrir el anuncio vendido.
2. Pulsar volver a disponible.

**Expected**: el cambio se aplica sin confirmación adicional y el anuncio reaparece en el listado
por defecto.

### 12. Permisos

1. Iniciar sesión con `carlos@example.com`.
2. Abrir un anuncio de Ana.

**Expected**: no se muestran las acciones de editar, eliminar ni cambiar estado. El backend sigue
siendo la autoridad si se intenta una operación no permitida.

### 13. Cambios sin guardar

1. Abrir la creación o edición.
2. Modificar un campo.
3. Intentar navegar fuera.

**Expected**: se advierte antes de perder los cambios.

### 14. Sesión caducada

1. Abrir la edición de un anuncio propio.
2. Invalidar la sesión.
3. Intentar guardar.

**Expected**: se solicita acceso de nuevo y no se muestra información privada obsoleta.

### 15. Accesibilidad y móvil

1. Recorrer formularios, acciones y diálogos solo con teclado.
2. Comprobar foco visible, etiquetas y errores accesibles.
3. Reducir el viewport a 360 px.
4. Comprobar que no hay desplazamiento horizontal no intencionado.

**Expected**: la gestión es usable con teclado y en pantalla estrecha.

### 16. Build

```bash
npm run build
npm run preview
```

**Expected**: compilación correcta y comportamiento equivalente en la vista previa.

## Pending Dependency

La acción contextual del estado vacío de “Mis anuncios” se implementa en la spec `006-perfil`. Esta
feature entrega el formulario, la ruta de creación y la entrada de cabecera.

## Out of Scope

- Favoritos, perfil, mensajería y valoraciones.
- Varias imágenes.
- Eliminar la imagen sin sustituirla.
- Borradores, autoguardado y edición colaborativa.
- Texto enriquecido.
- Acciones masivas.
- Administración de anuncios ajenos.
- Cambios en el backend.
