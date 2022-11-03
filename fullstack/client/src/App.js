import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Grid from '@mui/material/Grid';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { cyan } from '@mui/material/colors';
import BotForm from './components/BotForm';
import TaskQueue from './components/TaskQueue';
import Bot from './components/Bot';
import apiClient from './lib/ApiClient';

const theme = createTheme({
  palette: {
    primary: {
      main: cyan[700]
    }
  }
})

function App() {
  const [ tasks, setTasks ] = useState([]);
  const [ bots, setBots ] = useState([]);
  const [ queueIsRunning, setQueueIsRunning ] = useState(false);
  const [ msgs, setMsgs ] = useState([]);


  useEffect(() => {
    const getAllTasks = async () => {
      try {
        let tasks = await apiClient.getAllTasks();
        tasks = tasks.map((t, idx) => { 
          return { ...t, id: idx+1}
        });
        setTasks(tasks)
      } catch(err) {
        console.log(err)
      }
    }
    getAllTasks();
  }, [])

  useEffect(() => {
    const getAllBots = async () => {
      try {
        let bots = await apiClient.getAllBots();
        setBots(bots)
      } catch(err) {
        console.log(err)
      }
    }
    getAllBots();
  }, [])

  useEffect(() => {
    setTasks(tasks.filter(t => !msgs.find(m => m.data.message.includes(t.description))));
  }, [msgs, tasks]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const botName = form.botName.value;
    try {
      const newBotTeam = await apiClient.createNewBot(botName);
      setBots(newBotTeam);
      form.botName.value = ''; 
    } catch(err) {
      console.log(err)
    }
  }

  const handleEventStream = (socket) => {
    socket.emit('runTaskQueue');
    setQueueIsRunning(true)

    socket.on('botMsg', (bot, data) => {
      setMsgs(prev => { 
        const newData = {
          bot,
          data,
          id: prev.length + 1,
        };
        return [...prev, newData ]; 
      });
    })

    socket.on('disconnect', () => {
      setQueueIsRunning(false)
    })
  }

  const handleRunQueue = (event) => {
    event.preventDefault();
    setMsgs([])
    if (bots.length > 0) {
      try {
        apiClient.runTaskQueue(handleEventStream)
      } catch(err) {
        console.log(err);
      }  
    } else {
      alert('You need to add Bots to your team first!');
    }
  }

  const handleResetQueue = async (event) => {
    event.preventDefault();
    try {
      let tasks = await apiClient.getAllTasks();
      tasks = tasks.map((t, idx) => { 
        return { ...t, id: idx+1}
      });
      setTasks(tasks)
    } catch(err) {
      console.log(err)
    }
    setMsgs([])
  }

  const handleDeleteBot = async (bot) => {
    try {
      await apiClient.deleteBot(bot);
      const botsWithoutDeleted = bots.filter(b => b.id !== bot.id);
      console.log(botsWithoutDeleted);
      setBots(botsWithoutDeleted);
    } catch(err) {
      console.log(err)
    }
  }

  
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <AppBar position="sticky" color="primary" >
          <Grid container direction="row" align="center">
            <Grid item xs={4} >
              <img src={require('./assets/images/botkeeper-logo.png')} alt="botkeeper logo" width="200px" />
            </Grid>
            <Grid item xs={8}>
              <Typography variant="h3">Bot Simulation</Typography>
            </Grid>          
          </Grid>
        </AppBar>
        <Container>
          <Grid container direction="row">
            <TaskQueue 
              tasks={tasks}
              queueIsRunning={queueIsRunning}
              handleRunQueue={handleRunQueue}
              handleResetQueue={handleResetQueue}
            />
            <BotForm queueIsRunning={queueIsRunning} handleSubmit={handleSubmit} />
              { bots?.length > 0 
                ? bots.map(bot => <Bot 
                                  key={bot.id} 
                                  bot={bot} 
                                  msgs={msgs}
                                  queueIsRunning={queueIsRunning}
                                  handleDeleteBot={handleDeleteBot}
                                />)
                : <p>Please add bots to your team in order to run the task queue.</p>
              }     
          </Grid>
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;
