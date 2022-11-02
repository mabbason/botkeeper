const express = require('express');
const tasksController = require('../../controllers/tasksController');
const router = express.Router();

router.route('/')
  .get(tasksController.getAllTasks)

router.route('/run')
  .get(tasksController.runTaskQueue)

module.exports = router;