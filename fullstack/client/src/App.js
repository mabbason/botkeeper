import './App.css';
import { useState, useEffect, useRef } from 'react';
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

  const msgsRef = useRef();

  useEffect(() => {
    msgsRef.current = msgs;
  }, [msgs]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const botName = event.target.botName.value;
    
    
  }

  const handleEventStream = (socket) => {
    // console.log("msgsRef", msgsRef.current);
    socket.emit('runTaskQueue');
    
    const botsDone = [];
    socket.on('botMsg', (bot, data) => {
      console.log(bot.name, data.message);

      //I think my issue is here... I want to track the incoming messages
      // but it won't save my messages.
      updateMsgs([...msgs, { bot, data }])

      if (data.message === 'Completed all tasks!') {
        botsDone.push(bot.name);
        if (botsDone.length === bots.length) {
          socket.disconnect();
          console.log(botsDone);
        }
      }
    })
  }

  const handleRunQueue = (event) => {
    event.preventDefault();
    // msgsRef.current = [];
    updateMsgs([]);
    console.log('Running Queue')
    try {
      apiClient.runTaskQueue(handleEventStream)
    } catch(err) {
      console.log(err);
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
            <TaskQueue tasks={tasks} handleRunQueue={handleRunQueue} />
            <BotForm handleSubmit={handleSubmit}></BotForm>
              {
                bots.map(bot => <Bot key={bot.id} name={bot.name} />) //completedTasks={msgsRef.current}
              }     
          </Grid>
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;
