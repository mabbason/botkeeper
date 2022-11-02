const express = require('express');
const tasksController = require('../../controllers/tasksController');
const router = express.Router();

router.route('/')
  .get(tasksController.getAllTasks)

module.exports = router;