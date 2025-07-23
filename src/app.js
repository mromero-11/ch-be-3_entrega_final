import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js';

import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT||8080;

if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log('✅ MongoDB conectado'))
    .catch(err => {
      console.error('❌ MongoDB connection error:', err);
      process.exit(1);
    });
}

const swaggerDocument = YAML.load('./src/docs/swagger.yaml');

app.use(express.json());
app.use(cookieParser());

app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);

app.use('/api/mocks', mocksRouter);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.name, message: err.message });
});

app.listen(PORT,()=>console.log(`Listening on ${PORT}`))

export default app;
