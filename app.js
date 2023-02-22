require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

// extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

// connectDB
const connectDB = require('./db/connect');

const authenticateUser = require('./middleware/authentication');

// error handler
// const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
// extra packages
app.set(' trust proxy', 1);
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, //limit each IP to 100 request per windowMs
}));
app.use(helmet())
app.use(cors())
app.use(xss())


// Routers
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');


// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);


// Swagger
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

// app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3005;

app.get('/', (req, res) => {
  // res.send('jobs api 22');
  res.send('<h1>Jobs API</h1><a href="/api-docs">Documentation</a>');

});
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));


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
