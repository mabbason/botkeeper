import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Task from './Task';
import Button from '@mui/material/Button';


const Bot = ({ bot, msgs, queueIsRunning, handleDeleteBot }) => {

  const handleDelete = (event) => {
    event.preventDefault();
    handleDeleteBot(bot)
  }

  return (
    <Grid item sx={{ m: 2 }} xs={5} >
      <Paper elevation={2} sx={{ p: 2 }}>
        <Typography variant="h6">{bot.name}</Typography>
        <Grid container>
          <Grid item xs={11} >
            {
              msgs.filter(msg => msg.bot.name === bot.name)
                  .map(msg => {
                      return <Task key={msg.id} text={msg.data.message} />
                  })
            }
          </Grid>
          <Button variant="contained" disabled={queueIsRunning} size="small" onClick={handleDelete}>Delete</Button>
        </Grid>
      </Paper>
    </Grid>
  );
}

export default Bot
