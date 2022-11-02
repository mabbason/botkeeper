const allowedList = require('./allowedList');

const corsOptions = {
  origin: (origin, callback) => {
    console.log('\nOrigin ', origin);
    if (allowedList.includes(origin) || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  optionsSuccessStatus: 200
}

module.exports = corsOptions;