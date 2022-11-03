const io = require('socket.io')(5002, {
  cors: {
    origin: ['http://localhost:3000'],
  }
})
const data = {};
data.tasks = require('../model/tasks.json');
const taskQueue = require('./taskQueue');

const getAllTasks = async (req, res) => {
  res.json(data.tasks);
}
//SSE Version
// const runTaskQueue = (req, res) => {
//   try {
//     const headers = {
//       'Content-Type': 'text/event-stream',
//       'Connection': 'keep-alive',
//       'Cache-Control': 'no-cache'
//     };
//     res.writeHead(200, headers);
//     console.log(`Run task queue connection opened...`);
//     taskQueue.run(data.tasks, res);
//     req.on('close', () => {
//       console.log(`...Run task queue connection closed`);
//     });
//   } catch(err) {
//     return res.status(500).json({ 'message': 'Task queue did not run.'})
//   }
// }



//WebSocket Version
io.on("connection", (socket) => {
  console.log(`New socket connection @ ${socket.id}`);
  const tasks = require('../model/tasks.json');

  socket.on('runTaskQueue', () => {
    console.log(`Run task queue connection opened...`);
    taskQueue.run(tasks, socket);
  })
  
  socket.on("disconnect", () => {
    console.log(`${socket.id} connection closed.`);
  });
})


module.exports = { getAllTasks }