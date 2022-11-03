# Botkeeper Bookkeeping Bot-simulation

This repo is Miles Abbason's work for completing the Botkeeper coding challenge.

## Overall Logic
The overall decision to handle 'task running' is the same between the CLI program and the Fullstack version (I wasn't originally planning for both). 
- The overall idea sounded like it would be good for a recurring task queue. The mental model I thought of was the user creates a "team of bots" which processes the task queue until it is done.
- "Allow any number of bots by giving each a name". This with the second requirement of "it should be assigned 2 tasks" I interpreted in the following way:
  - The team of bots is created separately from dividing the the tasks up. When the task queue is run, the tasks are given out 2 at a time to each bot, until the tasks run out, at which point if the user created more than 5 bots in this case, the additional bots would be idling while the first 5 run the task queue.
  - If a single bot is running the task queue, then it takes two tasks, and works until it completes one, at which point it takes another from the queue and so on until it completes processing of the entire queue.
  - for two bots, the same expect that 4 tasks are initially given out, then each proceeds through the queue.
  - no tasks are removed from the queue until the "time" has expired for that task.

## CLI Program

I was originally planning to just do a fullstack implemenation... but I did the 
CLI program the first day when I had a couple simple ideas I was messing around
with and I realized it would only take just a teensie bit more effort to turn it
into a CLI program.

The CLI program is run in NodeJS by `cd` into the `cli-program` directory running `npm install` and then running `node botRunner` for each time to run the program.

## Fullstack

The fullstack program is run by `cd` into `fullstack/server` folder, and run `npm install` then running `npm run dev`, this will start the server on port 5001 and restart it for changes to the backend. Keep that terminal window open while opening a second terminal to start the frontend. `cd` into `fullstack/client` folder and run `npm install` and run `npm start`. This should autimatically open a browser window with the frontend app running in it. If it doesn't, then open a browser window and navigate to `http://localhost:3000`. 

During the course of running the fullstack app, websocket connections will be made over port 5002. Typically there shouldn't be any conflicts but if there are that may be why.

### Event Streaming

I thought it would be fun to implement something with SSE or Websockets for this. It makes sense to me because the running of tasks like this would almost assuredly not be done in the browser. So I had the server doing the work and just providing updates to the frontend to let it know how the work was progressing. This mostly went okay, a little extra time slipped in because I originally had things connected with SSE but there were some persistent bugs, so I pivoted to Websockets to see if that would help. It did help, the communication was definitely easier, but there were some other bugs that I was attributing to SSE that I tracked down as well.

### Material UI

I thought I would give it a go with Material UI, having never worked with it before. This was a pro and a con wrapped into one. The con: I ended up spending more time here as well trying to figure things out in the MUI docs and boiled down to a similar feeling as the "CSS Fiddle" type zone where it's easy to spend time. I ended up just letting a lot of visual things go for the sake of getting things working. The pro: it was great to get a feel for what it's like to work with MUI and it seems like it could be a great tool to really speed up the dev process esp. for MVP type work.

** One of the bugs still in the app is related to my unfamiliarity with MUI, the BotName input form needs to clear on submit. I usually just set the value to `''`, or do `form.reset()` but after a little unsuccessful research I let it be. I think this is related to the way that MUI handles the `FormControl` component but I didn't resolve this yet.

### Database

This probably ended up being my biggest mistake. The project didn't really seem like it needed a "real" database so I just used a simple fs.write operation to update a json. This mostly works fine... mostly. But there is a persistent (and inconsistent) bug that I don't think will be solved unless it is hooked up to a real database. Hindsight it wouldn't have taken that long to get Mongo going, but I was trying for expediency and it cost a little in the end.

### Testing

The testing is definitely thin. I am not familiar with testing MUI components, or if there is even a difference so I just figured I would start by adding tests to the backend first. I never made it to the frontend for testing and even the backend is very thin. So this would definitely be a future work type thing.