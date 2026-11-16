# Research: Frontend alternativo con React

**Feature**: `010-frontend-alterno-react`  
**Date**: 2026-11-16  
**Status**: Complete — no `NEEDS CLARIFICATION` remaining

## Decisions

### 1. React con Vite

**Decision**: usar React `19.3.1` con Vite `7.3.8` y JavaScript ES2022.

**Rationale**: React es el framework alternativo más habitual y permite demostrar el mismo backend
con otra forma de dividir componentes y gestionar estado. Vite mantiene el mismo modelo de desarrollo
que el frontend principal.

**Alternatives considered**:
- Svelte: también válido, pero React tiene más soporte y encaja mejor con el ejemplo del enunciado.
- Angular: añade más estructura y dependencias para el alcance reducido.
- TypeScript: no aporta valor al alcance y aumenta la configuración.

---

### 2. Proyecto separado

**Decision**: crear `frontend-react/` como proyecto independiente, con su propio `package.json`,
`vite.config.js`, `.env.example` y pruebas.

**Rationale**: el enunciado pide un proyecto separado y así no se mezclan dependencias ni convenciones
de Vue con React.

**Alternatives considered**:
- Añadir React dentro de `frontend-vue/`: descartado por mezclar frameworks y dependencias.
- Un único proyecto con microfrontends: complejidad innecesaria.

---

### 3. Alcance parcial: listado y borrado

**Decision**: implementar solo listado paginado, sesión y borrado de anuncios propios.

**Rationale**: es exactamente el alcance del apartado adicional. Repetir crear, editar, detalle,
favoritos, perfil, mensajería o valoraciones no aporta puntos y multiplica el mantenimiento.

**Alternatives considered**:
- Repetir todo el frontend: descartado por coste y riesgo.
- Implementar solo listado sin borrado: no cumple el apartado adicional.

---

### 4. Listado público y autenticación para borrar

**Decision**: el listado se muestra sin sesión. El login se ofrece en la misma vista y solo es
necesario para identificar anuncios propios y borrarlos.

**Rationale**: replica el comportamiento público del catálogo y mantiene la autenticación donde el
backend la exige.

**Alternatives considered**:
- Exigir sesión para listar: más restrictivo que el frontend principal y sin necesidad.
- Ocultar el login hasta pulsar borrar: añade un paso y complica la demostración.

---

### 5. Servicios compartidos

**Decision**: extraer `http`, `errors`, `authService`, `anunciosService` y `categoriasService` a
`shared/api/`. Vue y React consumen la misma implementación.

**Rationale**: el enunciado pide reutilizar los servicios independientes del framework. La extracción
evita duplicar la lógica de errores, autenticación y acceso HTTP.

**Alternatives considered**:
- Copiar los servicios en React: funciona, pero duplica lógica y dificulta el mantenimiento.
- Importar desde `frontend-vue/` directamente: acopla React a la estructura de Vue y es menos claro.
- Crear un paquete npm: excesivo para dos aplicaciones del mismo repositorio.

---

### 6. Sesión en `sessionStorage`

**Decision**: guardar el token en `sessionStorage` con una clave propia del frontend React. Al
arrancar, si hay token, recuperar el usuario con `GET /auth/yo`.

**Rationale**: mantiene la sesión por pestaña, como el frontend principal, y evita persistir datos
privados más tiempo del necesario.

**Alternatives considered**:
- `localStorage`: persiste demasiado y no es necesario.
- Memoria: pierde la sesión al recargar.
- Cookie: el backend usa JWT y no está preparado para cookies.

---

### 7. Una sola vista y sin router

**Decision**: resolver login, listado y confirmación en una única vista React.

**Rationale**: el alcance no necesita rutas profundas. Añadir React Router sería complejidad sin
valor para el apartado adicional.

**Alternatives considered**:
- Router con `/login` y `/anuncios`: más realista, pero innecesario.
- Dos vistas separadas: obliga a navegar y añade estado de ruta.

---

### 8. Paginación fija de 20

**Decision**: enviar siempre `limite=20` y conservar solo la página en el estado.

**Rationale**: mantiene consistencia con el frontend principal después del cambio a paginación fija.

**Alternatives considered**:
- Selector de tamaño: fuera del alcance y eliminado del frontend principal.
- Paginación infinita: fuera de alcance.

---

### 9. Categorías e imágenes

**Decision**: cargar las categorías una vez para mostrar su nombre en las tarjetas. Si falla la carga
de categorías, el listado sigue visible con un nombre de respaldo. La URL de la imagen se resuelve
con un helper de presentación propio de React.

**Rationale**: el listado del backend solo devuelve `id_categoria`, no el nombre. El usuario necesita
un texto comprensible y la imagen no debe bloquear el listado.

**Alternatives considered**:
- Mostrar solo el id de categoría: poco comprensible.
- Ocultar la categoría: incumple la información mínima de la tarjeta.
- Bloquear el listado si fallan las categorías: empeora la experiencia sin necesidad.

---

### 10. Borrado con confirmación

**Decision**: mostrar una confirmación en línea con el título del anuncio, botón de confirmar y botón
de cancelar. Deshabilitar la confirmación mientras se envía la petición.

**Rationale**: evita borrados accidentales y permite cancelar sin llamar al backend.

**Alternatives considered**:
- `window.confirm`: funcional, pero menos controlable y menos accesible.
- Borrado directo: incumple el requisito de confirmación.

---

### 11. Permisos

**Decision**: mostrar la acción de borrar solo cuando `id_autor` coincide con el usuario de la sesión.
El backend sigue comprobando la autoría y puede responder `403`.

**Rationale**: la interfaz evita ofrecer acciones que fallarán, pero no sustituye la autorización del
backend.

**Alternatives considered**:
- Mostrar siempre el botón y confiar en el error: peor experiencia.
- Comprobar permisos solo en frontend: inseguro.

---

### 12. Estados y errores

**Decision**: representar carga, resultados, vacío, error y reintento. Tras borrar, recargar la
página actual; si queda vacía y no es la primera, cargar la anterior. Un `401` limpia la sesión; un
`403` muestra permisos; un `404` converge a retirar el anuncio; un `5xx` o fallo de red conserva el
anuncio y permite reintentar.

**Rationale**: sigue las convenciones de estados y errores de 001–009 y evita datos obsoletos.

**Alternatives considered**:
- Quitar el anuncio del estado local sin recargar: puede descuadrar la paginación.
- Mantener la sesión tras un `401`: mostraría acciones privadas obsoletas.

---

### 13. CORS y puerto

**Decision**: documentar que React se ejecuta en un puerto permitido por `FRONTEND_ORIGIN`. Si se
ejecuta en `5174`, se añade ese origen al entorno local del backend.

**Rationale**: el backend ya permite `5173` y `4173`; no se modifica código para CORS.

**Alternatives considered**:
- Cambiar el backend para permitir cualquier origen: inseguro y fuera de alcance.
- Usar un proxy de Vite: válido, pero añade configuración innecesaria.

---

### 14. Pruebas

**Decision**: Vitest y React Testing Library cubrirán login, listado, paginación, borrado,
cancelación, permisos, errores y accesibilidad. La validación manual usará los usuarios del seed y
una prueba de integración opcional contra el backend real.

**Rationale**: permite comprobar el alcance sin sustituir el backend real y demuestra que la
autenticación y el borrado funcionan con otro framework.

**Alternatives considered**:
- Solo pruebas manuales: insuficiente para la constitución.
- E2E de navegador: se deja como validación manual.

---

### 15. Sin cambios en el backend

**Decision**: reutilizar los endpoints existentes y no modificar rutas, servicios, esquema ni
contratos.

**Rationale**: el backend ya ofrece login, sesión, listado, categorías y borrado con permisos.

**Alternatives considered**:
- Añadir endpoints específicos para React: innecesario y fuera de alcance.
- Duplicar la autorización en frontend: inseguro.

## Open Questions

Ninguna. El alcance, la arquitectura, los contratos y las pruebas están definidos para la fase de
diseño.
