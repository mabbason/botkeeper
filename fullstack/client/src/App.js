import './App.css';
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
import { useMsgs, useMsgsUpdate } from './MsgsContext';


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
  const msgs = useMsgs();
  const updateMsgs = useMsgsUpdate();

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
      updateMsgs(prev => { 
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
    updateMsgs([])
    try {
      apiClient.runTaskQueue(handleEventStream)
    } catch(err) {
      console.log(err);
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
    updateMsgs([])
  }

  const handleDeleteBot = async (bot) => {
    try {
      const newBotTeam = await apiClient.deleteBot(bot);
      setBots(newBotTeam);
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
              {
                bots.map(bot => <Bot 
                                  key={bot.id} 
                                  bot={bot} 
                                  msgs={msgs}
                                  queueIsRunning={queueIsRunning}
                                  handleDeleteBot={handleDeleteBot}
                                />)
              }     
          </Grid>
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;
