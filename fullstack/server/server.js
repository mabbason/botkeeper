const express = require('express');
const http = require('http');
const path = require('path');
const { errorHandler } = require('./middleware/errorHandler')
const cors = require('cors');
// const corsOptions = require('./config/corsOptions');

const app = express();
const PORT = process.env.PORT || 5001;

const server = http.createServer(app);

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/bots', require('./routes/api/bots'));
app.use('/tasks', require('./routes/api/tasks'));

app.all('*', (req, res) => {
  res.status(404)
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ error: "404: Not Found"})
  } else {
    res.type(txt).send("404 Not Found")
  }
})

app.use(errorHandler)

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



