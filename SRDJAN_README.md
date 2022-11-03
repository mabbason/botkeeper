I know... there is a lot going on. I tried to clean it up but I am in process what can I say :)

The big idea:

1) Run a task queue on the server and send the 'task completed' message to the client as a bot completes each task

2) To see that the task queue logic is running properly you can run the CLI program in the other root folder

3) I got that same functionality ported over to a fullstack version
  - that process is kicked off from the `taskController` with the sockets at the bottom
  - I got sockets working, but I am getting incorrect data somewhere along the line.
    - backend and frontend log to the console to see what happens
  - to start the process, from the frontend page, click 'Run Task Queue' to kick off the socket connection.
  - from a fresh start the program works fine, but when I click the button a second/third/etc time, the backend immediately reports back that all tasks are completed, THEN populates the task list with a fresh set of tasks... but bc both Bots reported done already, the frontend closes the connection. That's one problem.

  4) The other problem is a state problem on the frontend. I think it has to do with the render loop and I am accessing an old variable state but my brain just isn't getting there.

  LINE 81-83 in App.js

  I had some limited success with useRef hook, but I couldn't replicate it and didn't figure it out yet.
  
I tried this whole thing first with SSE and I almost had it working, but I kept getting wrong information from the backend and having trouble with closing the connection. So I tried with websockets. It is better, but still not right. I think the problems aren't with the sockets themselves but what's going on around it.