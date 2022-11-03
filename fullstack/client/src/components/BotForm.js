import { useState } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FilledInput from '@mui/material/FilledInput';
import Button from '@mui/material/Button';

const BotForm = ({ handleSubmit }) => {
  const [name, setName] = useState('');

  const handleChange = (event) => {
    const inputChar = event.target.value;
    if (/[a-zA-Z]+$/.test(inputChar) || inputChar === '') {
      setName(inputChar);
    }
  };

  return (
    <Grid item sx={{ m: 2 }} xs={12} >
      <Paper elevation={2} sx={{ p: 2 }}>
        <Typography variant="h6">Create your team of bots to tackle the queue</Typography>
        <form onSubmit={handleSubmit} >
          <FormControl fullWidth sx={{ m: 1 }} variant="filled">
            <InputLabel htmlFor="bot-name">BotName (Letter chars only) </InputLabel>
            <FilledInput
              id="bot-name"
              name="botName"
              value={name}
              onChange={handleChange}
            />
          </FormControl>
          <Button variant="contained" type="submit">Submit</Button>          
        </form>
      </Paper>
    </Grid>
  );
}

export default BotForm
