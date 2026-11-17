// Loaded via `node --import` before any application module, because config/env.js reads process.env on import.
import { fileURLToPath } from 'url';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.JWT_EXPIRES_IN = '1h';
process.env.TEMPLATES_PATH = fileURLToPath(new URL('../services/mail/templates', import.meta.url));
