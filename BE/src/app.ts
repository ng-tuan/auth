import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import sequelize from './config/db';
import authController from './controllers/authController';
import commonController from './controllers/commonController';
import imageController from './controllers/imageController';
import infoController from './controllers/infoController';
import categoryController from './controllers/categoryController';

dotenv.config();

const app = express();

// Configure CORS
app.use(
  cors({
    origin: 'http://localhost:3001',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  }),
);

app.use(express.json());

app.use('/api/auth', authController);
app.use('/api/image', imageController);
app.use('/api/com', commonController);
app.use('/api/info', infoController);
app.use('/api/category', categoryController);

const PORT = process.env.PORT || 3000;

sequelize
  .sync()
  .then((): void => {
    app.listen(PORT, (): void => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err: Error): void => {
    console.error('Unable to connect to the database:', err);
  });
