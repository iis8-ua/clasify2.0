# Quickstart: Estructura común y navegación del frontend

**Feature**: `001-app-shell`  
**Date**: 2026-11-10

## Prerequisites

- Node.js `^20.19.0 || >=22.12.0`; el entorno verificado usa `v26.8.2`.
- npm `>=10`; el entorno verificado usa `11.19.1`.
- Backend de Clasify disponible si se quiere comprobar la configuración de la API, aunque esta
  feature no realiza operaciones de datos.
- Puerto libre para Vite, por defecto `5173`.

## Setup

```bash
cd frontend-vue
npm install
cp .env.example .env
```

Contenido esperado de `.env`:

```env
VITE_API_URL=http://localhost:3000/clasify_api
```

## Run

```bash
npm run dev
```

Abrir la dirección que muestre Vite, normalmente `http://localhost:5173`.

## Build and preview

```bash
npm run build
npm run preview
```

## Automated checks

```bash
npm run test:unit
```

Debe cubrir, como mínimo:

- Tabla de rutas y nombres únicos.
- Orden de `/anuncios/nuevo` antes de `/anuncios/:id`.
- Redirección de rutas protegidas sin sesión.
- Redirección de acceso y registro con sesión.
- Visibilidad de la acción de creación en la cabecera según sesión.
- Estado 404 para rutas desconocidas.
- Normalización de errores HTTP.
- Estados de interfaz: carga, vacío, error, validación, permisos y éxito.
- Confirmación de acciones destructivas.
- Formato de precio, fecha e imagen ausente.
- Navegación por teclado de la cabecera y la página 404.

## Manual validation

### 1. Estructura común

1. Abrir `/`.
2. Comprobar que se ve la cabecera con la marca Clasify, la navegación y la zona de contenido.
3. Comprobar que la entrada activa se identifica.
4. Cambiar el tamaño de la ventana y comprobar que la estructura sigue siendo utilizable.

**Expected**: la estructura no se rompe y la navegación se mantiene legible.

### 2. Rutas directas e historial

1. Abrir directamente `/anuncios/1`.
2. Recargar la página.
3. Usar atrás y adelante del navegador.
4. Abrir una dirección inexistente, por ejemplo `/ruta-inexistente`.

**Expected**: las rutas conocidas muestran su sustitución; la ruta desconocida muestra 404 con una
acción para volver al inicio; atrás y adelante conservan el contexto.

### 3. Rutas protegidas sin sesión

1. Abrir `/anuncios/nuevo`, `/favoritos` o `/perfil` sin sesión.
2. Comprobar que se solicita acceso.
3. Comprobar que la ruta solicitada se conserva para volver después del acceso.

**Expected**: no se muestra contenido privado y la redirección es comprensible.

### 4. Cabecera según sesión

1. Sin sesión, comprobar que se ven las acciones de acceso.
2. Comprobar que no se ve la acción de crear anuncio como disponible.
3. Con una sesión de prueba controlada, comprobar que se ven favoritos, perfil y la acción de crear.
4. Comprobar que la identidad del usuario aparece en la cabecera.

**Expected**: la cabecera cambia de estado sin recargar la aplicación.

### 5. Accesibilidad y móvil

1. Recorrer la cabecera, la navegación y la página 404 solo con teclado.
2. Comprobar que el foco es visible.
3. Reducir el viewport a 360 px de ancho.
4. Comprobar que no hay desplazamiento horizontal no intencionado.
5. Revisar etiquetas, textos alternativos y mensajes de error.

**Expected**: la navegación es comprensible y usable sin ratón y en pantalla estrecha.

### 6. Estados compartidos

1. Ejecutar las pruebas de componentes de estados.
2. Revisar que carga, vacío, error, validación, permisos y éxito se distinguen.
3. Revisar que error y vacío no se confunden.
4. Revisar que una confirmación se puede cancelar sin ejecutar la acción.

**Expected**: todos los estados tienen representación distinta y accesible.

### 7. Build

1. Ejecutar `npm run build`.
2. Ejecutar `npm run preview`.
3. Repetir las comprobaciones principales sobre la vista previa.

**Expected**: la compilación termina sin errores y la aplicación se comporta igual que en desarrollo.

## Out of Scope

- Registro, acceso, listado real, detalle real, CRUD, favoritos y perfil.
- Operaciones contra el backend.
- Modo oscuro.
- Selector de tamaño de página.
- Pruebas de extremo a extremo con navegador automatizado.
