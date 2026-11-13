const mongoose = require('mongoose');

// Definició de l'esquema per al model Task
const taskSchema = new mongoose.Schema({
  // Títol (title): camp obligatori que descriu el nom de la tasca.
  title: {
    type: String,
    required: [true, 'El títol és obligatori'],
    trim: true
  },
  // Descripció (description): camp opcional per detallar la tasca.
  description: {
    type: String,
    trim: true
  },
  // Cost (cost): camp obligatori que indica el cost estimat de la tasca. No pot ser negatiu.
  cost: {
    type: Number,
    required: [true, 'El cost és obligatori'],
    min: [0, 'El cost no pot ser negatiu']
  },
  // Previsió d'hores (hours_estimated): camp obligatori que especifica el temps estimat per completar la tasca. No pot ser negatiu.
  hours_estimated: {
    type: Number,
    required: [true, "La previsió d'hores és obligatòria"],
    min: [0, "La previsió d'hores no pot ser negativa"]
  },
  // Hores reals (hours_real): camp opcional per registrar el temps real invertit en la tasca. No pot ser negatiu.
  hours_real: {
    type: Number,
    min: [0, 'Les hores reals no poden ser negatives'],
    default: 0
  },
  // Imatge (image): camp opcional per guardar la URL o la ruta d'una imatge relacionada amb la tasca.
  image: {
    type: String,
    trim: true
  },
  // Completada (completed): camp booleà que indica si la tasca està completada. Per defecte, false.
  completed: {
    type: Boolean,
    default: false
  },
  // Data de finalització (finished_at): camp opcional que guarda la data i l'hora en què la tasca es completa.
  finished_at: {
    type: Date,
    default: null
  },
  // Data de creació (createdAt): camp automàtic que registra la data i l'hora en què es crea la tasca.
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Task', taskSchema);

