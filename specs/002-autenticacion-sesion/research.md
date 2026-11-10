# Research: Registro, acceso y sesión de usuario

**Feature**: `002-autenticacion-sesion`  
**Date**: 2026-11-10  
**Status**: Complete — no `NEEDS CLARIFICATION` remaining

## Decisions

### 1. Token en `sessionStorage` con clave `clasify.session.token`

**Decision**: guardar únicamente el token en `sessionStorage`; mantener el usuario en memoria en la store de sesión.

**Rationale**: la sesión se recupera al recargar la misma pestaña sin persistir datos privados ni contraseñas. `sessionStorage` no se comparte entre pestañas y encaja con la decisión de sesión por pestaña de la spec.

**Alternatives considered**:
- `localStorage`: descartado por persistencia entre pestañas y reinicios, con mayor exposición.
- Cookie de sesión: descartada porque el backend usa JWT stateless y no cookies.
- Guardar también el usuario en `sessionStorage`: descartado para evitar datos privados persistidos innecesariamente; `/auth/yo` recupera el usuario.

---

### 2. `useSessionStore` como única fuente de sesión

**Decision**: crear `src/stores/session.js` con `useSessionStore`. Expone token, usuario, estado, error y `sessionVersion`.

**Rationale**: centraliza la sesión y evita que la cabecera, las guardas y los formularios mantengan copias divergentes. `sessionVersion` permite que las stores de datos privados de las specs 005 y 006 limpien su estado cuando la sesión cambia a visitante.

**Alternatives considered**:
- Estado de sesión en cada vista: descartado por duplicación.
- Guardar la sesión en un composable sin Pinia: descartado porque la constitución exige Pinia para estado compartido.
- Importar stores privadas desde la store de sesión: descartado por acoplamiento y ciclos.

---

### 3. `authService` sobre la capa HTTP base

**Decision**: crear `src/services/authService.js` con `registrar`, `iniciarSesion` y `obtenerUsuarioActual`.

**Rationale**: mantiene las URLs y los contratos fuera de los componentes y reutiliza la capa HTTP de 001. Los componentes no conocen endpoints ni cabeceras.

**Alternatives considered**:
- Llamadas directas desde formularios: descartadas por la constitución.
- Incluir la autenticación en la store: descartado para mantener la separación entre estado y acceso HTTP.

---

### 4. Restauración de sesión al arrancar

**Decision**: si existe token en `sessionStorage`, la store pasa a `comprobando`, llama a `/auth/yo` y resuelve a `autenticado` o `visitante`. Si falla por red, pasa a `error`, conserva el token y permite reintentar. Si falla por sesión inválida, limpia el token y pasa a `visitante`.

**Rationale**: evita mostrar acciones privadas de forma prematura y distingue un fallo de conexión de una sesión inválida. No se inventa una sesión válida.

**Alternatives considered**:
- Considerar autenticado solo por tener token: descartado por seguridad y por el riesgo de mostrar datos privados con un token caducado.
- Limpiar el token ante cualquier error, incluido uno de red: descartado porque obligaría a un login innecesario por un fallo temporal.

---

### 5. Frontera de `401`

**Decision**: la capa HTTP entrega el error normalizado a la store de sesión. La store limpia la sesión solo ante códigos de sesión (`SIN_TOKEN`, `TOKEN_INVALIDO`, `TOKEN_CADUCADO`, `USUARIO_NO_EXISTE`). Un `CREDENCIALES_INVALIDAS` de login o de contraseña actual se trata como error de formulario.

**Rationale**: evita expulsar al usuario cuando escribe mal su contraseña actual en el cambio de contraseña de la spec 006, y mantiene la limpieza automática cuando el token ya no sirve.

**Alternatives considered**:
- Limpiar la sesión ante cualquier `401`: descartado porque rompe el cambio de contraseña y pierde datos del formulario.
- No limpiar nunca la sesión desde la capa HTTP: descartado porque dejaría tokens caducados activos en la interfaz.

---

### 6. Logout local y limpieza de datos privados

**Decision**: `cerrarSesion` elimina el token de `sessionStorage`, limpia el usuario, incrementa `sessionVersion` y navega a una vista pública. No se llama a ningún endpoint de logout.

**Rationale**: el backend no tiene logout ni lista negra de tokens. El cierre debe dejar la interfaz sin información privada y permitir que las stores privadas se vacíen.

**Alternatives considered**:
- Inventar un endpoint de logout: descartado.
- Mantener el usuario en memoria tras el logout: descartado por privacidad.
- Sincronizar el logout entre pestañas: fuera de alcance.

---

### 7. Guardas de rutas

**Decision**: conectar las rutas protegidas de 001 con la store de sesión. Si no hay sesión, redirigir a `/login` con la ruta solicitada; si el usuario ya está autenticado y abre `/login` o `/registro`, redirigir a una vista principal.

**Rationale**: la navegación debe ser coherente y conservar la intención del usuario. La autorización real sigue en el backend.

**Alternatives considered**:
- Ocultar solo enlaces sin proteger rutas: descartado porque la URL directa seguiría mostrando la vista.
- Guardas basadas en la presencia de token sin comprobar `/auth/yo`: descartado por riesgo de sesión inválida.

---

### 8. Validación de formularios

**Decision**: validar en cliente email, nombre y contraseña antes de enviar; mostrar errores del backend por campo; impedir doble envío; conservar el email ante fallos.

**Rationale**: reduce errores evitables y ofrece feedback inmediato sin sustituir la validación del backend.

**Alternatives considered**:
- Enviar siempre y mostrar solo errores del backend: descartado por peor experiencia.
- Validación solo en cliente: descartada porque el backend es la autoridad.

---

### 9. Sin refresh token ni sincronización entre pestañas

**Decision**: no implementar refresh token, renovación automática ni sincronización de sesión entre pestañas.

**Rationale**: el backend no emite refresh tokens y la sesión se decide por pestaña. La complejidad añadida no aporta valor al alcance.

**Alternatives considered**:
- Refresh token: no existe en el backend.
- Sincronización con eventos de almacenamiento: fuera de alcance y contradice la decisión de sesión por pestaña.

---

### 10. Pruebas

**Decision**: Vitest cubrirá `authService`, `sessionStore`, guardas y formularios; la validación manual se hará contra el backend real.

**Rationale**: permite probar contratos, transiciones de sesión y errores sin sustituir la comprobación real del flujo completo.

**Alternatives considered**:
- Solo pruebas manuales: descartado por la constitución.
- Pruebas E2E automatizadas en esta feature: se dejan para el recorrido manual de la Práctica 4.

## Open Questions

Ninguna. Todas las decisiones de `Technical Context` están resueltas para la fase de diseño.
