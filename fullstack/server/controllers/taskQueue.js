const data = {};
data.bots = require('../model/bots.json');
const Bot = require('./bot');

const taskQueue = {
  queue: [],
  running: [],
  botTeam: [],

  initTaskQueue(tasks) {
    this.queue = [...tasks]
  },

  initBotTeam() {
    data.bots.forEach(b => {
      this.botTeam.push(new Bot(b.name, this.queue, this.running))
    });
  },

  activateEachBot(res) {
    this.botTeam.forEach(bot => bot.run(res))
  },

  run(tasks, res) {
    this.initTaskQueue(tasks);
    this.initBotTeam();
    this.activateEachBot(res);
  }
}

module.exports = taskQueue;