# Research: Estructura común y navegación del frontend

**Feature**: `001-app-shell`  
**Date**: 2026-11-10  
**Status**: Complete — no `NEEDS CLARIFICATION` remaining

## Decisions

### 1. Vue 3.5.45

**Decision**: utilizar Vue `3.5.45` con JavaScript ES2022 y componentes de archivo único.

**Rationale**: es la versión estable de la línea 3.5, compatible con Pinia 3, Vue Router 4 y el plugin oficial de Vite. El proyecto no necesita TypeScript para cumplir el alcance.

**Alternatives considered**:
- Vue 3.6 pre-release: descartado por no ser una versión estable.
- TypeScript: descartado porque el contexto del proyecto fija JavaScript y no aporta valor obligatorio a esta feature.

---

### 2. Vite 7.3.8

**Decision**: utilizar Vite `7.3.8` y `@vitejs/plugin-vue` `6.0.10`.

**Rationale**: Vite 7.3.8 es estable, compatible con Vue 3.5 y con Vitest 3.2.7. Requiere Node.js
`^20.19.0 || >=22.12.0`. El plugin 6.0.10 soporta Vite 7 y 8. Esta combinación evita migrar a Vite
8 y Vitest 5 en la primera versión del frontend.

**Alternatives considered**:
- Vite `8.3.7`: descartado para no forzar Vitest 5 y una configuración más nueva en la base inicial.
- Webpack: descartado por complejidad y por no ser la herramienta declarada en el README.

---

### 3. Pinia 3.0.4

**Decision**: utilizar Pinia `3.0.4` para el estado compartido.

**Rationale**: es la línea estable 3.x, compatible con Vue 3.5.11 o superior y suficiente para la sesión, catálogo y listados. La feature 001 solo inicializa Pinia y define la frontera de sesión; las stores de negocio llegan en las specs 002–006.

**Alternatives considered**:
- Pinia `4.1.0`: descartado para evitar una línea nueva sin necesidad funcional.
- Vuex: descartado por no ser la tecnología aprobada.

---

### 4. Vue Router 4.6.4

**Decision**: utilizar Vue Router `4.6.4` con rutas por URL e historial del navegador.

**Rationale**: es la línea estable 4.x, compatible con Vue 3.5 y con el mapa de rutas aprobado. No requiere las dependencias adicionales de Vue Router 5.

**Alternatives considered**:
- Vue Router `5.4.0`: descartado porque su peer set incluye Pinia 4 y `@pinia/colada`, innecesarios para esta feature.
- Navegación solo por estado: descartada porque el alcance exige URLs directas, historial y rutas compartibles.

---

### 5. PrimeVue 4.5.5

**Decision**: utilizar PrimeVue `4.5.5`, `@primeuix/themes` `1.2.5` y `primeicons` `7.0.0`.

**Rationale**: PrimeVue 4.5.5 es la línea estable 4.x, ofrece los componentes necesarios y no incorpora la dependencia `@primeui/license-manager` que aparece en PrimeVue 5. El tema parte de un preset neutral y se personaliza con un color de acento, solo en modo claro.

**Alternatives considered**:
- PrimeVue `5.0.4`: descartado por la introducción del gestor de licencias y por ser una línea más nueva sin necesidad funcional.
- Componentes propios sin biblioteca: descartado porque el proyecto aprobó PrimeVue y porque aumentaría el trabajo de formularios, diálogos y tablas.
- Otra biblioteca: descartada por no estar aprobada.

---

### 6. Vitest 3.2.7, Vue Test Utils 2.5.1 y jsdom 26.1.0

**Decision**: usar Vitest `3.2.7` con `@vue/test-utils` `2.5.1` y `jsdom` `26.1.0`.

**Rationale**: Vitest 3.2.7 es compatible con Vite 7 y con Node.js 20 o superior. `@vue/test-utils` permite probar componentes y `jsdom` proporciona el entorno DOM. La combinación mantiene soporte para Node 20.19, el mínimo requerido por Vite 7.

**Alternatives considered**:
- Vitest `5.1.0`: descartado porque exige Node 22/24/26 y una configuración más nueva; no es necesario para esta base.
- `happy-dom`: válido, pero se elige `jsdom` por compatibilidad más extendida con componentes y APIs del DOM.
- Pruebas solo manuales: descartado porque la constitución y el contexto exigen Vitest para servicios, stores y componentes clave.

---

### 7. `fetch` nativo

**Decision**: implementar la capa HTTP con `fetch` y un módulo de normalización de errores.

**Rationale**: evita una dependencia adicional, permite controlar el formato de error del backend y es suficiente para los contratos actuales. La capa HTTP centraliza `VITE_API_URL`, cabeceras, `204`, JSON, `FormData` y errores.

**Alternatives considered**:
- axios: descartado por dependencia adicional y porque `fetch` cubre el alcance.
- Llamadas directas desde componentes: descartadas por la constitución.

---

### 8. Tema neutral con acento y solo modo claro

**Decision**: partir de un preset neutral de PrimeVue y personalizar tokens de color, tipografía, espaciado, bordes y sombras con un color de acento. No se implementa modo oscuro.

**Rationale**: mantiene coherencia visual en todas las vistas sin construir un sistema de diseño completo. El modo claro reduce alcance y pruebas.

**Alternatives considered**:
- Tema visual completamente propio: descartado por coste y por el principio de simplicidad.
- Modo oscuro: fuera de alcance.

---

### 9. Estructura de aplicación

**Decision**: usar `frontend-vue/` con `components`, `views`, `stores`, `services`, `router` y `styles`. Las vistas de negocio se añadirán en specs posteriores.

**Rationale**: coincide con la arquitectura aprobada en `docs/00-contexto-specs.md`, separa responsabilidades y permite que las specs 002–006 se integren sin reestructurar la base.

**Alternatives considered**:
- Estructura por capas dentro de una sola carpeta: descartada por menor claridad.
- Monorepo con paquetes separados: descartado por complejidad innecesaria.

---

### 10. Estados de interfaz compartidos

**Decision**: crear componentes reutilizables para carga, vacío, error, validación, permisos, éxito y confirmación. Las vistas de negocio los consumirán en las specs posteriores.

**Rationale**: evita que cada pantalla invente un lenguaje visual distinto y permite probar los estados de forma aislada.

**Alternatives considered**:
- Implementar estados dentro de cada vista: descartado por duplicación.
- Usar solo componentes de PrimeVue sin capa propia: insuficiente para un lenguaje de estados coherente.

---

### 11. Formato de precio y fecha

**Decision**: usar `Intl.NumberFormat` con locale `es-ES` y moneda EUR para precios, y `Intl.DateTimeFormat` con `es-ES` para fechas. La moneda se confirma en el plan y se documenta.

**Rationale**: el backend devuelve precios como cadenas decimales; el frontend debe presentarlos de forma legible y consistente. El proyecto se dirige a usuarios en España.

**Alternatives considered**:
- Mostrar el valor bruto del backend: descartado por mala experiencia.
- Fijar una moneda distinta sin decisión: descartado.

---

### 12. Sin cambios en el backend

**Decision**: no modificar `backend/`, el esquema ni los contratos. La feature 001 no realiza operaciones de datos.

**Rationale**: el backend ya está terminado y la constitución prohíbe cambios no especificados. La infraestructura HTTP queda preparada para las specs 002–006.

**Alternatives considered**:
- Añadir endpoints de soporte al shell: descartado porque no son necesarios.

## Open Questions

Ninguna. Todas las decisiones de `Technical Context` están resueltas para la fase de diseño.
