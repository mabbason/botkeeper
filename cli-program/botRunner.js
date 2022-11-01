const readline = require('readline-sync');
const queuedTasks = require('./queuedTasks');
const Bot = require('./bot');

const taskQueue = {
  queue: queuedTasks,
  running: [],
  botTeam: [],

  welcomeMsg() {
    console.log('Welcome to your Task Bot Runner Program');
    console.log('---------------------------------------\n');
    console.log('To get started please input one name for each bot');
    console.log('that you would like to work on the task queue.\n');
  },

  userInputBotTeam() {
    while(this.botTeam.length === 0) {
      console.log('Comma seperated names, letter characters only please.');
      console.log('(e.g. "BillyBot, BettyBot, BuddyBot")\n')
      console.log('Please input bot names: ');
      const botTeamNames = readline.question();
      
      const ArrayBotNamesCleaned = botTeamNames.replace(/[^a-zA-Z,]/g,'').split(',');
      
      ArrayBotNamesCleaned.forEach(name => {
        if (name.length > 0) {
          this.botTeam.push(new Bot(name, this.queue, this.running));
        }
      })
    }
  },

  pauseToVerify() {
    readline.question('\nPress enter to have your bot team tackle the queue');
    console.log('\n')
  },

  activateEachBot() {
    this.botTeam.forEach(bot => bot.run())
  },

  run() {
    this.welcomeMsg();
    this.userInputBotTeam();
    this.pauseToVerify();
    this.activateEachBot();
  }
}

taskQueue.run();