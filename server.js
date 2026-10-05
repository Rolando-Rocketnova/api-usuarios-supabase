const { PORT } = require('./config/env'); // carga y comprueba el .env primero
const app = require('./app');

app.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
});
