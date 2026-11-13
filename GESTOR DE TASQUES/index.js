require('dotenv').config();

const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskmanager';

// Connexió a la base de dades MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connexió establerta correctament a MongoDB');
  })
  .catch((err) => {
    console.error('Error connectant a MongoDB:', err.message);
    console.log('Revisa que MongoDB estigui engegat o comprova el teu MONGO_URI a .env');
  });

// Arrenquem el servidor Express
app.listen(PORT, () => {
  console.log(`Servidor escoltant a http://localhost:${PORT}`);
});
