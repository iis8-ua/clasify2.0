# Clasify React

Frontend alternativo de Clasify para el apartado opcional de la Práctica 4. Usa React y Vite sobre
el mismo backend que el frontend principal.

## Alcance

- Listado público paginado de anuncios.
- Login con los usuarios del seed.
- Recuperación de sesión y logout.
- Borrado de anuncios propios con confirmación.
- Estados de carga, vacío y error.
- Accesibilidad y uso a 360 px.

No incluye crear, editar, detalle, favoritos, perfil, mensajería ni valoraciones.

## Requisitos

- Node.js `^20.19.0 || >=22.12.0`.
- Backend de Clasify arrancado.
- Puerto permitido por `FRONTEND_ORIGIN` en el backend.

## Instalación

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

Si React se ejecuta en `5174`, añade ese origen al `.env` local del backend:

```env
FRONTEND_ORIGIN=http://localhost:5173,http://localhost:4173,http://localhost:5174
```

## Pruebas

```bash
npm run test:unit
npm run build
```

Prueba de integración opcional con el backend real:

```bash
VALIDACION_BACKEND=1 npx vitest run tests/integracion/backendReal.test.jsx
```

## Usuarios de prueba

| Email | Nombre | Contraseña |
|---|---|---|
| `ana@example.com` | Ana Ruiz | `Clasify123!` |
| `carlos@example.com` | Carlos Díaz | `Clasify123!` |

## Diferencias con Vue

- Vue usa componentes de un solo archivo, Pinia y Vue Router; React usa componentes de función y
  estado local con hooks.
- Vue usa PrimeVue; React usa HTML y CSS propios.
- La capa de servicios HTTP, autenticación, anuncios y categorías es compartida en `shared/api/`.
- La sesión se guarda en `sessionStorage` con la clave `clasify.react.token`.
- El listado de React no tiene router ni filtros: usa el estado por defecto del backend.

## Limitaciones

- No se puede crear, editar ni consultar el detalle desde React.
- No hay búsqueda ni filtro de estado.
- No se muestran anuncios vendidos porque se usa el listado por defecto del backend.
- El logout es local.
