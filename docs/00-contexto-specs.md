# Contexto y decisiones para los specs del frontend

> **Uso:** este documento es la fuente de verdad para crear los `specs` del frontend con Spec Kit.
> No es una especificación por sí mismo y no sustituye a la constitución del proyecto.
> Las prioridades históricas de las historias no limitan el alcance: todas las historias 01–16
> están en alcance según las decisiones recogidas aquí.

## 1. Objetivo

Construir el frontend Vue de Clasify contra el backend ya implementado de la Práctica 1. El backend
está terminado y no debe modificarse. El frontend debe consumir sus endpoints reales, respetar sus
contratos y no sustituirlos por datos simulados.

La documentación de historias de usuario está en `docs/`. La constitución está en
`.specify/memory/constitution.md` y prevalece sobre este documento en caso de conflicto.

## 2. Estado verificado del repositorio

| Elemento | Estado |
|---|---|
| Backend | Node.js, Express 5, MySQL, `mysql2`, JWT, bcrypt, multer y CORS |
| Prefijo de API | `/clasify_api` |
| Frontend | No existe todavía `frontend-vue/` ni su `package.json` |
| Node.js | Requisito `>=20.6.0` |
| Pruebas backend | Jest + Supertest en `backend/tests/` |
| Documentación | `README.md`, `Diseno.md`, `docs/` y `.specify/memory/constitution.md` |
| Specs | Todavía no existe `specs/`; se crearán con Spec Kit |

## 3. Alcance acordado

Está en alcance **todo el backlog documentado: historias 01 a 16**.

Decisiones de alcance:

- El registro de usuario es obligatorio en el MVP.
- Vue Router es obligatorio en el MVP.
- La búsqueda y los filtros forman parte del alcance.
- Favoritos y perfil propio forman parte del alcance.
- El cambio de estado de un anuncio forma parte del alcance.
- PrimeVue se usará con personalización amplia.
- El tema visual será neutral con un color de acento y solo modo claro.
- El tamaño de página del listado será fijo en 20.
- El nombre de la categoría se mostrará en el listado cargando el catálogo una vez.
- Las pruebas automatizadas usarán Vitest para servicios, stores y componentes clave.
- El recorrido completo se validará manualmente contra el backend real.

### Fuera de alcance

- Perfil público de otros usuarios.
- Mensajería y conversaciones.
- Valoraciones entre usuarios.
- Pagos, envíos y logística.
- Moderación automática o de contenido.
- Implementación con React, Svelte o Angular.
- Modo oscuro.
- Selector de tamaño de página.
- Subida de varias imágenes.
- Eliminar la imagen de un anuncio sin sustituirla.
- Cambios en el backend, en el esquema o en los contratos de la API.

## 4. Stack y arquitectura del frontend

### Tecnologías

| Tecnología | Uso | Decisión |
|---|---|---|
| Vue 3 | Framework del frontend | Obligatorio |
| Vite | Construcción y servidor de desarrollo | Obligatorio |
| Pinia | Estado compartido | Obligatorio |
| Vue Router | Navegación y rutas | Obligatorio |
| PrimeVue | Componentes de interfaz | Obligatorio, con tema personalizado |
| `fetch` nativo | Peticiones HTTP | Obligatorio; no usar axios |
| Vitest | Pruebas automatizadas | Obligatorio para servicios, stores y componentes clave |
| npm | Gestión de dependencias | Obligatorio |

Las versiones exactas de Vue, Vite, Pinia, PrimeVue y Vitest se fijarán en el `plan` y en el
`package.json`. No deben inventarse en los `specs`.

El frontend se implementará en JavaScript. TypeScript queda fuera de alcance salvo que se apruebe
explícitamente en el plan.

### Estructura

```text
frontend-vue/
  src/
    assets/
    components/
    router/
    services/
    stores/
    styles/
    views/
  tests/
  .env.example
  package.json
```

- `components/`: componentes reutilizables y presentacionales.
- `views/`: pantallas que coordinan componentes y stores.
- `stores/`: estado compartido con Pinia.
- `services/`: única capa autorizada para hacer peticiones HTTP.
- `router/`: rutas, guards y configuración de navegación.
- `styles/`: tema, tokens y estilos globales.
- `tests/`: pruebas de servicios, stores y componentes clave.

### Reglas de dependencia

- Los componentes no deben importar ni invocar `fetch` directamente.
- Las vistas y componentes deben usar stores para el estado compartido.
- Los stores deben llamar a los servicios.
- Los servicios deben construir las URLs, cabeceras, serialización y normalización de errores.
- Ningún componente debe conocer SQL, tablas o detalles internos del backend.

### Stores previstos

- `useAuthStore`: token, usuario, login, registro, logout y recuperación de sesión.
- `useAnunciosStore`: listado, paginación, filtros, detalle y operaciones de gestión.
- `useCategoriasStore`: catálogo de categorías y mapa `id → nombre`.
- `useFavoritosStore`: favoritos del usuario.
- `useUiStore` o equivalente: notificaciones, confirmaciones y estado global de interfaz.

Los nombres exactos pueden ajustarse en el plan, pero las responsabilidades no deben mezclarse.

### Servicios previstos

- `authService`: registro, login y `/auth/yo`.
- `anunciosService`: listado, detalle, creación, edición, cambio de estado y eliminación.
- `categoriasService`: catálogo de categorías.
- `favoritosService`: añadir, quitar y listar favoritos.
- `usuariosService`: perfil propio y anuncios propios.
- Servicio HTTP base: `VITE_API_URL`, cabecera `Authorization`, serialización, `204` y errores.

### Sesión

- El token se guarda en `sessionStorage`.
- Al arrancar la aplicación, si hay token se llama a `GET /auth/yo`.
- Un `401` limpia la sesión, los datos privados y redirige al login.
- El logout es local: no existe endpoint de logout en el backend.
- La sesión se recupera al recargar la misma pestaña, pero no se comparte automáticamente con otras.

### Comentarios y estilo de código

- Todo el código nuevo o modificado debe estar libre de comentarios, según la constitución.
- No se añaden `TODO`, `FIXME`, `XXX` ni `HACK`.
- Los nombres deben ser descriptivos y el código autoexplicativo.
- La documentación externa va en `README.md`, `docs/` y `specs/`.

## 5. Decisiones de interfaz y experiencia

### Tema

- PrimeVue con personalización amplia.
- Base neutral clara con un color de acento.
- Solo modo claro.
- Tokens propios para color, tipografía, espaciado, bordes, sombras y estados.
- No se crea un sistema de diseño completo; se personalizan los tokens y los componentes usados.

### Layout

- Cabecera con marca Clasify, navegación principal y acciones de sesión.
- Contenido principal centrado y legible.
- Listado en cuadrícula de tarjetas.
- Detalle en dos columnas en escritorio y una columna en pantallas estrechas.
- Formularios en tarjeta centrada con ancho máximo.
- Layout usable en escritorio y móvil; los breakpoints exactos se fijan en el plan.

### Tarjetas del listado

Cada tarjeta muestra:

- Imagen o marcador de ausencia.
- Título.
- Precio formateado.
- Categoría, usando el catálogo cargado.
- Estado: disponible o vendido.
- Fecha de creación.

No se muestra el nombre del autor en el listado porque la API solo devuelve `id_autor`.

### Detalle

- Imagen, título, descripción, precio, estado, fecha, categoría y autor.
- Nombre, biografía y resumen de valoraciones del autor.
- Número de favoritos y estado de favorito cuando exista.
- Acciones de gestión solo para el autor.
- Acciones de favorito, según la historia 12.

### Precio y fechas

- El backend devuelve `precio` como cadena decimal.
- El frontend debe formatearlo con `Intl.NumberFormat` en formato español.
- Se propone moneda EUR; el plan debe confirmarlo antes de implementar.
- Las fechas se formatean con `Intl.DateTimeFormat` en formato español.

### Imágenes

- La URL se construye como `VITE_API_URL + /uploads/ + imagen`.
- Si `imagen` es `null`, se muestra un marcador accesible.
- Las imágenes deben tener texto alternativo.

### Estados comunes

Todas las vistas asíncronas deben distinguir:

- Carga.
- Resultados.
- Vacío.
- Error de carga.
- Operación correcta.
- Error de operación.
- Error de validación.
- Error de permisos.

Las operaciones de escritura deben impedir envíos duplicados y mostrar confirmación de éxito. Las
acciones destructivas deben pedir confirmación y permitir cancelar.

### Accesibilidad

- HTML semántico.
- Etiquetas asociadas a los campos.
- Navegación por teclado.
- Foco visible.
- Mensajes de error accesibles.
- Textos alternativos en imágenes.
- Contraste suficiente.
- Confirmaciones y diálogos cerrables sin ratón.

### 401, 403, 404, 409, 413 y 5xx

- `401`: limpiar sesión, limpiar datos privados y solicitar login.
- `403`: mostrar error de permisos.
- `404`: mostrar recurso no encontrado.
- `409`: mostrar conflicto comprensible.
- `413`: mostrar error de cuerpo demasiado grande.
- Imagen demasiado grande: error `400` de validación con `campo: "imagen"`.
- `5xx`: mensaje general sin detalles internos.

## 6. Rutas de Vue Router

| Ruta | Vista | Acceso |
|---|---|---|
| `/` | Listado de anuncios | Pública |
| `/anuncios/:id` | Detalle | Pública |
| `/login` | Inicio de sesión | Pública; redirige si hay sesión |
| `/registro` | Registro | Pública; redirige si hay sesión |
| `/anuncios/nuevo` | Crear anuncio | Protegida |
| `/anuncios/:id/editar` | Editar anuncio | Protegida y solo autor |
| `/favoritos` | Favoritos | Protegida |
| `/perfil` | Perfil propio | Protegida |
| `/:pathMatch(.*)*` | 404 | Pública |

Reglas:

- `/anuncios/nuevo` debe declararse antes de `/anuncios/:id`.
- Las rutas protegidas redirigen a `/login` con la ruta solicitada.
- Tras el login se vuelve a la ruta solicitada o a `/`.
- Los filtros y la página del listado pueden reflejarse en la URL.
- La autorización real siempre la comprueba el backend.

## 7. Contratos del backend que debe usar el frontend

| Recurso | Endpoint | Autenticación |
|---|---|---|
| Registro | `POST /clasify_api/auth/register` | No |
| Login | `POST /clasify_api/auth/login` | No |
| Sesión | `GET /clasify_api/auth/yo` | JWT |
| Listado | `GET /clasify_api/anuncios` | No |
| Detalle | `GET /clasify_api/anuncios/:id` | Opcional |
| Crear | `POST /clasify_api/anuncios` | JWT |
| Editar | `PATCH /clasify_api/anuncios/:id` | JWT del autor |
| Cambiar estado | `PATCH /clasify_api/anuncios/:id/estado` | JWT del autor |
| Eliminar | `DELETE /clasify_api/anuncios/:id` | JWT del autor |
| Categorías | `GET /clasify_api/categorias` | No |
| Añadir favorito | `POST /clasify_api/anuncios/:id/favorito` | JWT |
| Quitar favorito | `DELETE /clasify_api/anuncios/:id/favorito` | JWT |
| Mis favoritos | `GET /clasify_api/usuarios/me/favoritos` | JWT |
| Perfil propio | `GET /clasify_api/usuarios/me` | JWT |
| Editar perfil | `PATCH /clasify_api/usuarios/me` | JWT |
| Mis anuncios | `GET /clasify_api/usuarios/me/anuncios` | JWT |
| Imágenes | `GET /clasify_api/uploads/:fichero` | No |

Contratos comunes:

- Respuesta correcta: `{ "datos": ... }`.
- Listado: `{ "datos": [...], "paginacion": { pagina, limite, total, paginas } }`.
- Error: `{ "error": { codigo, mensaje, campo } }`; `campo` es opcional.
- Autenticación: `Authorization: Bearer <token>`.
- Paginación: `pagina >= 1`, `limite` entre 1 y 100, por defecto 20.
- El listado devuelve `id_categoria` e `id_autor`, no los nombres.
- El detalle devuelve el autor, la categoría, `num_favoritos` y `es_favorito`.
- El precio llega como cadena decimal.
- Las imágenes se suben como `multipart/form-data` en el campo `imagen`.

Los contratos detallados de cada operación están en las historias de `docs/`.

## 8. Mapa de specs

Se crearán seis specs, en este orden. Cada spec debe leerse junto con este documento y con las
historias indicadas.

### 001-app-shell

**Historias:** 15 y 16.

**Incluye:**

- Estructura inicial de `frontend-vue/`.
- Vue, Vite, Pinia, Vue Router y PrimeVue.
- Layout, cabecera y navegación.
- Mapa de rutas, guards y 404.
- Tema neutral con acento, solo claro.
- Tokens visuales y estilos globales.
- Componentes compartidos de carga, vacío, error, éxito y confirmación.
- Servicio HTTP base con `fetch`.
- Configuración de `VITE_API_URL`.
- Formatos de precio, fecha e imagen.
- Accesibilidad base.

**No incluye:** login, registro, listado real, detalle real, CRUD, favoritos ni perfil.

**Criterio de cierre:** la aplicación arranca, navega, muestra el layout, configura el tema, resuelve
el 404 y deja preparadas las rutas y la infraestructura para las demás specs.

### 002-autenticacion-sesion

**Historias:** 01, 02 y 03.

**Incluye:**

- Registro con email, nombre y contraseña.
- Login con email y contraseña.
- Persistencia del token en `sessionStorage`.
- Recuperación de sesión con `/auth/yo`.
- Logout local.
- Actualización del estado compartido.
- Limpieza de datos privados.
- Redirección tras login.
- Manejo global de `401`.

**No incluye:** edición de perfil ni perfil público.

### 003-catalogo-anuncios

**Historias:** 04, 05, 10 y 11.

**Incluye:**

- Listado paginado de anuncios.
- Detalle de anuncio.
- Paginación completa.
- Búsqueda por texto.
- Filtros por categoría y estado.
- Ordenación.
- Carga del catálogo de categorías.
- Tarjetas, imágenes, precio, fecha y estados.
- Estados de carga, vacío y error.

**No incluye:** crear, editar, eliminar ni cambiar estado.

### 004-gestion-anuncios

**Historias:** 06, 07, 08, 09 y 14.

**Incluye:**

- Crear anuncio.
- Editar anuncio.
- Cancelar edición sin guardar.
- Eliminar anuncio con confirmación.
- Cambiar estado entre disponible y vendido.
- Subida de imagen.
- Validaciones de formulario.
- Actualización del listado y del detalle tras cada operación.

**No incluye:** favoritos ni perfil.

### 005-favoritos

**Historias:** 12.

**Incluye:**

- Añadir y quitar favoritos.
- Botón de favorito en el detalle.
- Listado de favoritos.
- Paginación, estados de carga, vacío y error.
- Actualización del estado tras añadir o quitar.

**No incluye:** favoritos compartidos ni notificaciones.

### 006-perfil

**Historias:** 13.

**Incluye:**

- Perfil propio.
- Edición de nombre y biografía.
- Cambio de contraseña.
- Resumen de valoraciones.
- Listado de anuncios propios.
- Actualización del usuario en el estado compartido.

**No incluye:** perfil público, mensajería ni valoraciones entre usuarios.

## 9. Prompts para Spec Kit

Ejecutar los comandos en este orden y de uno en uno. No encadenar varias specs sin revisar la
anterior.

```text
/speckit.specify Implementa la spec 001-app-shell descrita en docs/00-contexto-specs.md. Lee también docs/15-router.md y docs/16-estados.md. No modifiques el backend.
```

```text
/speckit.specify Implementa la spec 002-autenticacion-sesion descrita en docs/00-contexto-specs.md. Lee también docs/01-registro.md, docs/02-login.md y docs/03-sesion.md. No modifiques el backend.
```

```text
/speckit.specify Implementa la spec 003-catalogo-anuncios descrita en docs/00-contexto-specs.md. Lee también docs/04-listado.md, docs/05-detalle.md, docs/10-paginacion.md y docs/11-busqueda-filtros.md. No modifiques el backend.
```

```text
/speckit.specify Implementa la spec 004-gestion-anuncios descrita en docs/00-contexto-specs.md. Lee también docs/06-crear.md, docs/07-editar.md, docs/08-cancelar-edicion.md, docs/09-eliminar.md y docs/14-estado-anuncio.md. No modifiques el backend.
```

```text
/speckit.specify Implementa la spec 005-favoritos descrita en docs/00-contexto-specs.md. Lee también docs/12-favoritos.md. No modifiques el backend.
```

```text
/speckit.specify Implementa la spec 006-perfil descrita en docs/00-contexto-specs.md. Lee también docs/13-perfil.md. No modifiques el backend.
```

Después de cada `specify`:

```text
/speckit.plan
/speckit.tasks
/speckit.implement
```

## 10. Reglas para los agentes de Spec Kit

- Leer este documento, la constitución y las historias indicadas antes de escribir código.
- Implementar una sola spec cada vez.
- No modificar el backend.
- No inventar endpoints, campos ni estados.
- No sustituir el backend por datos simulados.
- No añadir dependencias sin justificarlas en el plan.
- No usar axios.
- No usar TypeScript si no se aprueba en el plan.
- No añadir comentarios al código.
- No duplicar lógica de acceso HTTP en componentes.
- Mantener el estado compartido en Pinia.
- Actualizar el listado y el detalle después de cada operación.
- Manejar `401`, `403`, `404`, `409`, `413` y `5xx`.
- Respetar la accesibilidad y los estados de interfaz.
- Detenerse al terminar cada tarea y esperar revisión.
- Actualizar `README.md` y la documentación cuando cambie el comportamiento.
- No implementar mensajería, valoraciones ni perfil público.

## 11. Pruebas y definición de terminado

### Vitest

Debe cubrir, como mínimo:

- Servicios de acceso al backend.
- Transformación de errores.
- Stores de sesión, anuncios, categorías y favoritos.
- Componentes compartidos clave: estados, tarjetas, formularios, paginación y confirmaciones.

Las pruebas unitarias pueden simular HTTP. La aceptación y el recorrido completo deben ejecutarse
contra el backend real.

### Recorrido manual obligatorio

1. Registrarse o iniciar sesión con un usuario de prueba.
2. Crear un anuncio.
3. Localizarlo en el listado.
4. Consultar su detalle.
5. Editarlo.
6. Eliminarlo.
7. Cerrar sesión.

Debe documentarse con pasos, datos, resultados esperados y resultados obtenidos.

### Definición de terminado

- La spec está aprobada.
- El plan y las tareas están aprobados.
- El código no tiene comentarios.
- No hay llamadas HTTP directas desde componentes.
- La funcionalidad usa el backend real.
- Los estados de carga, vacío, error y éxito están resueltos.
- La accesibilidad básica está comprobada.
- Las pruebas de Vitest pasan.
- El recorrido manual se ha ejecutado y documentado.
- El README y la documentación están actualizados.
- No se ha modificado el backend.

## 12. Decisiones técnicas que debe cerrar el plan

Estas decisiones no bloquean los `specs`, pero deben resolverse antes de implementar:

- Versiones exactas de Vue, Vite, Pinia, PrimeVue y Vitest.
- Valores concretos de los tokens visuales: color de acento, tipografía, radios y sombras.
- Clave de `sessionStorage` para el token.
- Formato exacto de precio: se propone EUR y formato `es-ES`.
- Breakpoints del layout.
- Dependencias de Vitest para componentes: `@vue/test-utils` y entorno DOM.
- Nombres definitivos de stores, servicios y componentes compartidos.
- Estrategia de carga del catálogo de categorías.
- Comportamiento exacto de la paginación cuando la página solicitada supera el total.

Si alguna de estas decisiones afecta al alcance o a la constitución, debe detenerse la
implementación y actualizar la documentación antes de continuar.
