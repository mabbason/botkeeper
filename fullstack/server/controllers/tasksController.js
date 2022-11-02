const data = {
  tasks: require('../model/tasks.json'),
  setTasks: function (data) { this.tasks = data }
}
data.tasks = require('../model/tasks.json');
const taskQueue = require('./taskQueue');

const getAllTasks = async (req, res) => {
  res.json(data.tasks);
}

const runTaskQueue = (red, res) => {
  try {
    res.setHeader('Content-Type', 'text/event-stream');
    taskQueue.run(data.tasks, res);
    // return res.status(200).json({ 'message': 'Task queue running.'})
  } catch(err) {
    return res.status(500).json({ 'message': 'Task queue did not run.'})
  }
}

module.exports = { getAllTasks, runTaskQueue }