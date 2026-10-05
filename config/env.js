// Carga las variables del archivo .env (en Render se configuran en el panel)
require('dotenv').config();

const obligatorias = ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY', 'JWT_SECRET'];
const faltan = obligatorias.filter((nombre) => !process.env[nombre]);

if (faltan.length) {
  console.error(`❌ Faltan variables de entorno: ${faltan.join(', ')}`);
  console.error('   Crea un archivo .env a partir de .env.example');
  process.exit(1);
}

module.exports = {
  PORT: process.env.PORT || 3000,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h'
};
