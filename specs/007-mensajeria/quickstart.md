# Quickstart: Mensajería

**Feature**: `007-mensajeria`  
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

- Servicio de bandeja, hilo, envío e inicio de conversación.
- Store de mensajería y limpieza por sesión.
- Bandeja con resultados, vacío y error.
- Hilo desde el final y carga de anteriores.
- Modal de contacto y validación del primer mensaje.
- Permisos de participantes y anuncio propio.
- Anuncio vendido con y sin conversación.
- Tamaño de página y URL.
- Accesibilidad y 360 px.

## Manual validation

### 1. Contactar desde un anuncio

1. Iniciar sesión como Ana.
2. Abrir un anuncio de Carlos.
3. Pulsar Contactar y enviar un mensaje.

**Expected**: se abre el hilo y el mensaje aparece.

### 2. Reutilizar conversación

1. Volver al mismo anuncio.
2. Pulsar Contactar o Ver conversación.

**Expected**: se abre el hilo existente; no se crea otro.

### 3. Bandeja

1. Abrir `/mensajes` con Ana y con Carlos.
2. Consultar una conversación con mensajes pendientes.

**Expected**: aparecen anuncio, contraparte, último mensaje y no leídos; al abrir el hilo, los no leídos desaparecen.

### 4. Hilo y respuesta

1. Abrir una conversación.
2. Comprobar que se muestran los últimos mensajes.
3. Cargar anteriores.
4. Enviar una respuesta.

**Expected**: no se omiten ni repiten mensajes; la respuesta aparece sin recargar.

### 5. Anuncio propio

1. Abrir un anuncio de Ana con Ana.

**Expected**: no aparece Contactar.

### 6. Anuncio vendido

1. Marcar un anuncio de Carlos como vendido.
2. Abrir el anuncio con Ana sin conversación previa.

**Expected**: Contactar deshabilitado con aviso.

3. Abrir un anuncio vendido con conversación previa.

**Expected**: el hilo existente se puede abrir y responder.

### 7. Visitante

1. Cerrar sesión.
2. Abrir un anuncio ajeno y pulsar Contactar.
3. Iniciar sesión.

**Expected**: vuelve al anuncio y debe reabrir el modal manualmente.

### 8. Permisos y sesión

1. Intentar abrir una conversación de otra cuenta.

**Expected**: error de permisos sin mensajes.

2. Invalidar el token y abrir `/mensajes`.

**Expected**: se limpia la sesión y se solicita acceso.

### 9. Tamaño y accesibilidad

1. Cambiar el tamaño de página de la bandeja y del hilo.
2. Recorrer bandeja, hilo y formulario solo con teclado.
3. Reducir el viewport a 360 px.

**Expected**: página y tamaño se conservan en la URL; foco visible y sin scroll horizontal.

### 10. Build

```bash
npm run build
```

**Expected**: compilación correcta.

## Registro de validación

Anotar en `docs/validacion.md` los comandos ejecutados, el resultado de Vitest y build y el recorrido manual de bandeja, hilo y contacto.

## Out of Scope

- Tiempo real.
- Adjuntos.
- Notificaciones push o email.
- Conversaciones grupales.
- Búsqueda de mensajes.
- Moderación.
- Cambios en el backend.
