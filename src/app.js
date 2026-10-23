require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDb } = require('./db/database');
const mascotasRoutes = require('./routes/mascotas.routes');
const { ValidationError, NotFoundError } = require('./errors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ servicio: 'TaskPet API', estado: 'ok' }));
app.use('/api/mascotas', mascotasRoutes);

// Ruta inexistente
app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

// Middleware centralizado de errores
app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(400).json({ error: err.message, detalles: err.details });
  }
  if (err instanceof NotFoundError) {
    return res.status(404).json({ error: err.message });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'JSON mal formado' });
  }
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;

initDb()
  .then(() => app.listen(PORT, () => console.log(`TaskPet API escuchando en http://localhost:${PORT}`)))
  .catch((err) => {
    console.error('Error inicializando la base de datos:', err);
    process.exit(1);
  });

module.exports = app;
