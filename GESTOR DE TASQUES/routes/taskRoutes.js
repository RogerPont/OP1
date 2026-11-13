const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Rutes per a l'API de tasques (/api/tasks)
router.post('/', taskController.createTask);
router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;

