const io = require('socket.io')(5002, {
  cors: {
    origin: true,
  }
})
const tasksDB = {
  tasks: require('../model/tasks.json'),
  setTasks: function (data) { this.tasks = data }
}
const taskQueue = require('./taskQueue');

const getAllTasks = async (req, res) => {
  if (tasksDB.tasks.length !== 10) {
    console.log("Not all tasks!!!", tasksDB.tasks)
  }
  res.json(tasksDB.tasks);
}
io.on("connection", (socket) => {
  console.log(`New socket connection @ ${socket.id}`);
  const tasks = tasksDB.tasks;
  
  socket.on('runTaskQueue', () => {
    console.log(`Run task queue connection opened...`);
    taskQueue.run(tasks, socket);
  })
  
  socket.on("disconnect", () => {
    console.log(`${socket.id} connection closed.`);
  });
})


module.exports = { getAllTasks }