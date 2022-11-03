import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const Bot = ({ name }) => {

  return (
    <Grid item sx={{ m: 2 }} xs={5} >
      <Paper elevation={2} sx={{ p: 2 }}>
        <Typography variant="h6">{name}</Typography>
      </Paper>
    </Grid>
  );
}

export default Bot
