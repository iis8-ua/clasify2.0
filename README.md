# Clasify

Aplicación web de anuncios clasificados al estilo de Wallapop o Milanuncios.
Este repositorio contiene el backend REST de la Práctica 1 y el frontend Vue de
la Práctica 4.

- **Backend**: Node.js + Express 5 + MySQL (`mysql2`), autenticación JWT, hash de
  contraseñas con bcrypt y subida de imágenes con multer.
- **Frontend**: Vue 3 + Vite + Pinia + Vue Router + PrimeVue, en `frontend-vue/`.

La documentación de diseño del backend está en [`Diseno.md`](Diseno.md). La
documentación SDD del frontend se genera con Spec Kit en `specs/`.

## Estructura

```text
.
├── backend/
│   ├── src/
│   │   ├── routes/          # Rutas REST
│   │   ├── services/        # Lógica de negocio y acceso a datos
│   │   ├── middleware/      # Autenticación, validación, errores y subidas
│   │   ├── helpers/         # Paginación y proyecciones SQL
│   │   └── db/              # Esquema, seed y scripts de base de datos
│   ├── tests/               # Jest + Supertest
│   └── uploads/             # Imágenes subidas (no se versionan)
├── frontend-vue/            # Frontend Vue (Práctica 4)
├── specs/                   # Especificaciones SDD de Spec Kit
├── Diseno.md                # Diseño del backend (Práctica 1)
└── README.md
```

## Requisitos

- Node.js >= 20.6
- npm
- MySQL 8

## Puesta en marcha del backend

```bash
cd backend
cp .env.example .env
npm install
```

Edita `backend/.env` y ajusta al menos:

```env
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_contraseña
JWT_SECRET=un_secreto_aleatorio_largo
```

Puedes generar un secreto con:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Crea las bases de datos, el esquema y los datos de ejemplo:

```bash
npm run db:create-databases
npm run db:schema
npm run db:seed
```

> `db:create-databases` necesita un usuario MySQL con permiso `CREATE`. Si tu
> usuario no lo tiene, crea a mano las bases `clasify` y `clasify_test` con
> `utf8mb4_unicode_ci` y ejecuta después `db:schema` y `db:seed`.

Arranca el servidor:

```bash
npm start        # producción
npm run dev      # recarga automática con node --watch
```

La API queda en `http://localhost:3000/clasify_api`. Comprobación rápida:

```bash
curl http://localhost:3000/clasify_api/salud
# {"datos":{"estado":"ok"}}
```

## Usuarios y datos de prueba

El seed crea dos usuarios con la contraseña fija **`Clasify123!`**:

| Email | Nombre |
|---|---|
| `ana@example.com` | Ana Ruiz |
| `carlos@example.com` | Carlos Díaz |

También crea 8 categorías y 24 anuncios repartidos entre los dos usuarios, con
precios, categorías, fechas y estados variados. Con el límite por defecto (20)
el listado tiene dos páginas, y dos anuncios están vendidos para poder probar
`?estado=vendido` y `?estado=todos`.

El seed es idempotente: se puede ejecutar varias veces sin duplicar filas. Los
anuncios usan ids fijos; si quieres volver a crearlos desde cero, borra la tabla
`anuncios` y vuelve a lanzar `npm run db:seed`.

## Tests del backend

```bash
cd backend
npm test
```

Los tests usan la base `clasify_test` (`DB_TEST_NAME` en `.env`). `npm run
db:create-databases` ya la crea; el esquema lo preparan los propios tests.

Cubren autenticación, anuncios, validación, permisos, favoritos, mensajería,
valoraciones y CORS.

## Frontend Vue

El frontend está en `frontend-vue/` y usa Vue 3, Vite, Pinia, Vue Router,
PrimeVue y `fetch`. La base común, la autenticación, el catálogo y la gestión de
anuncios están implementados; el resto de vistas se incorporan con las
especificaciones de `specs/`.

Requisitos:

- Node.js `^20.19.0 || >=22.12.0`.
- npm.
- Backend arrancado para las operaciones reales.

Instalación y arranque:

```bash
cd frontend-vue
npm install
cp .env.example .env
npm run dev
```

Variable de entorno del frontend:

```env
VITE_API_URL=http://localhost:3000/clasify_api
```

Pruebas y build:

```bash
npm run test:unit
npm run build
npm run preview
```

Las imágenes se sirven desde `http://localhost:3000/clasify_api/uploads/<fichero>`.

Las rutas cuyas vistas aún no se han implementado muestran una vista de
sustitución accesible. Los favoritos y el perfil se incorporan en las
especificaciones `specs/005` y `specs/006`.

### Autenticación

- Registro y acceso contra `POST /auth/register` y `POST /auth/login`.
- Recuperación de sesión con `GET /auth/yo`.
- Token en `sessionStorage` con la clave `clasify.session.token`.
- Cierre de sesión local y limpieza de datos privados.
- Redirección a la ruta solicitada después del acceso.
- Sesión por pestaña, sin refresh token ni sincronización entre pestañas.
- Usuarios de prueba: `ana@example.com` y `carlos@example.com`, contraseña
  `Clasify123!`.

### Catálogo

- Listado público paginado con 20 anuncios por página.
- Búsqueda por texto, filtros por categoría y estado, y ordenación.
- Detalle público con autor, categoría, valoraciones y número de favoritos.
- Página y filtros conservados en la dirección.
- Estados de carga, vacío, error, no encontrado e identificador inválido.
- Las acciones de gestión y de favoritos se incorporan en `004` y `005`.

### Gestión de anuncios

- Crear anuncio desde la cabecera.
- Editar solo los campos modificados.
- Cancelar la edición sin guardar.
- Eliminar con confirmación.
- Cambiar entre disponible y vendido.
- Subida de una imagen JPEG, PNG o WebP de hasta 5 MB.
- Aviso de cambios sin guardar.
- Acciones de gestión únicamente en el detalle y solo para el autor.
- La acción de creación del estado vacío de “Mis anuncios” se completa en `006`.

### CORS

El backend permite por defecto los orígenes de Vite:

```env
FRONTEND_ORIGIN=http://localhost:5173,http://localhost:4173
```

Si el frontend se sirve desde otro origen, añádelo a esa lista y reinicia el
backend.

## API

El prefijo de todas las rutas es `/clasify_api`. Las rutas principales:

- `POST /auth/login`, `GET /auth/yo`
- `GET /anuncios`, `GET /anuncios/:id`
- `POST /anuncios`, `PATCH /anuncios/:id`, `PATCH /anuncios/:id/estado`, `DELETE /anuncios/:id`
- `GET /categorias`
- `GET /usuarios/me`, `PATCH /usuarios/me`, `GET /usuarios/:id`
- `GET /usuarios/me/anuncios`, `GET /usuarios/me/favoritos`
- `POST /anuncios/:id/favorito`, `DELETE /anuncios/:id/favorito`
- `GET /usuarios/me/conversaciones`
- `GET /conversaciones/:id/mensajes`, `POST /conversaciones/:id/mensajes`
- `GET /usuarios/:id/valoraciones`, `PUT /usuarios/:id/valoracion`, `DELETE /usuarios/:id/valoracion`

La tabla completa, los permisos y el formato de error están en
[`Diseno.md`](Diseno.md).

## Requerimientos adicionales de la Práctica 4

Se irán completando con el frontend:

- [ ] Búsqueda integrada con paginación
- [ ] Navegación con router
- [ ] Biblioteca de componentes (PrimeVue)
- [ ] Recurso secundario: favoritos
- [ ] Implementación parcial con React

## Limitaciones conocidas

- El logout es del lado del cliente: el JWT es stateless y no hay lista negra de
  tokens. Al cerrar sesión se descarta el token y se deja de mostrar información
  privada.
- No se puede quitar solo la imagen de un anuncio: al editarlo se puede
  sustituir por otra, pero no dejar el campo vacío sin subir una nueva.
- Fuera de alcance: pagos, envíos, moderación automática y moderación de
  valoraciones.
