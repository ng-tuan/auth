import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import swaggerUi from 'swagger-ui-express';
import { swaggerOptions } from './config/swagger';
import sequelize from './config/db';
import authController from './controllers/authController';
import commonController from './controllers/commonController';
import imageController from './controllers/imageController';
import infoController from './controllers/infoController';
import categoryController from './controllers/categoryController';
import { createChatController } from './controllers/chatController';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST'],
  },
});

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

// Swagger documentation
app.use(
  '/api/swagger-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerOptions.swaggerDefinition),
);

app.use('/api/auth', authController);
app.use('/api/image', imageController);
app.use('/api/com', commonController);
app.use('/api/info', infoController);
app.use('/api/category', categoryController);
app.use('/api/chat', createChatController(io));

const PORT = process.env.PORT || 3000;

sequelize
  .sync()
  .then((): void => {
    httpServer.listen(PORT, (): void => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err: Error): void => {
    console.error('Unable to connect to the database:', err);
  });
