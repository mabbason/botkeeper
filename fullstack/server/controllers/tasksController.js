const data = {
  tasks: require('../model/tasks.json'),
  setTasks: function (data) { this.tasks = data }
}
data.tasks = require('../model/tasks.json');

const getAllTasks= async (req, res) => {
  res.json(data.tasks);
}

module.exports = { getAllTasks }