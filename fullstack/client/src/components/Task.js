import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

const Task = ({ text }) => {

  return (
    <Grid item  sx={{ m: 1 }} xs={8}>
      <Paper elevation={2} sx={{ p: 1 }}>
        {text}
      </Paper>
    </Grid>
  )
}

export default Task