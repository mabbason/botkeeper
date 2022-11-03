class Bot {
  constructor(name, queue, running, maxTasks = 2) {
    this.name = name;
    this.activeTasks = [];
    this.queue = queue;
    this.running = running;
    this.maxTasks = maxTasks;
    this.numOfBotsWorking = (queue.length / maxTasks) + (queue.length % maxTasks);
  }

  runSingleTask(task, index) {
    this.running.push(task);
    return new Promise((res, rej) => {
      setTimeout(() => {
        res({ task, index })
      }, task.duration)
    })
  }
  
  getNextTask() {
    for (let i = 0; i < this.queue.length; i += 1) {
      let currTask = this.queue[i];
      let found = this.running.find(task => task.description === currTask.description)
      if (found) continue;
      return currTask;
    }
    return null
  }
  
  completeTask(task) {
    const completedQIdx = this.queue.findIndex(curr => task.description === curr.description);
    this.queue.splice(completedQIdx, 1)
    const completedIdx = this.running.findIndex(curr => task.description === curr.description);
    this.running.splice(completedIdx, 1)
  }

  checkForDisconnect(socket, isDone) {
    if (isDone.length >=  this.numOfBotsWorking) {
      socket.disconnect();
    }
  }
  
  async run(socket, isDone, botTeam) {  
    //Initial load of tasks for bot into internal queue
    while (this.queue.length > 0 && this.activeTasks.length < this.maxTasks) {
      let currIdx = this.activeTasks.length;
      let task = this.getNextTask();
      if (!task) break;
      this.activeTasks[currIdx] = this.runSingleTask(task, currIdx);
    }
  
    //Ongoing processing of completeing and aquiring new tasks
    let completed;
    while (this.queue.length > 0) {
      socket.on('disconnect', () => {
        this.queue = [];
      })
      try {
        completed = await Promise.race(this.activeTasks)
        this.completeTask(completed.task);

        socket.emit('botMsg', { name: this.name },  { message:`Completed ${completed.task.description}` })       
        let idx = completed.index; 
        let nextTask = this.getNextTask();
        if(!nextTask) {
          this.activeTasks.splice(idx, 1);
          break;
        }
  
            
        this.activeTasks[idx] = this.runSingleTask(nextTask, idx)  
      } catch(err) {
        console.log(err)
      }
    }
    completed = await Promise.all(this.activeTasks);
    socket.emit('botMsg', { name: this.name },  { message:`Completed ${completed[0].task.description}` })
    
    socket.emit('botMsg', { name: this.name },  { message:`Completed all tasks!` })
    console.log(`\nAll tasks completed for ${this.name}`) 

    isDone.push(this.name);
    this.checkForDisconnect(socket, isDone, botTeam);
  }
}

module.exports = Bot