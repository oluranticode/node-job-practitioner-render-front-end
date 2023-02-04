const express = require('express');
require('dotenv').config();
const app = express();
app.use(express.json());

const port = process.env.PORT || 3004;

// connectDB
const connectDB = require('./db/connect');


// Routers
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');


// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', jobsRouter);

app.get('/', (req, res) => {
  res.send('jobs api 22');
});

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();