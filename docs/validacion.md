# Registro de validación

**Fecha**: 2026-11-11  
**Alcance**: frontend de las specs 001–006 contra el backend real de la Práctica 1.  
**Entorno**: Ubuntu 24.04.5 LTS, Node.js `v26.8.2`, npm `11.19.1`, MySQL `8.0.46`, backend en
`http://localhost:3000/clasify_api` y frontend servido con Vite `7.3.8`.

## 1. Comprobaciones automatizadas

| Comprobación | Comando | Resultado obtenido |
|---|---|---|
| Pruebas del backend (Jest + Supertest) | `cd backend && npm test` | 6 suites y 307 pruebas correctas, 0 fallos, 201,965 s |
| Pruebas del frontend (Vitest) | `cd frontend-vue && npm run test:unit` | 51 archivos (50 ejecutados y 1 omitido), 205 pruebas (202 ejecutadas y 3 omitidas), 0 fallos, 8,21 s |
| Build de producción | `cd frontend-vue && npm run build` | 217 módulos transformados, build correcto, 1,75 s |
| Integración con el backend real | `cd frontend-vue && VALIDACION_BACKEND=1 npx vitest run tests/integracion/backendReal.spec.js` | 3 pruebas correctas, 0 fallos, 767 ms |

La suite `tests/integracion/backendReal.spec.js` está omitida por defecto para que
`npm run test:unit` no dependa de un backend arrancado. Se activa con `VALIDACION_BACKEND=1` y
monta las vistas reales del catálogo, el detalle y favoritos consumiendo la API real.

## 2. Recorrido funcional contra el backend real

Los datos de partida son los del seed documentado en `README.md`: dos usuarios
(`ana@example.com` y `carlos@example.com`, contraseña `Clasify123!`), ocho categorías y 24
anuncios, de los cuales 22 están disponibles y 2 vendidos. El recorrido se ejecutó con `curl` y
`jq` contra el backend real; los 29 controles terminaron correctamente.

| Paso | Resultado esperado | Resultado obtenido |
|---|---|---|
| `GET /salud` | `200` | `200` |
| `POST /auth/login` de Ana y de Carlos | `200` con token y usuario | `200`; Ana id 1 y Carlos autenticado |
| `GET /anuncios?pagina=1&limite=20` | Listado paginado | `200`; total 22 disponibles y 2 páginas |
| Detalle de un anuncio de Carlos como Ana | `es_favorito: false` | `200`; `es_favorito=false`, `num_favoritos=0` |
| Añadir un favorito nuevo | `201` | `201` |
| Añadir el mismo favorito otra vez | `200`, sin duplicado | `200` |
| Listar favoritos | El anuncio aparece | `200`; total 1, el anuncio está presente |
| Detalle tras guardar | `es_favorito: true` | `200`; `es_favorito=true` |
| Quitar el favorito | `204` | `204` |
| Quitar un favorito ya inexistente | `404` | `404` |
| Guardar un anuncio propio | `400 VALIDACION` | `400` |
| Crear un anuncio | `201` con `id` | `201`; id 25 |
| Consultar el anuncio creado | Título y datos correctos | `200`; título correcto |
| Editar el anuncio | `200` | `200` |
| Marcar el anuncio como vendido | `200` | `200` |
| Listado por defecto tras venderlo | El anuncio vendido no aparece | No aparece |
| Listado con `estado=vendido` | El anuncio aparece con su estado | Aparece una vez |
| Eliminar el anuncio | `204` | `204` |
| Consultar el anuncio eliminado | `404` | `404` |
| `GET /usuarios/me` | Perfil con email de Ana | `200`; `ana@example.com` |
| `PATCH /usuarios/me` con la biografía actual | `200` sin cambiar el dato | `200` |
| `GET /usuarios/me/anuncios` | Listado paginado propio | `200`; paginación correcta |
| `PATCH /usuarios/me` con contraseña actual incorrecta | `401 CREDENCIALES_INVALIDAS` sin cerrar la sesión | `401`; código `CREDENCIALES_INVALIDAS` |
| `GET /usuarios/me/favoritos` sin token | `401` | `401` |
| Favoritos con `pagina=0` | `400 VALIDACION` | `400` |
| Favoritos con página fuera de rango | Datos vacíos y paginación real | Datos vacíos; total de páginas correcto |

## 3. Recorrido de interfaz

La interfaz se comprobó montando las vistas reales con Vitest y la API real, además de la suite de
componentes. No se automatizó una sesión de navegador interactiva.

| Paso | Resultado esperado | Resultado obtenido y evidencia |
|---|---|---|
| Acceso con un usuario de prueba | Sesión iniciada y cabecera actualizada | `authService` obtiene `200` en la integración real; `sessionStore` y formularios cubiertos por Vitest |
| Listado de anuncios | Tarjetas con datos reales del backend | `AnunciosListView` montada contra la API real muestra tarjetas y títulos |
| Paginación y filtros | Página y filtros en la dirección y sin perder contexto | Pruebas de `catalogQuery`, `pagination` y `catalogFilters` |
| Detalle | Título, autor, categoría, estado, fecha y número de favoritos | `AnuncioDetalleView` montada contra la API real muestra el detalle y el contador |
| Añadir favorito | Botón guardado, contador actualizado y confirmación | Integración real: primer alta `201` y segunda `200`; `BotonFavorito` no incrementa el contador en el segundo caso |
| Lista de favoritos | Tarjetas con el anuncio guardado y enlace al detalle | `FavoritosView` montada contra la API real muestra el anuncio; tarjetas con `h2` |
| Quitar favorito | Estado no guardado sin error incomprensible | `204` y `404` tratados como no guardado; pruebas del botón |
| Crear anuncio | Confirmación y apertura del detalle | `POST` real `201`; el detalle reemplaza al formulario en el historial para que volver no regrese a él |
| Editar anuncio | Solo campos modificados y actualización del detalle | `PATCH` real `200`; prueba de navegación tras guardar |
| Eliminar anuncio | Confirmación, retirada y vuelta al listado | `DELETE` real `204`; el detalle responde `404` después |
| Cerrar sesión | Se limpian sesión, favoritos y perfil de la pestaña | Pruebas de `sessionVersion` en `sessionStore`, `favoritosStore` y `perfilStore` |
| Perfil | Datos propios, edición y cambio de contraseña | `GET` y `PATCH` reales `200`; contraseña actual incorrecta `401` sin cerrar sesión |
| Accesibilidad y móvil | Teclado, foco, nombres accesibles y 360 px | Pruebas de accesibilidad de 001–006 y estilos con breakpoint de 48 rem |

## 4. Reproducción

```bash
cd backend
npm install
npm run db:create-databases
npm run db:schema
npm run db:seed
npm start
```

En otra terminal:

```bash
cd frontend-vue
npm install
npm run test:unit
npm run build
VALIDACION_BACKEND=1 npx vitest run tests/integracion/backendReal.spec.js
npm run dev
```

El recorrido HTTP puede repetirse con `curl` sobre `http://localhost:3000/clasify_api` usando los
usuarios del seed. Las pruebas de integración eliminan el favorito que crean.

## 5. Observaciones del entorno

- La base de datos de desarrollo contenía solo cuatro anuncios porque ejecuciones anteriores
  habían eliminado parte del seed. Se restauró con el procedimiento documentado en `README.md`
  (`DELETE FROM anuncios` y `npm run db:seed`) antes del recorrido; quedaron 24 anuncios.
- El backend no se modificó durante esta validación; las pruebas de Jest se ejecutaron sobre
  `clasify_test` y el recorrido funcional sobre `clasify`.
