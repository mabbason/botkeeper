const data = {};
data.bots = require('../model/bots.json');
const Bot = require('./bot');

const taskQueue = {
  queue: [],
  running: [],
  botTeam: [],
  isDone: [],

  initTaskQueue(tasks) {
    this.queue = [...tasks];
    this.running = [];
    this.botTeam = [];
    this.isDone = [];
  },

  initBotTeam() {
    data.bots.forEach(b => {
      this.botTeam.push(new Bot(b.name, this.queue, this.running))
    });
  },

  activateEachBot(socket, isDone, botTeam) {
    this.botTeam.forEach(bot => bot.run(socket, isDone, botTeam))
  },

  run(tasks, socket) {
    this.initTaskQueue(tasks);
    this.initBotTeam();
    this.activateEachBot(socket, this.isDone, this.botTeam);
  }
}

module.exports = taskQueue;