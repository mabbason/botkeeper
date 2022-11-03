const { queue } = require('./dependencies');

const Bot = require('../controllers/bot');

describe("The Bot class", () => {
  let bot;
  let running;

  beforeEach(() => {
    running = [];
    bot = new Bot("BettyBot", queue, running);
  });

  test("correct name", () => {
    expect(bot.name).toEqual("BettyBot")
  })


  test("activeTasks array", () => {
    expect(bot.activeTasks).toBeInstanceOf(Array)
    expect(bot.activeTasks.length).toEqual(0)
  })

  test("queue array", () => {
    expect(bot.queue).toBeInstanceOf(Array)
    expect(bot.queue.length).toEqual(10)
  })

  test("running array", () => {
    expect(bot.running).toBeInstanceOf(Array)
    expect(bot.running.length).toEqual(0)
  })

  test("has default maxTests setting", () => {
    expect(bot.maxTasks).toBe(2);
  });

  test("has maxBotsWorking", () => {
    expect(bot.maxBotsWorking).toBe(5);
  });

  //Implement testing for functions next
});