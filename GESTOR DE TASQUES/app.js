const express = require('express');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Middleware per interpretar peticions JSON
app.use(express.json());

// Rutes per al recurs de tasques
app.use('/api/tasks', taskRoutes);

// Ruta arrel informativa
app.get('/', (req, res) => {
  res.json({ message: 'API REST Gestor de Tasques' });
});

module.exports = app;

