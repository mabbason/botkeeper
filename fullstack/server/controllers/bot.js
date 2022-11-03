class Bot {
  constructor(name, queue, running, maxTasks = 2) {
    this.name = name;
    this.activeTasks = [];
    this.queue = queue;
    this.running = running;
    this.maxTasks = maxTasks;
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
  
  async run(socket) {  
    //Initial load of tasks for bot into internal queue
    while (this.queue.length > 0 && this.activeTasks.length < this.maxTasks) {
      let currIdx = this.activeTasks.length;
      let task = this.getNextTask();
      if (!task) break;
      this.activeTasks[currIdx] = this.runSingleTask(task, currIdx);
    }
  
    //Ongoing processing of completeing and aquiring new tasks
    while (this.queue.length > 0) {
      socket.on('disconnect', () => {
        this.queue = [];
      })
      try {
        let completed = await Promise.race(this.activeTasks)
        this.completeTask(completed.task);
        // res.write(`data: ${this.name} completed task: ${completed.task.description}\n\n`)
        socket.emit('botMsg', { name: this.name },  { message:`Completed ${completed.task.description}` })
        console.log(`${this.name} completed task: ${completed.task.description}`)  
  
        let nextTask = this.getNextTask();
        if(!nextTask) break;
  
        let idx = completed.index;     
        this.activeTasks[idx] = this.runSingleTask(nextTask, idx)  
      } catch(err) {
        console.log(err)
      }
    }
    await Promise.all(this.activeTasks);
    // res.write(`data: ${this.name}: all tasks completed! \n\n`);
    socket.emit('botMsg', { name: this.name },  { message:`Completed all tasks!` })
    console.log(`\nAll tasks completed for ${this.name}`) 
  }
}

module.exports = Bot