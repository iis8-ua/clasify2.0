'use strict';

const path = require('node:path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env'), quiet: true });

const obligatorias = ['JWT_SECRET', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const faltantes = obligatorias.filter((clave) => !process.env[clave]);

if (faltantes.length > 0) {
  throw new Error(
    `Faltan variables de entorno obligatorias: ${faltantes.join(', ')}. ` +
      'Revisa backend/.env (plantilla en backend/.env.example).'
  );
}

/** Tipos de imagen aceptados y la extensión con la que se guarda cada uno. */
const TIPOS_IMAGEN = new Map([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp']
]);

module.exports = {
  port: Number(process.env.PORT) || 3000,
  esTest: process.env.NODE_ENV === 'test',
  /**
   * Orígenes autorizados por CORS. Se separan por comas para poder permitir a la
   * vez el servidor de desarrollo de Vite (5173) y el de `vite preview` (4173)
   * sin tener que recompilar el backend. Sin la variable se usan esos dos, que
   * son los puertos por defecto de Vite.
   */
  origenesFrontend: (
    process.env.FRONTEND_ORIGIN || 'http://localhost:5173,http://localhost:4173'
  )
    .split(',')
    .map((origen) => origen.trim())
    .filter((origen) => origen !== ''),
  uploads: {
    carpeta: path.join(__dirname, '..', 'uploads'),
    tamanoMaximo: 5 * 1024 * 1024,
    tipos: TIPOS_IMAGEN
  },
  jwt: {
    secreto: process.env.JWT_SECRET,
    caducidad: process.env.JWT_EXPIRES_IN || '1h'
  },
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    puerto: Number(process.env.DB_PORT) || 3306,
    usuario: process.env.DB_USER,
    contrasena: process.env.DB_PASSWORD,
    base: process.env.DB_NAME,
    nombreBaseTest: process.env.DB_TEST_NAME || 'clasify_test',
    conexiones: Number(process.env.DB_POOL_SIZE) || 10
  }
};
