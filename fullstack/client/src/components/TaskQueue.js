import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Task from './Task';
import Button from '@mui/material/Button';

const TaskQueue = ({ tasks, handleRunQueue }) => {

  return (
    <Grid item sx={{ m: 2 }} xs={12} >
      <Paper elevation={2} sx={{ p: 2 }}>
        <Typography variant="h5">Task Queue</Typography>
        <Grid container>
          <Grid item xs={6} >
            {
              tasks.filter(task => task.id % 2 !== 0)
                    .map(task => {
                      return <Task key={task.id} text={task.description} />
                    })
            }
          </Grid>
          <Grid item xs={6} >
            {
              tasks.filter(task => task.id % 2 === 0)
                    .map(task => {
                      return <Task key={task.id} text={task.description} />
                    })
            }
          </Grid> 
        </Grid>
        <Button variant="contained" type="button" onClick={handleRunQueue}>Run Task Queue</Button>   
      </Paper>
    </Grid>
  );
}

export default TaskQueue
