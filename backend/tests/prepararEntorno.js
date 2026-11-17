'use strict';

const path = require('node:path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env'), quiet: true });

process.env.NODE_ENV = 'test';
process.env.DB_NAME = process.env.DB_TEST_NAME || 'clasify_test';

// Los tests de CORS no deben depender del FRONTEND_ORIGIN que tenga el
// desarrollador en su .env: se fija el origen de Vite para que la suite sea
// reproducible en cualquier máquina.
process.env.FRONTEND_ORIGIN = 'http://localhost:5173';
