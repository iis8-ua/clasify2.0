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
PrimeVue y `fetch`. La base común, la autenticación, el catálogo, la gestión de
anuncios, los favoritos, el perfil propio, la mensajería, el perfil público y las
valoraciones están implementados.

También están implementadas las ampliaciones de 001, 003, 005 y 006: modo oscuro,
selector de tamaño de página, compartir anuncios, anuncios similares, “Más de
este vendedor” y quitar favoritos desde la lista.

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

Con el backend arrancado, la comprobación de integración contra datos reales:

```bash
VALIDACION_BACKEND=1 npx vitest run tests/integracion/backendReal.spec.js
```

El registro de las comprobaciones ejecutadas y su resultado está en
[`docs/validacion.md`](docs/validacion.md).

Las imágenes se sirven desde `http://localhost:3000/clasify_api/uploads/<fichero>`.

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

- Listado público paginado con 20 anuncios por página en la implementación actual; la ampliación
  especificada añade selector de 10, 20 o 50.
- Búsqueda por texto, filtros por categoría y estado, y ordenación.
- Detalle público con autor, categoría, valoraciones y número de favoritos.
- Página y filtros conservados en la dirección.
- Estados de carga, vacío, error, no encontrado e identificador inválido.
- Las acciones de gestión y de favoritos se incorporan en el detalle.

### Gestión de anuncios

- Crear anuncio desde la cabecera.
- Editar solo los campos modificados.
- Cancelar la edición sin guardar.
- Eliminar con confirmación.
- Cambiar entre disponible y vendido.
- Subida de una imagen JPEG, PNG o WebP de hasta 5 MB.
- Aviso de cambios sin guardar.
- Acciones de gestión únicamente en el detalle y solo para el autor.
- El estado vacío de “Mis anuncios” ofrece la creación de un anuncio.

### Favoritos

- Añadir y quitar favoritos únicamente desde el detalle de anuncios ajenos.
- El botón refleja si el anuncio está guardado e indica la acción con un nombre
  accesible.
- Un visitante que pulsa favorito accede y vuelve al anuncio; después debe
  confirmar la acción.
- El autor no ve la acción sobre su propio anuncio.
- Lista protegida en `/favoritos` con 20 elementos por página en la implementación actual; la
  ampliación especificada añade selector de 10, 20 o 50.
- Tarjetas del catálogo con título, precio, imagen o marcador, categoría, estado
  y fecha.
- Los anuncios vendidos siguen visibles con su estado.
- Paginación completa con la página conservada en la dirección.
- La página fuera de rango se corrige a la última disponible.
- Estados de carga, vacío, error y reintento.
- En la implementación actual la lista solo abre el detalle; la ampliación especificada añade una
  acción de quitar con confirmación.
- Limpieza de favoritos al cerrar sesión o cambiar de cuenta.
- La validación manual completa requiere el backend y la base de datos
  arrancados.

### Perfil propio

- Vista protegida en `/perfil` con nombre, email, biografía, fecha de alta y
  resumen de valoraciones.
- El email es informativo y no editable.
- Edición de nombre y biografía con validación, aviso de cambios sin guardar y
  actualización de la cabecera.
- Cambio de contraseña con la contraseña actual y una nueva de al menos ocho
  caracteres.
- La contraseña actual incorrecta se muestra como error de formulario sin
  cerrar la sesión.
- “Mis anuncios” muestra solo los anuncios del usuario autenticado, incluidos
  los vendidos.
- Paginación de 20 elementos en la implementación actual, con la página conservada en la dirección y
  corrección de páginas fuera de rango; la ampliación especificada añade selector de 10, 20 o 50.
- Cada tarjeta abre el detalle; la lista no ofrece acciones de gestión.
- El estado vacío de “Mis anuncios” permite publicar un anuncio.
- El perfil propio enlazará al perfil público propio.
- El avatar, el cambio de email, la eliminación de cuenta y la recuperación de
  contraseña siguen fuera del alcance.
- La validación manual completa requiere el backend y la base de datos
  arrancados.

### Mejoras de catálogo y tema

- Modo claro y oscuro con selector y preferencia guardada en el navegador.
- Selector de tamaño de página de 10, 20 o 50 en los listados paginados.
- Compartir anuncio con la función nativa o copiando el enlace.
- Anuncios similares y “Más de este vendedor” en el detalle.
- Enlaces al perfil público desde autor, conversación y valoraciones.
- Quitar favoritos desde la lista con confirmación.

### Valoraciones

- Formulario en el perfil público de otro usuario.
- Puntuación de 1 a 5 y comentario opcional de hasta 500 caracteres.
- Crear, actualizar y eliminar con confirmación.
- Valoraciones recibidas y escritas en `/perfil`, con edición y borrado de las escritas.
- Sin moderación, respuestas, votos ni valoraciones anónimas.

### Perfil público

- Ruta pública `/usuarios/:id` con datos públicos, resumen de valoraciones y anuncios.
- Valoraciones recibidas de solo lectura.
- Anuncios publicados, incluidos los vendidos, con enlace al detalle.
- Enlaces desde autor del anuncio, conversaciones, valoraciones y perfil propio.
- Sin email, edición, avatar ni seguimiento.

### Mensajería

- Bandeja en `/mensajes` con anuncio, contraparte, último mensaje y no leídos.
- Hilo en `/conversaciones/:id` con últimos mensajes y carga de anteriores.
- Contactar desde el detalle de anuncios ajenos.
- Mensajes de texto de hasta 1000 caracteres.
- Sin tiempo real, adjuntos ni notificaciones push/email.

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
- `GET /usuarios/:id/anuncios`
- `POST /anuncios/:id/favorito`, `DELETE /anuncios/:id/favorito`
- `GET /usuarios/me/conversaciones`
- `POST /anuncios/:id/mensajes`, `GET /anuncios/:id/mensajes`
- `GET /conversaciones/:id/mensajes`, `POST /conversaciones/:id/mensajes`
- `GET /usuarios/me/valoraciones`
- `GET /usuarios/:id/valoraciones`, `PUT /usuarios/:id/valoracion`, `DELETE /usuarios/:id/valoracion`

La tabla completa, los permisos y el formato de error están en
[`Diseno.md`](Diseno.md).

## Requerimientos adicionales de la Práctica 4

Se irán completando con el frontend:

- [x] Búsqueda integrada con paginación
- [x] Navegación con router
- [x] Biblioteca de componentes (PrimeVue)
- [x] Recurso secundario: favoritos
- [x] Implementación parcial con Vue 3 (sustituye a React según las especificaciones del proyecto)

## Limitaciones conocidas

- El logout es del lado del cliente: el JWT es stateless y no hay lista negra de
  tokens. Al cerrar sesión se descarta el token y se deja de mostrar información
  privada.
- No se puede quitar solo la imagen de un anuncio: al editarlo se puede
  sustituir por otra, pero no dejar el campo vacío sin subir una nueva.
- Fuera de alcance: pagos, envíos, moderación automática y moderación de
  valoraciones.
- La mensajería será de texto y sin tiempo real; no habrá adjuntos,
  notificaciones push ni email.
- Seguirán fuera de alcance el avatar, el cambio de email, la recuperación de
  contraseña, el 2FA, la eliminación de cuenta, la multiimagen y el borrado de la
  imagen sin sustituirla.
- No se incluyen mapa, filtros por rango de precio, búsquedas guardadas,
  paginación infinita ni búsqueda dentro de favoritos.
