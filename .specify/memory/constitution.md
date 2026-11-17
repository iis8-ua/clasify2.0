<!--
Sync Impact Report
==================
Version change: 0.0.0 (plantilla sin ratificar) → 1.0.0
Tipo de cambio: ratificación inicial. No existía una constitución propia del proyecto; el fichero
contenía únicamente la plantilla genérica de Spec Kit.

Modified principles:
- No había principios previos del proyecto.
- Se sustituyen los marcadores genéricos por ocho principios:
  I. Simplicidad y mantenibilidad
  II. Arquitectura y separación de responsabilidades
  III. Código limpio y sin comentarios
  IV. Consistencia y convenciones
  V. Seguridad y protección de datos
  VI. Experiencia de usuario y accesibilidad
  VII. Desarrollo orientado a especificaciones
  VIII. Calidad y verificabilidad

Added sections:
- Contexto del proyecto y estado verificado
- Tecnología obligatoria
- Arquitectura y organización del código
- Integración con el backend y seguridad
- Funcionalidades y experiencia de usuario
- Calidad y pruebas
- Documentación y reproducibilidad
- Flujo de trabajo y Git
- Implementación mediante Spec Kit
- Requisitos adicionales y control del alcance
- Gobernanza

Removed sections:
- Marcadores y ejemplos genéricos de la plantilla de Spec Kit.

Follow-up TODOs:
- Ninguno pendiente como marcador de plantilla.

Deferred verification:
- El frontend `frontend-vue/` no existe todavía en el repositorio, por lo que no hay `package.json`
  ni versiones verificables de Vue, Vite, Pinia, Vue Router o PrimeVue. Las versiones exactas deberán
  fijarse y documentarse al crear el proyecto, sin inventarlas antes.
- La versión del servidor MySQL no se ha podido verificar; el README y el esquema exigen MySQL 8.
- El repositorio referencia `docs/ARCHITECTURE.md` en comentarios del backend, pero ese documento no
  está presente. La implementación y los tests son la referencia contractual verificable.
-->

# Constitución de Clasify

Convención normativa: **MUST** expresa una obligación; **MUST NOT** expresa una prohibición;
**SHOULD** expresa una recomendación que solo puede incumplirse con una justificación técnica
registrada; **MAY** expresa una opción permitida. Las reglas se aplican a todo el código, la
documentación y las decisiones del proyecto Clasify.

## Principios fundamentales

### I. Simplicidad y mantenibilidad

**Reglas**

- Toda solución MUST ser la más sencilla que satisfaga los requisitos aprobados y respete el
  contrato del backend existente.
- MUST NOT introducirse complejidad, capas, patrones o abstracciones que no resuelvan una
  necesidad concreta y verificable.
- MUST NOT crearse una abstracción hasta que exista al menos un uso real que la justifique o hasta
  que una especificación aprobada la exija.
- El código MUST ser legible, estar organizado por responsabilidades y poder mantenerse sin
  conocimiento tácito de quien lo escribió.
- Las dependencias nuevas MUST justificarse en la especificación o en el plan y MUST ser
  compatibles con las tecnologías existentes.
- Un refactor MUST limitarse al alcance de la tarea que lo motiva y MUST NOT alterar
  funcionalidades ajenas.

**Rationale**

La aplicación es una práctica académica con un backend ya construido y un frontend todavía por
crear. La complejidad añadida sin necesidad aumenta el coste de revisión, dificulta las pruebas y
hace más probable romper contratos existentes. La simplicidad también facilita que otra persona
pueda instalar, ejecutar y evaluar el proyecto.

### II. Arquitectura y separación de responsabilidades

**Reglas**

- El backend existente MUST conservar su separación actual: rutas, middleware, servicios, helpers
  y acceso a base de datos. Las rutas MUST limitarse a recibir la petición, validar lo que
  corresponda y delegar en los servicios.
- El frontend MUST separar, como mínimo, componentes, vistas, stores y servicios.
- Las vistas MUST coordinar stores y componentes; los componentes MUST tener una responsabilidad
  clara y MUST NOT concentrar la aplicación completa.
- Los componentes y vistas MUST NOT realizar llamadas HTTP directas. El acceso al backend MUST
  centralizarse en la capa de servicios.
- Los stores MUST NOT contener detalles de presentación ni SQL; los servicios MUST NOT contener
  estado de interfaz.
- La lógica de negocio MUST permanecer en el backend. El frontend MUST NOT duplicar reglas de
  negocio, permisos ni validaciones que el backend ya impone.
- MUST NOT duplicarse lógica de negocio, transformaciones de datos o componentes equivalentes sin
  una justificación técnica.
- Los principios SOLID y los patrones de diseño MAY aplicarse cuando aporten valor; MUST NOT
  aplicarse de forma ceremonial.

**Rationale**

Una separación explícita permite cambiar la interfaz sin reescribir el acceso a datos, probar los
servicios de forma aislada y localizar defectos con rapidez. También evita que el frontend asuma
responsabilidades que pertenecen al backend, especialmente las relacionadas con permisos y
consistencia de datos.

### III. Código limpio y sin comentarios

**Reglas**

- Todo el código fuente nuevo o modificado MUST estar libre de comentarios.
- MUST NOT añadirse comentarios explicativos dentro del código, incluidos los destinados a
  describir métodos, clases, variables, bloques o decisiones de implementación.
- MUST NOT añadirse comentarios `TODO`, `FIXME`, `XXX`, `HACK` ni marcadores equivalentes.
- MUST NOT usarse comentarios como sustituto de nombres descriptivos, estructuras claras o una
  correcta separación de responsabilidades.
- El código MUST ser autoexplicativo mediante nombres precisos, funciones pequeñas, estructuras
  evidentes y límites de responsabilidad claros.
- La documentación externa al código fuente MAY existir y MUST mantenerse en `README.md`,
  `Diseno.md`, `specs/` o en la documentación técnica que corresponda.
- La regla se aplica tanto al código nuevo como al código que se modifique. No es obligatorio
  limpiar comentarios de archivos ajenos al alcance de una tarea, pero los comentarios del bloque
  que se modifique MUST NOT permanecer.
- La regla no se aplica a los comentarios de la propia constitución ni a los archivos de
  documentación Markdown.

**Rationale**

Los comentarios se desactualizan y acaban describiendo un comportamiento que ya no existe. Un
código con nombres y responsabilidades claras se entiende sin ellos y reduce el riesgo de que la
documentación interna contradiga la implementación. La documentación externa sigue siendo
obligatoria, pero se mantiene separada del código.

### IV. Consistencia y convenciones

**Reglas**

- Las convenciones de nomenclatura existentes en el backend MUST respetarse: funciones y variables
  en `camelCase`, clases en `PascalCase`, constantes en `UPPER_SNAKE_CASE`, términos de dominio en
  español y columnas SQL en `snake_case`.
- Los nuevos componentes y vistas de Vue MUST nombrarse en `PascalCase` y usar el sufijo `View`
  cuando correspondan a una vista. Los stores MUST seguir el patrón `useXStore`. Los módulos de
  servicios MUST usar `camelCase`.
- Los identificadores MUST NOT mezclar idiomas innecesariamente. Los términos técnicos aceptados
  pueden mantenerse en inglés.
- Los contratos JSON MUST conservar los nombres de campo del backend, como `id_autor`,
  `fecha_creacion`, `num_favoritos`, `num_valoraciones` o `valoracion_media`. Cualquier mapeo a
  nombres internos MUST ser explícito y estar documentado.
- Los componentes, estilos, mensajes y patrones de interacción MUST ser coherentes entre vistas.
- MUST reutilizarse un componente o servicio existente cuando resuelva la necesidad, en lugar de
  crear una variante innecesaria.
- MUST NOT resolverse problemas equivalentes con soluciones distintas sin una justificación
  técnica registrada.

**Rationale**

La consistencia reduce el tiempo de lectura y evita que cada pantalla parezca pertenecer a un
proyecto distinto. Respetar los nombres del contrato del backend también evita errores de
integración y traducciones ambiguas entre la base de datos, la API y la interfaz.

### V. Seguridad y protección de datos

**Reglas**

- MUST NOT almacenarse credenciales, contraseñas, tokens, secretos ni claves privadas en el
  repositorio.
- La configuración sensible MUST gestionarse mediante variables de entorno. Los ficheros `.env`
  MUST NOT versionarse; MUST existir una plantilla `.env.example` sin valores reales.
- La autorización MUST comprobarse siempre en el backend. El frontend MUST NOT considerarse una
  barrera de seguridad suficiente.
- El frontend MUST ocultar o deshabilitar las acciones no permitidas, pero MUST asumir que el
  backend seguirá comprobando permisos, propiedad y estado de los recursos.
- MUST NOT exponerse información privada de otros usuarios. En particular, el email solo puede
  mostrarse en el perfil propio; el perfil público no lo incluye.
- El frontend MUST tratar el token como información sensible: MUST NOT incluirlo en URLs, logs,
  mensajes de error ni analítica.
- La sesión MUST persistirse y recuperarse mediante el mecanismo que se apruebe en la
  especificación. Al cerrar sesión MUST eliminarse el token, el usuario autenticado y cualquier
  dato privado cacheado.
- Ante una respuesta `401`, el frontend MUST limpiar la sesión y solicitar un nuevo inicio de
  sesión. Ante una respuesta `403`, MUST mostrar un error de permisos y MUST NOT reintentar la
  operación como si fuera un fallo transitorio.
- Las contraseñas MUST NOT mostrarse, registrarse ni almacenarse en el frontend.
- Las operaciones destructivas MUST requerir confirmación explícita del usuario.

**Rationale**

El backend ya implementa autenticación JWT, hash de contraseñas y comprobaciones de propiedad. La
interfaz no puede debilitar esas garantías ni convertirse en la única defensa. Proteger el token y
limpiar el estado privado al cerrar sesión evita filtraciones en equipos compartidos y reduce el
impacto de un token caducado o comprometido.

### VI. Experiencia de usuario y accesibilidad

**Reglas**

- La interfaz MUST ser clara, coherente e intuitiva, con una presentación uniforme en todas las
  vistas.
- Las operaciones asíncronas MUST mostrar un estado de carga identificable y MUST impedir envíos
  duplicados mientras estén en curso.
- Los errores MUST comunicarse mediante mensajes comprensibles para el usuario, no mediante
  trazas, códigos internos ni mensajes técnicos sin contexto.
- La interfaz MUST distinguir de forma visible entre listado con resultados, listado vacío y error
  al obtener la información.
- Los formularios MUST indicar los campos obligatorios, validar formatos y rangos, y asociar los
  errores al campo correspondiente cuando el backend devuelva esa información.
- La edición MUST poder cancelarse sin guardar. Si hay cambios sin guardar, MAY solicitarse
  confirmación antes de descartarlos.
- Las acciones destructivas MUST requerir confirmación y MUST explicar qué elemento se va a
  eliminar. La opción de cancelar MUST ser clara.
- Las operaciones correctas MUST proporcionar una confirmación perceptible sin obligar a recargar
  la página.
- La interfaz MUST usar HTML semántico, etiquetas asociadas a los campos, navegación por teclado,
  foco visible y textos alternativos en las imágenes.
- MUST NOT mostrarse información privada de otros usuarios ni detalles internos del backend.

**Rationale**

Una aplicación académica se evalúa también por su usabilidad. Distinguir carga, vacío y error evita
que el usuario interprete un fallo como ausencia de datos. La accesibilidad y la confirmación de
acciones destructivas reducen errores irreversibles y mejoran la calidad percibida.

### VII. Desarrollo orientado a especificaciones

**Reglas**

- Solo MUST implementarse funcionalidades recogidas en especificaciones aprobadas.
- MUST NOT añadirse funcionalidades por iniciativa propia, aunque parezcan útiles.
- Toda especificación MUST incluir criterios de aceptación verificables.
- Todo plan MUST respetar la arquitectura, las tecnologías y los contratos existentes.
- Las tareas MUST ser concretas, independientes y verificables.
- MUST NOT modificarse funcionalidades ajenas al alcance de una tarea.
- Si durante la implementación aparece una necesidad no prevista, el agente MUST detenerse,
  describirla y proponer una actualización de la especificación antes de implementarla.
- Las especificaciones MUST reflejar el estado real del backend y MUST NOT inventar endpoints,
  campos ni reglas de negocio.

**Rationale**

El desarrollo guiado por especificaciones evita el crecimiento descontrolado del alcance y permite
revisar qué se va a construir antes de escribir código. También protege el backend compartido de
cambios impulsivos y facilita la evaluación objetiva contra criterios de aceptación.

### VIII. Calidad y verificabilidad

**Reglas**

- Toda funcionalidad MUST poder comprobarse mediante pruebas manuales, automatizadas o una
  combinación de ambas.
- Las pruebas MUST contemplar los casos correctos, los errores de validación, los errores de
  permisos, los listados vacíos y los fallos de conexión cuando sean relevantes.
- Las modificaciones MUST validarse antes de considerarse terminadas. MUST NOT darse una tarea por
  finalizada sin comprobar su funcionamiento.
- Si se modifica el backend o se altera un contrato compartido, MUST ejecutarse la suite existente
  de Jest y Supertest y MUST NOT introducirse regresiones.
- Las comprobaciones MUST registrarse con el comando ejecutado, el entorno utilizado y el
  resultado obtenido.
- La verificación de aceptación y el recorrido completo MUST ejecutarse contra el backend real, no
  contra datos simulados.
- Las pruebas unitarias MAY aislar la capa HTTP, pero ese aislamiento MUST NOT sustituir la prueba
  de integración con el backend real.

**Rationale**

Una funcionalidad no está terminada porque compile o porque la pantalla se vea correcta. La
verificación demuestra que los permisos, la validación y la integración funcionan en conjunto. El
backend ya dispone de una suite automatizada; preservarla es la forma más directa de evitar
regresiones mientras se construye el frontend.

## Contexto del proyecto y estado verificado

Esta constitución se ratifica sobre el estado del repositorio en el commit `77fab53`, rama
`develop`, con fecha 2026-11-10.

| Elemento | Estado verificado |
|---|---|
| Dominio | Anuncios clasificados. El recurso principal es `anuncios`. |
| Backend | Node.js, Express 5, MySQL, `mysql2`, JWT, bcrypt, multer y CORS. Código CommonJS. |
| Prefijo de API | `/clasify_api`. |
| Frontend | No existe el directorio `frontend-vue/` ni un `package.json` de frontend. El README declara Vue 3, Vite, Pinia, Vue Router y PrimeVue como stack previsto. |
| Documentación | `README.md` y `Diseno.md`. `specs/` no existe todavía. |
| Pruebas | Jest y Supertest en `backend/tests/`, con seis suites y base de datos `clasify_test`. |
| Entorno local | Node.js `v26.8.2` y npm `11.19.1` verificados. El proyecto declara Node.js `>=20.6.0`. |
| Base de datos | MySQL 8 según README y esquema; la versión del servidor no se ha verificado. |
| Git | Ramas `master`, `develop` y `feat/backend`; tres commits. No hay configuración de Pull Requests ni de CI en el repositorio. |

Decisiones existentes que MUST respetarse:

- El backend es una API REST propia, no Supabase ni un servicio externo de autenticación.
- La autenticación es JWT stateless con algoritmo HS256 y caducidad configurable, una hora por
  defecto.
- El logout es del lado del cliente. No existe endpoint de logout ni lista negra de tokens.
- La autorización se resuelve en los servicios del backend mediante comprobaciones de propiedad,
  participación y existencia.
- Los listados son paginados y usan el sobre `{ datos, paginacion }`.
- Los errores usan el sobre `{ error: { codigo, mensaje, campo } }`, con `campo` opcional.
- Las imágenes se suben como `multipart/form-data` en el campo `imagen` y se sirven desde
  `/clasify_api/uploads/<fichero>`.

Recomendaciones o elementos declarados que todavía no están adoptados:

- Vue Router y PrimeVue aparecen en el README como stack previsto, pero no están materializados ni
  son obligatorios mientras no se apruebe la funcionalidad adicional correspondiente.
- La convención de commits Conventional Commits no está consolidada: solo uno de los tres commits
  existentes la usa. Esta constitución la adopta como recomendación para los commits nuevos.
- No existen Pull Requests, revisiones formales ni integración continua. No se presuponen.
- El backend existente contiene comentarios. La regla de código sin comentarios se aplica al código
  nuevo y al que se modifique, no obliga a limpiar archivos completos fuera de alcance.

## Tecnología obligatoria

### Backend de la Práctica 1

El frontend MUST conectarse al backend existente en `backend/`. No se ha encontrado otra
implementación de backend en el repositorio.

| Tecnología | Versión o requisito declarado | Uso |
|---|---|---|
| Node.js | `>=20.6.0` en `backend/package.json` | Entorno de ejecución |
| Express | `^5.2.1` | Framework HTTP y enrutado |
| MySQL | MySQL 8 según README y esquema | Base de datos relacional |
| mysql2 | `^3.24.4` | Cliente y pool de conexiones |
| jsonwebtoken | `^9.0.3` | Firma y verificación JWT |
| bcrypt | `^6.0.0` | Hash de contraseñas con coste 12 |
| multer | `^2.4.0` | Subida de imágenes |
| cors | `^2.8.6` | Control de orígenes del frontend |
| dotenv | `^18.0.4` | Carga de variables de entorno |
| Jest | `^30.5.2` | Pruebas del backend |
| Supertest | `^7.3.0` | Pruebas HTTP del backend |

El backend MUST conservar CommonJS y las capas existentes. MUST NOT sustituirse MySQL, Express,
JWT, bcrypt ni multer por otras tecnologías sin una enmienda de esta constitución.

### Frontend de la Práctica 4

- **Vue** es el framework obligatorio del frontend.
- **Pinia** es obligatorio para la gestión del estado compartido.
- La estructura MUST separar componentes, vistas, stores y servicios.
- **Vite** es la herramienta de build declarada en el README y SHOULD mantenerse. Su versión
  exacta MUST fijarse en el `package.json` cuando se cree el proyecto y MUST documentarse en el
  README.
- **Vue Router** MAY utilizarse si se aprueba la funcionalidad adicional de navegación.
- **PrimeVue** u otra biblioteca de componentes MAY utilizarse si se aprueba y se justifica su
  compatibilidad. MUST NOT mezclarse varias bibliotecas de componentes sin justificación.
- No existe todavía `frontend-vue/` ni un `package.json` de frontend. MUST NOT inventarse versiones
  de Vue, Vite o Pinia en especificaciones, planes o documentación. Las versiones reales MUST
  registrarse en cuanto se cree el proyecto.
- Las dependencias adicionales MUST estar justificadas en la especificación o el plan, MUST ser
  compatibles con Vue y Pinia y MUST NOT duplicar funcionalidad ya disponible.

### Integración obligatoria

- El frontend MUST consumir el backend real para las operaciones de la aplicación.
- MUST NOT sustituirse una operación real por datos simulados, mocks permanentes ni almacenamiento
  local como sustituto del backend.
- Los datos de ejemplo del backend MAY usarse para pruebas manuales, pero la aplicación MUST
  funcionar contra la API real.
- La dirección del backend MUST configurarse mediante variables de entorno, conforme al README:
  `VITE_API_URL=http://localhost:3000/clasify_api`.

## Arquitectura y organización del código

### Backend existente

- `src/routes/` definen las rutas REST y delegan en servicios.
- `src/middleware/` contiene autenticación, validación, errores y subida de imágenes.
- `src/services/` contiene la lógica de negocio y las consultas SQL.
- `src/helpers/` contiene paginación y proyecciones compartidas.
- `src/db/` contiene el pool, el esquema, el seed y los scripts de base de datos.
- `src/errors/` contiene el error de API con el formato uniforme.
- MUST NOT introducirse un ORM, una nueva capa de controladores ni un patrón arquitectónico
  distinto sin una enmienda y una justificación técnica.
- Las rutas MUST NOT contener lógica de negocio que pertenezca a los servicios.
- Las consultas SQL MUST usar parámetros y MUST NOT concatenar valores no confiables.

### Frontend

La estructura prevista MUST ser equivalente a esta, con los nombres que se aprueben en el plan:

```text
frontend-vue/
  src/
    components/
    views/
    stores/
    services/
    router/
```

- `components/` MUST contener componentes reutilizables y presentacionales.
- `views/` MUST contener las pantallas que coordinan componentes y stores.
- `stores/` MUST contener el estado compartido con Pinia y las acciones que lo modifican.
- `services/` MUST contener el acceso HTTP al backend y las funciones de transformación de
  respuestas.
- `router/` solo existirá si se aprueba Vue Router.

Reglas de dependencia:

- Los componentes MUST NOT importar ni invocar directamente `fetch`, un cliente HTTP o una URL del
  backend.
- Las vistas y componentes MUST obtener datos compartidos a través de stores. Para datos
  estrictamente locales de una vista, MAY usar la capa de servicios directamente.
- Los stores MUST llamar a los servicios y MUST NOT construir URLs ni cabeceras HTTP por su cuenta.
- Los servicios MUST encapsular la URL base, las cabeceras, la serialización y el tratamiento
  común de errores.
- Ningún componente, store o servicio del frontend MUST conocer detalles de tablas, SQL, pool de
  conexiones o infraestructura interna del backend.

### Componentes y vistas

- Cada componente MUST tener una responsabilidad identificable.
- Una vista MUST organizar y coordinar los componentes necesarios, no concentrar toda la
  aplicación.
- Si un componente mezcla presentación, estado compartido y acceso a datos, MUST dividirse.
- Los componentes MUST recibir datos mediante props y comunicar eventos mediante la interfaz de
  Vue, sin acceder a estado global innecesario.
- Los componentes reutilizables MUST NOT depender de una vista concreta.
- La lógica de presentación MAY permanecer en el componente; la lógica de negocio MUST permanecer
  en el backend y la lógica de acceso a datos MUST permanecer en los servicios.

### Gestión del estado compartido

- Pinia MUST utilizarse para el estado compartido.
- El estado MUST incluir, como mínimo, la información de sesión y los datos de los listados que
  usen varios componentes.
- El estado que solo necesita un componente MUST permanecer local a ese componente.
- Cada store MUST tener una responsabilidad delimitada y MUST NOT convertirse en un almacén global
  indiscriminado.
- Los stores MUST exponer acciones para iniciar sesión, cerrar sesión, cargar listados y
  actualizar o invalidar los datos afectados por una operación.
- Después de crear, editar o eliminar un elemento, el store MUST actualizar el elemento afectado o
  invalidar y recargar el listado correspondiente. MUST NOT exigirse una recarga manual de la
  página.
- El estado derivado MUST calcularse a partir del estado fuente y MUST NOT duplicarse sin
  necesidad.
- Al cerrar sesión, los stores MUST limpiar todos los datos privados del usuario anterior.

### Acceso al backend

- Las llamadas HTTP MUST centralizarse en la capa de servicios.
- Los componentes MUST NOT realizar directamente llamadas al backend.
- Los servicios MUST abstraer la URL base, las cabeceras, el formato de las peticiones y las
  respuestas.
- Los servicios MUST gestionar los códigos HTTP y MUST convertir los errores del backend en un
  formato comprensible para la interfaz, conservando `codigo`, `mensaje` y `campo` cuando existan.
- Los servicios MUST NOT inventar endpoints ni campos que no existan en el backend.
- Los servicios MUST tratar los cuerpos `204 No Content` como respuestas válidas sin cuerpo.
- Los servicios MUST usar `VITE_API_URL` como base. MUST NOT codificarse direcciones de desarrollo
  en componentes, stores ni utilidades.

### Navegación

- Si se implementa Vue Router, las rutas MUST estar organizadas y corresponder a vistas
  relevantes.
- La navegación MUST permitir acceder directamente a las vistas mediante URL y MUST utilizar
  correctamente el historial del navegador.
- Las rutas MUST reflejar el estado relevante de la vista, como el identificador de un anuncio o
  la página del listado, cuando corresponda.
- Las rutas protegidas MUST comprobar la sesión en el frontend para la experiencia de usuario, sin
  sustituir la autorización del backend.
- Vue Router MUST NOT imponerse como requisito si la funcionalidad adicional de navegación no se ha
  aprobado. En ese caso, la navegación MAY resolverse con el estado de la aplicación.

## Integración con el backend y seguridad

### Contratos de la API

El frontend MUST respetar los contratos implementados en `backend/`. Si `Diseno.md` y el código
discrepan, la implementación y los tests del backend son la referencia verificable.

| Aspecto | Contrato |
|---|---|
| URL base | `VITE_API_URL`, por defecto `http://localhost:3000/clasify_api` según el README |
| Respuesta correcta | `{ "datos": ... }` |
| Listado paginado | `{ "datos": [...], "paginacion": { "pagina", "limite", "total", "paginas" } }` |
| Error | `{ "error": { "codigo", "mensaje", "campo" } }`, con `campo` opcional |
| Autenticación | Cabecera `Authorization: Bearer <token>` |
| Paginación | `pagina >= 1`, `limite` entre 1 y 100, por defecto 20 |
| Precio | El backend devuelve el `precio` como cadena decimal; el frontend MUST tratarlo como valor decimal y MUST NOT asumir que es un número JSON |
| Fechas | El frontend MUST tratar las fechas según el formato serializado por el backend y MUST NOT reinterpretarlas con supuestos no documentados |
| Borrado | `204 No Content` sin cuerpo |
| Imágenes | `multipart/form-data`, campo `imagen`, MIME `image/jpeg`, `image/png` o `image/webp`, máximo 5 MB |
| Imagen servida | `<VITE_API_URL>/uploads/<fichero>` |
| CORS | El backend permite los orígenes configurados en `FRONTEND_ORIGIN` |

Endpoints del alcance básico:

| Método | Ruta | Autenticación | Uso |
|---|---|---|---|
| POST | `/clasify_api/auth/login` | No | Iniciar sesión |
| GET | `/clasify_api/auth/yo` | JWT | Recuperar el usuario de la sesión |
| GET | `/clasify_api/anuncios` | No | Listar y filtrar anuncios |
| GET | `/clasify_api/anuncios/:id` | Opcional | Consultar el detalle |
| POST | `/clasify_api/anuncios` | JWT | Crear un anuncio |
| PATCH | `/clasify_api/anuncios/:id` | JWT del autor | Editar un anuncio |
| PATCH | `/clasify_api/anuncios/:id/estado` | JWT del autor | Cambiar entre disponible y vendido |
| DELETE | `/clasify_api/anuncios/:id` | JWT del autor | Eliminar un anuncio |
| GET | `/clasify_api/categorias` | No | Obtener las categorías para los filtros |
| GET | `/clasify_api/uploads/:fichero` | No | Servir una imagen subida |

El backend también expone registro, perfil de usuario, favoritos, conversaciones, mensajes y
valoraciones. Esos endpoints existen y MUST respetarse si se usan, pero no convierten sus
funcionalidades en requisitos básicos del frontend.

### Autenticación y sesión

- La aplicación MUST permitir iniciar sesión con `POST /clasify_api/auth/login`, enviando `email`
  y `password`.
- La respuesta correcta de login MUST tratarse como `{ datos: { token, usuario } }`.
- La aplicación MUST identificar al usuario autenticado mediante el usuario devuelto por el login
  y MUST poder recuperar la sesión con `GET /clasify_api/auth/yo` al recargar la aplicación.
- El token MUST enviarse en la cabecera `Authorization: Bearer <token>` en las rutas protegidas.
- El cierre de sesión MUST eliminar el token y el estado privado del cliente. No existe endpoint de
  logout en el backend y MUST NOT inventarse uno.
- El backend no emite refresh tokens. Cuando el token caduque, el frontend MUST limpiar la sesión y
  solicitar un nuevo login.
- La persistencia del token MUST resolverse con un mecanismo aprobado en la especificación y MUST
  documentarse. MUST NOT exponerse el token en URLs, logs ni mensajes de error.
- La aplicación MUST actualizar el estado compartido de sesión después de iniciar y cerrar sesión.
- Al cerrar sesión MUST desaparecer toda la información privada de la interfaz y de los stores.

### Autorización y permisos

- Las operaciones disponibles MUST respetar los permisos del usuario autenticado.
- El frontend MUST ocultar o deshabilitar las acciones no permitidas, como editar, cambiar estado o
  eliminar un anuncio que no pertenece al usuario.
- La propiedad de un anuncio MUST determinarse con `id_autor` en los listados y con el autor del
  detalle, comparándolo con el identificador del usuario de la sesión.
- El frontend MUST NOT confiar exclusivamente en restricciones visuales. El backend MUST seguir
  comprobando permisos en cada operación.
- Los errores `403` MUST mostrarse como errores de permisos. Los errores `401` MUST tratarse como
  sesión ausente, caducada o inválida.
- MUST NOT mostrarse el email ni datos privados de otros usuarios. El perfil público del backend no
  incluye el email; el frontend MUST respetar esa proyección.

### Comunicación y errores

- La dirección del backend MUST configurarse mediante variables de entorno.
- MUST NOT introducirse direcciones específicas de desarrollo directamente en componentes.
- El frontend MUST gestionar errores de conexión, errores HTTP y errores de validación.
- Los errores de validación MUST asociarse al campo indicado por `campo` cuando esté presente.
- Los errores `409` MUST mostrarse como conflictos comprensibles, por ejemplo un email duplicado.
- Los errores `413` MUST mostrarse como un problema de tamaño de archivo.
- Los errores `5xx` MUST mostrarse con un mensaje genérico y MUST NOT exponer detalles internos.
- MUST NOT simularse operaciones que deban realizarse contra el backend real.

## Funcionalidades y experiencia de usuario

### Alcance funcional básico

El recurso principal de la Práctica 4 es `anuncios`. La aplicación MUST permitir realizar desde la
interfaz las siguientes operaciones:

- Iniciar sesión.
- Cerrar sesión.
- Listar anuncios.
- Consultar el detalle de un anuncio.
- Crear un anuncio.
- Editar un anuncio.
- Cancelar una edición sin guardar.
- Eliminar un anuncio mediante confirmación.

El backend también ofrece registro, perfil, favoritos, mensajería y valoraciones. Estas
funcionalidades MAY implementarse si se especifican y se aprueban; MUST NOT considerarse
obligatorias por el mero hecho de existir en el backend.

### Listado y paginación

- El listado MUST consumir `GET /clasify_api/anuncios` y MUST respetar la paginación del backend.
- Si el backend devuelve datos paginados, la interfaz MUST permitir recorrer todas las páginas.
  MUST NOT limitarse a mostrar la primera página.
- La paginación MUST mantener la coherencia con los filtros y criterios de búsqueda cuando existan.
- MUST contemplarse la ausencia de resultados como un estado distinto del error de carga.
- El listado MUST actualizarse después de crear, editar o eliminar un anuncio sin recargar
  manualmente la página.
- El listado por defecto del backend muestra solo anuncios disponibles. Si se ofrece un filtro de
  estado, MUST usar los valores admitidos por el backend: `disponible`, `vendido` o `todos`.
- La ordenación MUST usar solo los valores admitidos por el backend: `fecha_desc`, `fecha_asc`,
  `precio_desc` o `precio_asc`.

### Detalle

- El detalle MUST consumir `GET /clasify_api/anuncios/:id`.
- MUST mostrar los datos del anuncio, su autor, su categoría y el estado de favorito cuando el
  backend lo devuelva.
- MUST mostrar un estado de carga mientras se obtiene la información y un estado de error
  comprensible si la petición falla o el anuncio no existe.
- Las acciones de editar, cambiar estado y eliminar MUST mostrarse solo al autor del anuncio.
- El detalle MUST actualizarse después de una edición o de un cambio de estado.

### Creación y edición

- La creación MUST consumir `POST /clasify_api/anuncios`.
- La edición MUST consumir `PATCH /clasify_api/anuncios/:id`.
- Los campos del anuncio y sus restricciones MUST respetar el backend:

| Campo | Regla |
|---|---|
| `titulo` | Obligatorio, máximo 150 caracteres |
| `descripcion` | Obligatoria, máximo 5000 caracteres |
| `precio` | Obligatorio, no negativo, máximo 99999999.99 y como máximo 2 decimales |
| `categoria` | Obligatoria y debe existir en el backend |
| `imagen` | Opcional; JPEG, PNG o WebP; máximo 5 MB |
| `estado` | `disponible` o `vendido`; se cambia mediante `PATCH /anuncios/:id/estado` |

- El autor MUST obtenerse del token en el backend. El frontend MUST NOT enviar ni permitir editar
  `id_autor` como si fuera un campo del formulario.
- La edición MUST enviar solo los campos modificados. El backend admite `PATCH` parcial.
- La edición con imagen MUST usar `multipart/form-data` con el campo `imagen`.
- Cancelar la edición MUST descartar los cambios locales y MUST NOT enviar ninguna petición.
- Los errores de validación del backend MUST mostrarse junto al campo correspondiente cuando el
  backend devuelva `campo`.
- La validación del frontend complementa, pero MUST NOT sustituir, la validación del backend.
- La creación y la edición MUST impedir envíos duplicados mientras la petición esté en curso.

### Eliminación

- La eliminación MUST consumir `DELETE /clasify_api/anuncios/:id`.
- MUST solicitarse confirmación explícita antes de eliminar.
- Cancelar la confirmación MUST NOT enviar ninguna petición ni modificar el listado.
- Tras eliminar, el anuncio MUST desaparecer del listado y del detalle sin recargar manualmente la
  página.
- La eliminación MUST respetar la autorización del backend y MUST NOT intentarse sobre anuncios
  ajenos.

### Estados de interfaz

La aplicación MUST distinguir y representar de forma diferente:

- Estado de carga.
- Listado con resultados.
- Listado vacío.
- Error al obtener información.
- Operación realizada correctamente.
- Error durante una operación.
- Error de validación.
- Error de permisos.

La interfaz MUST mantener los datos del formulario cuando una operación falla, salvo que el
usuario decida descartarlos. MUST NOT mostrarse un estado vacío cuando en realidad se ha producido
un error de carga.

## Calidad y pruebas

### Estrategia

- Las pruebas MAY ser manuales, automatizadas o una combinación de ambas.
- MUST NOT imponerse una herramienta de testing de frontend sin una decisión previa en la
  especificación o el plan. La estrategia y, si procede, la herramienta MUST elegirse en la
  especificación y el plan.
- El backend MUST seguir usando Jest y Supertest. La suite existente MUST pasar antes de dar por
  terminada cualquier modificación del backend o del contrato compartido.
- La verificación de aceptación MUST ejecutarse contra el backend real.
- Las pruebas unitarias MAY aislar la capa HTTP, pero MUST existir al menos una comprobación de
  integración real del recorrido completo.

### Comprobaciones mínimas

Las comprobaciones MUST cubrir, como mínimo:

- Login correcto.
- Login incorrecto.
- Cierre de sesión.
- Listado con datos.
- Listado vacío.
- Error al cargar el listado.
- Creación válida.
- Creación inválida.
- Edición válida.
- Edición inválida.
- Cancelación de una edición sin guardar.
- Confirmación y cancelación del borrado.
- Actualización del listado después de crear, editar o eliminar.
- Actualización del detalle después de editar.
- Restricciones de acceso a acciones de otros usuarios.
- Persistencia y recuperación de la sesión al recargar.
- Gestión de un `401` por token caducado o inválido.
- Integración con el backend real.
- Recorrido completo de todas las páginas del listado cuando haya paginación.

### Recorrido completo obligatorio

MUST poder ejecutarse un recorrido completo con el backend real:

1. Iniciar sesión.
2. Crear un elemento.
3. Localizarlo en el listado.
4. Consultar su detalle.
5. Editarlo.
6. Eliminarlo.
7. Cerrar sesión.

Los pasos, los datos necesarios, los resultados esperados y los resultados obtenidos MUST quedar
documentados. El registro MUST incluir, como mínimo:

| Paso | Datos utilizados | Resultado esperado | Evidencia que debe registrarse |
|---|---|---|---|
| Iniciar sesión | Usuario de prueba | Sesión iniciada y usuario identificado | Usuario, fecha, código HTTP y resultado observado |
| Crear anuncio | Título, descripción, precio, categoría e imagen opcional | Anuncio creado y visible | Identificador del anuncio y datos observados |
| Localizar en listado | Título o filtro | Anuncio localizado en la página correcta | Página, filtros y resultado observado |
| Consultar detalle | Identificador del anuncio | Detalle correcto y acciones de autor | Datos mostrados y acciones disponibles |
| Editar | Campo modificado | Cambio visible en detalle y listado | Antes, después y resultado observado |
| Eliminar | Identificador del anuncio y confirmación | Anuncio eliminado del listado | Confirmación mostrada y resultado observado |
| Cerrar sesión | Acción de logout | Sesión eliminada y datos privados ocultos | Estado de la sesión y datos privados comprobados |

La documentación de la Práctica 4 MUST completar esta tabla con los resultados obtenidos reales. No
se admiten resultados hipotéticos ni una tabla sin evidencia en la entrega final.

### Datos de prueba

El seed del backend crea dos usuarios con la contraseña `Clasify123!`:

| Email | Nombre |
|---|---|
| `ana@example.com` | Ana Ruiz |
| `carlos@example.com` | Carlos Díaz |

También crea ocho categorías y veinticuatro anuncios, dos de ellos vendidos. Con el límite por
defecto de veinte, el listado tiene dos páginas. Estos datos MAY usarse para las pruebas manuales,
pero MUST NOT sustituir la integración real.

### Evidencias

- Cada tarea MUST registrar los comandos ejecutados y su resultado.
- Las pruebas del backend MUST ejecutarse con `cd backend && npm test` y la base
  `clasify_test` preparada.
- Las pruebas manuales MUST indicar fecha, entorno, usuario utilizado y resultado.
- Los errores conocidos MUST documentarse en la sección de limitaciones del README, no ocultarse.

## Documentación y reproducibilidad

### README obligatorio

El `README.md` MUST permitir que otra persona instale, ejecute y compruebe el proyecto. MUST incluir:

- Descripción del proyecto.
- Tecnologías utilizadas y versiones reales.
- Requisitos previos.
- Instalación de dependencias del backend y del frontend.
- Configuración del entorno.
- Arranque del frontend.
- Preparación y arranque del backend.
- Variables de entorno necesarias.
- Usuario de prueba y datos de ejemplo.
- Ejecución de las pruebas.
- Funcionalidades adicionales implementadas.
- Limitaciones conocidas.
- Estructura del repositorio.
- Referencia a la documentación SDD de `specs/`.

### Variables de entorno

- El backend MUST mantener `backend/.env.example` con todas las variables necesarias y sin
  credenciales reales.
- El frontend MUST disponer de su propio `.env.example` cuando se cree, con `VITE_API_URL` y
  cualquier otra variable necesaria.
- Los ficheros `.env` y sus variantes locales MUST NOT versionarse, salvo `.env.example`.
- La documentación MUST indicar cómo generar un `JWT_SECRET` seguro y cómo configurar
  `FRONTEND_ORIGIN`.

### Higiene del repositorio

- MUST NOT incluirse `node_modules`, `dist`, `coverage`, ficheros `.env` reales ni artefactos
  generados innecesarios.
- Las imágenes subidas por los usuarios MUST NOT versionarse; solo se admite el marcador de la
  carpeta.
- Los archivos temporales, logs y configuraciones locales MUST NOT formar parte de la entrega.
- La documentación SDD MUST mantenerse actualizada y reflejar las decisiones y funcionalidades
  realmente implementadas.

### Documentación SDD

- La documentación de especificaciones, planes y tareas MUST vivir en `specs/`, con la estructura
  que genere Spec Kit.
- Cada funcionalidad nueva MUST tener su especificación, plan y lista de tareas antes de
  implementarse.
- La documentación MUST distinguir entre funcionalidades obligatorias, funcionalidades adicionales
  aprobadas y funcionalidades fuera de alcance.
- Las decisiones técnicas nuevas MUST registrarse en el plan correspondiente y, si afectan a la
  arquitectura o a las tecnologías obligatorias, MUST reflejarse en una enmienda de esta
  constitución.

### Limitaciones conocidas

El README MUST documentar las limitaciones reales. En el estado verificado se conocen, al menos,
las siguientes:

- El logout es del lado del cliente porque el JWT es stateless y no hay lista negra de tokens.
- No se puede quitar solo la imagen de un anuncio: al editarlo se puede sustituir, pero no dejar el
  campo vacío sin subir una nueva.
- Pagos, envíos, moderación automática y moderación de valoraciones están fuera de alcance.

## Flujo de trabajo y Git

### Modelo observado

El repositorio usa un modelo simplificado de ramas:

- `master`: rama estable.
- `develop`: rama de integración, actualmente con los últimos cambios.
- `feat/backend`: rama de funcionalidad del backend.

No se ha encontrado evidencia de Git Flow completo, de Pull Requests ni de integración continua.
Esta constitución MUST NOT imponer Git Flow si el equipo mantiene este modelo simplificado.

### Ramas

- Las funcionalidades nuevas MUST desarrollarse en ramas `feat/<nombre-descriptivo>`.
- Las correcciones MUST usar `fix/<nombre-descriptivo>` cuando se adopte esa convención.
- La documentación y la gobernanza MAY usar `docs/<nombre-descriptivo>`.
- Los nombres MUST ser cortos, en minúsculas y separados por guiones.
- Las ramas de funcionalidad MUST partir de `develop` y MUST integrarse de nuevo en `develop`.
- `master` MUST mantenerse como rama estable y MUST NOT recibir trabajo directo sin revisión.
- MUST NOT reescribirse el historial de ramas publicadas sin justificación y coordinación.

### Commits

- Los commits MUST ser pequeños, descriptivos y relacionados con un cambio concreto.
- Los commits nuevos SHOULD seguir Conventional Commits con el formato
  `tipo(alcance): descripción`, por ejemplo `feat(anuncios): añadir formulario de edición`.
- Los tipos permitidos SHOULD ser `feat`, `fix`, `docs`, `test`, `refactor` y `chore`.
- La descripción MAY escribirse en español. MUST NOT mezclarse idiomas dentro del mismo commit de
  forma innecesaria.
- MUST NOT incluirse secretos, credenciales, `.env`, `node_modules`, `dist`, `coverage` ni
  artefactos generados.
- Un commit MUST NOT mezclar cambios no relacionados de varias tareas.

### Pull Requests y revisión

- No existe actualmente un flujo formal de Pull Requests. Si se adopta, cada Pull Request MUST
  corresponder a una funcionalidad o corrección concreta, MUST referenciar la especificación o
  tarea correspondiente y MUST incluir las comprobaciones realizadas.
- La revisión MUST comprobar el cumplimiento de esta constitución, la ausencia de comentarios en el
  código nuevo o modificado, la separación de responsabilidades y la integración con el backend
  real.
- MUST NOT aprobarse un cambio que introduzca regresiones, invente contratos o sustituya el backend
  por datos simulados.

### Historial

- El historial MUST permitir entender qué se hizo y por qué.
- Los mensajes de commit MUST NOT ser genéricos si el cambio tiene varios efectos.
- Las tareas de Spec Kit y los commits SHOULD poder relacionarse mediante el nombre de la
  funcionalidad o el identificador de la tarea.

## Implementación mediante Spec Kit

### Flujo obligatorio

Todos los desarrollos de nuevas funcionalidades MUST seguir la metodología Spec-Driven Development:

1. **Constitution**: reglas y principios del proyecto.
2. **Specify**: definición de requisitos y criterios de aceptación.
3. **Plan**: diseño técnico y decisiones de implementación.
4. **Tasks**: división del trabajo en tareas concretas.
5. **Implement**: desarrollo de las tareas.

- La especificación MUST aprobarse antes del plan.
- El plan MUST aprobarse antes de generar las tareas.
- Las tareas MUST aprobarse antes de implementar.
- La implementación MUST seguir el orden de las tareas y MUST NOT adelantar trabajo de tareas
  posteriores.
- Si una tarea revela un requisito no previsto, MUST detenerse y actualizar la especificación o el
  plan antes de continuar.

### Reglas para los agentes de IA

Antes de implementar, el agente MUST:

- Analizar el código existente relacionado con la funcionalidad.
- Leer la especificación, el plan y las tareas aprobadas.
- Comprobar si la funcionalidad ya existe total o parcialmente.
- Identificar los contratos del backend que va a utilizar.
- Identificar los archivos que va a modificar y limitar el cambio a ese alcance.

Durante la implementación, el agente MUST:

- No duplicar funcionalidades ya implementadas.
- No modificar código ajeno al alcance de la especificación.
- No introducir dependencias innecesarias.
- Respetar la arquitectura y las convenciones existentes.
- No inventar endpoints, campos ni contratos del backend.
- No sustituir integraciones reales por datos simulados.
- No añadir comentarios al código nuevo o modificado.
- Validar los cambios realizados.
- Mantener actualizada la documentación.
- Respetar siempre la regla de código sin comentarios.

El agente MUST NOT:

- Implementar funcionalidades adicionales no aprobadas.
- Cambiar la tecnología obligatoria sin enmienda.
- Modificar el backend para adaptarlo a una suposición del frontend sin especificación.
- Ocultar errores o limitaciones conocidas.
- Dar una tarea por terminada sin comprobaciones.

### Implementación por tareas

El agente MUST detenerse al finalizar cada tarea de la lista de tareas. Después de cada tarea MUST:

1. Resumir los cambios realizados.
2. Indicar los archivos modificados.
3. Explicar las comprobaciones realizadas.
4. Indicar posibles problemas o limitaciones.
5. Esperar la revisión del usuario antes de continuar.

El agente MUST NOT encadenar varias tareas sin intervención del usuario. Si no puede completar una
tarea, MUST detenerse, explicar el bloqueo y proponer la siguiente acción.

### Ubicación de los artefactos

- La constitución vive en `.specify/memory/constitution.md`.
- Las especificaciones, planes y tareas viven en `specs/`, con la estructura que genere Spec Kit.
- La documentación de diseño existente en `Diseno.md` MUST conservarse como referencia del backend.
- Los cambios de gobernanza MUST reflejarse en esta constitución y en su Sync Impact Report.

## Requisitos adicionales y control del alcance

Las siguientes funcionalidades del enunciado son adicionales. MUST NOT considerarse obligatorias
salvo que se aprueben expresamente en una especificación:

- Búsqueda integrada con paginación.
- Navegación mediante Vue Router.
- Mejora de la interfaz mediante una biblioteca de componentes.
- Gestión de un recurso secundario.
- Implementación parcial con otro framework, como React, Svelte o Angular.

Cuando se apruebe alguna de estas ampliaciones, MUST cumplirse lo siguiente:

- Documentarse mediante Spec Kit con especificación, plan y tareas.
- Respetar la arquitectura, las convenciones y los contratos existentes.
- Utilizar el backend compartido cuando corresponda.
- Incluir sus propias validaciones y comprobaciones.
- No perjudicar el funcionamiento de los requisitos básicos.
- No sustituir ni retrasar injustificadamente las funcionalidades obligatorias.
- Actualizar el README con el estado real de la funcionalidad.

Reglas específicas:

- **Búsqueda con paginación**: MUST usar los parámetros `texto`, `categoria`, `orden`, `estado`,
  `pagina` y `limite` del backend. Al cambiar de página MUST conservarse los filtros.
- **Vue Router**: MUST cumplir las reglas de navegación de esta constitución y MUST permitir
  acceder directamente a las vistas mediante URL.
- **Biblioteca de componentes**: MUST justificarse su compatibilidad con Vue y MUST mantenerse una
  apariencia coherente. MUST NOT mezclarse varias bibliotecas sin justificación.
- **Recurso secundario**: los favoritos ya están implementados en el backend y MAY ser el recurso
  secundario. Cualquier otro recurso MUST existir en el backend o MUST especificarse con su
  correspondiente cambio de backend.
- **Otro framework**: MUST ser una implementación parcial, MUST NOT sustituir la implementación
  principal en Vue y MUST aprobarse expresamente.

La implementación de funcionalidades adicionales MUST NOT retrasar las funcionalidades
obligatorias. Si el tiempo es limitado, las funcionalidades básicas tienen prioridad.

## Gobernanza

### Prevalencia

Esta constitución prevalece sobre las demás prácticas, convenciones y decisiones de desarrollo del
proyecto. Cualquier cambio que entre en conflicto con ella MUST justificarse y aprobarse mediante
una actualización de la constitución.

### Procedimiento de enmienda

Toda modificación MUST:

- Estar justificada por una necesidad técnica, académica o de calidad.
- Mantener la coherencia del proyecto.
- Analizar el impacto sobre las especificaciones, planes, tareas, código y documentación.
- Actualizar la versión del documento.
- Actualizar la fecha de última modificación.
- Reflejarse en el Sync Impact Report.
- Ser revisada y aprobada por el responsable del proyecto.

El procedimiento es:

1. Proponer el cambio y explicar el problema que resuelve.
2. Identificar los principios o secciones afectados.
3. Evaluar el impacto y las alternativas.
4. Aprobar o rechazar la enmienda.
5. Actualizar `.specify/memory/constitution.md`.
6. Actualizar el Sync Impact Report y la versión.
7. Comunicar el cambio y ajustar la documentación dependiente.

### Versionado semántico

La constitución usa versionado semántico:

- **MAYOR**: eliminación o redefinición incompatible de principios existentes.
- **MENOR**: incorporación de principios, secciones o cambios importantes en las reglas.
- **PARCHE**: correcciones, aclaraciones o cambios de redacción que no alteran el significado.

La versión inicial es `1.0.0`. Cada enmienda MUST incrementar la versión según el tipo de cambio y
MUST actualizar la fecha de última modificación. La fecha de ratificación original MUST conservarse.

### Cumplimiento

- Toda especificación, plan y lista de tareas MUST incluir una comprobación de cumplimiento de esta
  constitución.
- Toda revisión de código MUST verificar los principios aplicables, especialmente la separación de
  responsabilidades, la ausencia de comentarios en código nuevo o modificado, la seguridad y la
  integración con el backend real.
- Las desviaciones MUST justificarse por escrito y aprobarse antes de implementarse. Una desviación
  recurrente MUST convertirse en una enmienda de la constitución.
- Las excepciones MUST tener alcance limitado y duración limitada; MUST NOT usarse como exención
  permanente.
- El incumplimiento de la constitución MUST bloquear la finalización de la tarea hasta que se
  corrija o se apruebe una enmienda.
- La revisión final de la Práctica 4 MUST comprobar el recorrido completo con el backend real y la
  documentación de resultados.

### Interpretación

- Las reglas MUST interpretarse de forma que se preserve la simplicidad, la seguridad y la
  integración real con el backend.
- Si una regla admite varias interpretaciones, MUST elegirse la que menor complejidad introduzca y
  MUST documentarse la decisión.
- La ausencia de una regla explícita MUST NOT interpretarse como permiso para introducir
  tecnologías, dependencias o funcionalidades no aprobadas.

**Versión**: 1.0.0 | **Ratificada**: 2026-11-10 | **Última modificación**: 2026-11-10
