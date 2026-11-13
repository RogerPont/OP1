const Task = require('../models/Task');

// 1. Crear una nova tasca (POST /api/tasks)
const createTask = async (req, res) => {
  try {
    const taskData = { ...req.body };

    // Si es crea directament com a completada
    if (taskData.completed === true) {
      taskData.finished_at = new Date();
    } else if (taskData.completed === false) {
      taskData.finished_at = null;
    }

    const newTask = new Task(taskData);
    const savedTask = await newTask.save();
    return res.status(201).json(savedTask);
  } catch (error) {
    return res.status(400).json({
      message: 'Error en crear la tasca',
      error: error.message
    });
  }
};

// 2. Obtenir totes les tasques (GET /api/tasks)
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).json({
      message: 'Error en obtenir les tasques',
      error: error.message
    });
  }
};

// 3. Obtenir una tasca específica pel seu ID (GET /api/tasks/:id)
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Tasca no trobada' });
    }

    return res.status(200).json(task);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Tasca no trobada' });
    }
    return res.status(500).json({
      message: 'Error en obtenir la tasca',
      error: error.message
    });
  }
};

// 4. Actualitzar una tasca específica pel seu ID (PUT /api/tasks/:id)
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Gestió automàtica de finished_at segons completed
    if (updateData.completed === true) {
      updateData.finished_at = new Date();
    } else if (updateData.completed === false) {
      updateData.finished_at = null;
    }

    const updatedTask = await Task.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!updatedTask) {
      return res.status(404).json({ message: 'Tasca no trobada' });
    }

    return res.status(200).json(updatedTask);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Tasca no trobada' });
    }
    return res.status(400).json({
      message: 'Error en actualitzar la tasca',
      error: error.message
    });
  }
};

// 5. Eliminar una tasca específica pel seu ID (DELETE /api/tasks/:id)
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: 'Tasca no trobada' });
    }

    return res.status(200).json({
      message: 'Tasca eliminada correctament',
      task: deletedTask
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Tasca no trobada' });
    }
    return res.status(500).json({
      message: 'Error en eliminar la tasca',
      error: error.message
    });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask
};

